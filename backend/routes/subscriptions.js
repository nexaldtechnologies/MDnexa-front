const express = require('express');
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) console.error('[STRIPE_ERROR] Missing STRIPE_SECRET_KEY');
else console.log('[STRIPE_DEBUG] Initialized with key length:', stripeKey.length);

const stripe = require('stripe')(stripeKey);
const supabase = require('../utils/supabase');
const { requireAuth } = require('./auth');

const router = express.Router();

// Price tier configuration
const PUBLIC_PAID_PRICES = {
    monthly: 'price_1SYuANFvNzuNoc9FLyLTf8ny',
    yearly: 'price_1SYuB2FvNzuNoc9FjxK1LNyV'
};

const TEAM_FREE_PRICES = [
    'price_1SYuANFvNzuNoc9FLyLTf8ny',  // Admin free
    'price_1SZ697FvNzuNoc9FmEi2o0aG',  // Friends free
    'price_1SZ69SFvNzuNoc9F3gKvme1n',  // Team lifetime
    'price_1SZ6BaFvNzuNoc9FAnh104Sn'   // Team temporary
];

// Create Stripe Checkout Session
router.post('/create-checkout-session', requireAuth, async (req, res) => {
    const { priceId } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    try {
        // Get or create customer
        let { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', userId)
            .single();

        let customerId = profile?.stripe_customer_id;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: userEmail,
                metadata: { userId },
            });
            customerId = customer.id;
            await supabase
                .from('profiles')
                .update({ stripe_customer_id: customerId })
                .eq('id', userId);
        }

        // Determine if this is a public paid plan (eligible for 30-day trial)
        const isPublicPaidPlan = Object.values(PUBLIC_PAID_PRICES).includes(priceId);
        const isTeamFreePlan = TEAM_FREE_PRICES.includes(priceId);

        // Build checkout session configuration
        const sessionConfig = {
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/pricing`,
            metadata: {
                userId: userId
            }
        };

        // Add 30-day trial for public paid plans only
        if (isPublicPaidPlan && !isTeamFreePlan) {
            sessionConfig.subscription_data = {
                trial_period_days: 30
            };
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Subscription Status
router.get('/status', requireAuth, async (req, res) => {
    const userId = req.user.id;

    try {
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .single();

        res.json({ subscription });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Billing Portal Session
router.post('/create-portal-session', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const userEmail = req.user.email;

    try {
        // 1. Check Profiles Table
        let { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', userId)
            .single();

        let customerId = profile?.stripe_customer_id;

        // 2. Fallback: Check User Metadata if not in Profile
        if (!customerId && req.user.user_metadata?.stripe_customer_id) {
            console.log('[STRIPE_DEBUG] Found Customer ID in user_metadata');
            customerId = req.user.user_metadata.stripe_customer_id;
        }

        if (!customerId) {
            console.log('[STRIPE_DEBUG] No Customer ID found. Creating one...');
            const customer = await stripe.customers.create({
                email: userEmail,
                metadata: { userId },
            });
            customerId = customer.id;

            // 3. Try Saving to Profiles (Primary Storage)
            try {
                // Try Update first
                const { error: upErr, data: upData } = await supabase
                    .from('profiles')
                    .update({ stripe_customer_id: customerId })
                    .eq('id', userId)
                    .select();

                // If Update failed (no row), try Insert
                if (upErr || !upData || upData.length === 0) {
                    const { error: insErr } = await supabase
                        .from('profiles')
                        .insert({ id: userId });

                    if (insErr) throw insErr; // Trigger fallback to catch block

                    // Update again after insert
                    await supabase
                        .from('profiles')
                        .update({ stripe_customer_id: customerId })
                        .eq('id', userId);
                }
            } catch (dbError) {
                console.warn('[STRIPE_WARN] Failed to save to profiles table, falling back to user_metadata:', dbError.message);

                // 4. Fallback Storage: User Metadata
                // This bypasses triggers/schema issues in 'profiles' table
                const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
                    user_metadata: {
                        ...req.user.user_metadata,
                        stripe_customer_id: customerId
                    }
                });

                if (authError) {
                    console.error('[STRIPE_ERROR] Critical: Failed to save to both profiles and metadata:', authError);
                    throw authError;
                }
            }
        }

        console.log('[STRIPE_DEBUG] Creating portal session for:', customerId);

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.FRONTEND_URL}/dashboard`,
        });

        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
