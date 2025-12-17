const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const supabase = require('../utils/supabase');

const router = express.Router();

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event.data.object);
                break;
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                await handleSubscriptionUpdated(event.data.object);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error) {
        console.error('Error handling webhook event:', error);
        return res.status(500).send('Webhook handler failed');
    }

    res.send();
});

async function handleCheckoutSessionCompleted(session) {
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    // Retrieve the subscription to get the plan ID
    let priceId = null;
    let subscription = null;
    if (subscriptionId) {
        subscription = await stripe.subscriptions.retrieve(subscriptionId);
        priceId = subscription.items.data[0].price.id;
    }

    // 1. Identify the User
    // Try client_reference_id first (we set this in PricingPage)
    // Then try metadata.user_id
    // Then try email lookup
    let userId = session.client_reference_id || session.metadata?.user_id;

    if (!userId && session.customer_details?.email) {
        // Fallback: lookup by email
        // Note: auth.users is not directly accessible via supabase client usually unless using admin api listUsers, 
        // but we might look for a profile directly if we assume email is consistent? 
        // Actually, profiles don't translate email -> id. 
        // We will try to find a profile via stripe_customer_id if it exists.
    }

    let profile = null;

    if (userId) {
        const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
        profile = data;
    } else if (customerId) {
        const { data } = await supabase.from('profiles').select('*').eq('stripe_customer_id', customerId).single();
        profile = data;
    }

    // If still no profile, we can't do much for referrals or subscription linking
    if (!profile) {
        console.log('No profile found for session', session.id);
        return;
    }

    // 2. Handle Referral Tracking
    if (profile.ref_source) {
        const referralCode = profile.ref_source;
        const REFERRAL_TABLES = ['ambassador_referrals', 'team_referrals', 'family_referrals'];

        // Find matching referral
        for (const table of REFERRAL_TABLES) {
            const { data: refRows } = await supabase.from(table).select('*').eq('ref_code', referralCode);
            if (refRows && refRows.length > 0) {
                const refRow = refRows[0];
                if (refRow.active) {
                    const newCount = (refRow.used_count || 0) + 1;
                    const updates = { used_count: newCount };

                    if (refRow.max_uses > 0 && newCount >= refRow.max_uses) {
                        updates.active = false;
                    }

                    await supabase.from(table).update(updates).eq('ref_code', referralCode);
                    console.log(`Tracked referral ${referralCode} in ${table}`);
                    break; // Stop after first match
                }
            }
        }
    }

    // 3. Link Subscription (Existing Logic)
    if (subscription) {
        await supabase.from('subscriptions').upsert({
            user_id: profile.id,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan_id: priceId,
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000),
        });

        // Ensure profile has stripe_customer_id
        if (!profile.stripe_customer_id) {
            await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', profile.id);
        }
    }
}

async function handleSubscriptionUpdated(subscription) {
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', subscription.customer)
        .single();

    if (profile) {
        await supabase
            .from('subscriptions')
            .upsert({
                user_id: profile.id,
                stripe_customer_id: subscription.customer,
                stripe_subscription_id: subscription.id,
                plan_id: subscription.items.data[0].price.id,
                status: subscription.status,
                current_period_end: new Date(subscription.current_period_end * 1000),
            }, { onConflict: 'stripe_subscription_id' });
    }
}

module.exports = router;
