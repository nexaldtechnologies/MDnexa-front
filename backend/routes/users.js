const express = require('express');
const supabase = require('../utils/supabase');
const { requireAuth } = require('./auth');
const transporter = require('../utils/email');

const router = express.Router();

// Accept Terms & Conditions
router.post('/accept-terms', requireAuth, async (req, res) => {
    const userId = req.user.id;

    try {
        const { data, error } = await supabase
            .from('profiles')
            .update({ accepted_terms_at: new Date().toISOString() })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, profile: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Current User Profile
router.get('/me', requireAuth, async (req, res) => {
    const userId = req.user.id;

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

        if (error) throw error;

        // If no profile found, return basic user info from auth if possible, or 404/null
        if (!data) {
            return res.json({ id: userId, email: req.user.email, full_name: req.user.user_metadata?.full_name || '' });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deactivate/Delete Account
router.delete('/delete-account', requireAuth, async (req, res) => {
    const userId = req.user.id;

    try {
        // Send Goodbye Email
        const email = req.user.email;
        if (email) {
            try {
                const fromAddr = process.env.MAIL_FROM || '"MDnexa Support" <noreply@mdnexa.com>';
                console.log('[USER_DELETE_DEBUG] Sending goodbye email:', { from: fromAddr, to: email });

                await transporter.sendMail({
                    from: fromAddr,
                    to: email,
                    subject: 'Your account has been deactivated - MDnexa',
                    html: `
                        <div style="font-family: sans-serif; padding: 20px;">
                            <h2>Account Deactivated</h2>
                            <p>We're sorry to see you go. Your account has been successfully deactivated and your data has been removed.</p>
                            <p>If you change your mind, you will need to create a new account.</p>
                            <p>Best regards,<br>The MDnexa Team</p>
                        </div>
                    `,
                });
                console.log('Deactivation email sent to', email);
            } catch (emailError) {
                console.error('Failed to send deactivation email:', emailError);
                // Continue with deletion even if email fails
            }
        }

        // Delete user from Supabase Auth (admin privilege required)
        const { error } = await supabase.auth.admin.deleteUser(userId);

        if (error) throw error;

        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'Failed to delete account. Please try again.' });
    }
});

module.exports = router;
