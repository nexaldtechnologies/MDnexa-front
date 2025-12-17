const express = require('express');
const supabase = require('../utils/supabase');
const router = express.Router();

const REFERRAL_TABLES = [
    'ambassador_referrals',
    'team_referrals',
    'family_referrals',
    'crm_contacts' // Assuming crm_contacts follows the same schema for ref usage
];

// GET /api/referrals/validate?code=XYZ
router.get('/validate', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ valid: false, message: 'Code is required' });
    }

    try {
        // Iterate through tables to find the code
        for (const table of REFERRAL_TABLES) {
            const { data, error } = await supabase
                .from(table)
                .select('*')
                .eq('ref_code', code)
                .select(); // Ensure we get data

            // Note: .single() might error if multiple or zero, so simpler to check .length

            if (error) {
                console.error(`Error querying ${table}:`, error);
                continue; // Try next table
            }

            if (data && data.length > 0) {
                const referral = data[0];

                // Check if active
                if (referral.active === false) {
                    return res.json({ valid: false, message: 'Referral code is inactive' });
                }

                // Check max uses
                if (referral.max_uses > 0 && referral.used_count >= referral.max_uses) {
                    return res.json({ valid: false, message: 'Referral code usage limit reached' });
                }

                // Valid!
                return res.json({
                    valid: true,
                    table: table,
                    code: referral.ref_code,
                    promo_code: referral.promo_code,
                    discount_percent: referral.discount_percent,
                    category: referral.category
                });
            }
        }

        // If loop finishes without return, code not found
        return res.json({ valid: false, message: 'Invalid referral code' });

    } catch (error) {
        console.error('Validation Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/referrals/track
router.post('/track', async (req, res) => {
    const { code, table } = req.body;

    if (!code || !table) {
        return res.status(400).json({ error: 'Code and table are required' });
    }

    // Security check: ensure table is one of the allowed list
    if (!REFERRAL_TABLES.includes(table)) {
        return res.status(400).json({ error: 'Invalid table' });
    }

    try {
        // Increment used_count
        // We can do this safely via RPC if exists, or read-modify-write. 
        // Read-modify-write is susceptible to race conditions but acceptable for this scale.
        // Better: supabase.rpc('increment_field', ...) if you have that helper.
        // For now, let's just fetch current and update. 
        // Actually, for simple atomic increments without RPC, we can't easily do "current + 1" in one query with standard client syntax unless we use a custom sql function or raw sql manually?
        // Supabase client doesn't support "increment" natively in .update().
        // We will do fetch -> update.

        const { data: currentData, error: fetchError } = await supabase
            .from(table)
            .select('used_count')
            .eq('ref_code', code)
            .single();

        if (fetchError || !currentData) throw new Error('Ref not found for tracking');

        const newCount = (currentData.used_count || 0) + 1;

        const { error: updateError } = await supabase
            .from(table)
            .update({ used_count: newCount })
            .eq('ref_code', code);

        if (updateError) throw updateError;

        res.json({ success: true });

    } catch (error) {
        console.error('Tracking Error:', error);
        res.status(500).json({ error: 'Failed to track referral' });
    }
});

module.exports = router;
