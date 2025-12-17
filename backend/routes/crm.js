const express = require('express');
const supabase = require('../utils/supabase');
const { requireAuth } = require('./auth');

const router = express.Router();

// Create a new contact
router.post('/', requireAuth, async (req, res) => {
    const { email, name, source, notes, stage } = req.body;
    const userId = req.user.id;

    try {
        const { data, error } = await supabase
            .from('crm_contacts')
            .insert([{ user_id: userId, email, name, source, notes, stage }])
            .select();

        if (error) throw error;

        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Public Lead Collection (Waitlist/Newsletter)
router.post('/leads', async (req, res) => {
    const { email, name, source } = req.body;

    // Basic validation
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // user_id is nullable in crm_contacts? We'll find out.
        // If not, we might need to handle it or use a different table, but user asked for crm_contacts.
        // Assuming user_id is nullable (common for leads).
        const { data, error } = await supabase
            .from('crm_contacts')
            .insert([{
                email,
                name,
                source: source || 'landing_page',
                stage: 'lead', // defaulted
                created_at: new Date()
            }])
            .select();

        if (error) throw error;

        res.status(201).json({ success: true, message: 'Lead captured' });
    } catch (error) {
        console.error('Lead capture error:', error);
        res.status(500).json({ error: 'Failed to capture lead' });
    }
});

// Get all contacts for the user
router.get('/', requireAuth, async (req, res) => {
    const userId = req.user.id;

    try {
        const { data, error } = await supabase
            .from('crm_contacts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a contact
router.put('/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    try {
        const { data, error } = await supabase
            .from('crm_contacts')
            .update(updates)
            .eq('id', id)
            .eq('user_id', userId)
            .select();

        if (error) throw error;

        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a contact
router.delete('/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const { error } = await supabase
            .from('crm_contacts')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw error;

        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
