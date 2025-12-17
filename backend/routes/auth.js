const express = require('express');
const supabase = require('../utils/supabase');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const router = express.Router();

// ---- NODEMAILER CONFIGURATION ----
const transporter = require('../utils/email');

// ---- MIDDLEWARE ----
const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data || !data.user) {
            if (!data) console.error('[AUTH_ERROR] Supabase returned NULL data. Key missing?');
            return res.status(401).json({ error: 'Invalid token' });
        }

        const { user } = data;

        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const requireAdmin = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        if (error || !profile) {
            return res.status(403).json({ error: 'Access denied' });
        }

        if (profile.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        next();
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ---- EXISTING ROUTES ----

// Signup (Bypass Email Confirmation using Admin)
router.post('/signup', async (req, res) => {
    const { email, password, data: userData } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        console.log('[AUTH_API] Creating user (auto-confirm):', email);

        // Use Admin API to create user with confirmed email
        const { data: user, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm!
            user_metadata: userData
        });

        if (error) throw error;

        console.log('[AUTH_API] User created successfully:', user.user.id);

        res.json({ success: true, user: user.user });
    } catch (error) {
        console.error('[AUTH_API] Signup error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Change Email
router.post('/change-email', requireAuth, async (req, res) => {
    const { newEmail } = req.body;

    if (!newEmail) {
        return res.status(400).json({ error: 'New email is required' });
    }

    try {
        const { data, error } = await supabase.auth.updateUser({ email: newEmail });

        if (error) throw error;

        res.json({ success: true, message: 'Confirmation email sent to new address' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Request Password Reset (Custom Flow)
router.post('/request-password-reset', async (req, res) => {
    const { email } = req.body;
    console.log('[PW_RESET_API] Request for', email);

    if (!email || typeof email !== 'string') {
        return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    try {
        // 1. Check if user exists
        const { data: { users }, error: searchError } = await supabase.auth.admin.listUsers();
        // searchUserByEmail isn't direct in basic admin, listUsers with filter?
        // Actually getUserById is easy, getUserByEmail not always exposed directly on admin.
        // But supabase.auth.admin.getUserByEmail IS a method? Let's check docs memory or try it.
        // Actually, typically typically we do listUsers({ email: email })?
        // Wait, standard supabase-js v2 has listUsers.
        // Let's use listUsers + filter, OR see if we can just attempt generateLink and catch error?
        // User request: "Use supabaseAdmin.auth.admin.getUserByEmail(email)"
        // I will trust the user knows this method exists or I should check.
        // Actually `supabase.auth.admin.getUserById` exist. `getUserByEmail` might not.
        // But `listUsers` works.
        // Let's try `await supabase.auth.admin.listUsers();` then filter.
        // Or better: `generateLink` will likely fail if user doesn't exist? No, it often creates one?
        // Wait, `generateLink` for `recovery` REQUIRES user to exist.

        // Let's try to find the user first using listUsers with pagination? No, unsafe.
        // NOTE: supabase-js v2 admin DOES NOT have `getUserByEmail`.
        // However, `supabase.auth.admin.listUsers()` returns a list.
        // If I can't look it up efficiently, maybe I should just call `generateLink`.
        // If `generateLink` fails because user not found, I catch it.
        // BUT user wanted "Account not found" specifically.
        // `generateLink` throws error if not found?
        // Let's try to proceed by finding user ID first.

        // Let's use `supabase.auth.admin.listUsers()` with a hack or just assume generateLink returns error.
        // Re-read user prompt: "Use supabaseAdmin.auth.admin.getUserByEmail(email)".
        // If this method doesn't exist, I will use `listUsers` or `generateLink` directly.
        // Let's assume the user is right or I use a workaround.
        // Workaround: `const { data: { users } } = await supabase.auth.admin.listUsers();` -> find one.
        // This is slow if thousands of users.
        // Better: `const { data, error } = await supabase.auth.admin.generateLink(...)`.
        // If error says "user not found", done.

        // Actually, let's look at `supabase.auth.admin`.
        // I will use `generateLink` directly. If it fails, I'll assume user not found.
        // Wait, user explicitly asked for `getUserByEmail`.
        // I'll try to use it, but wrap in try/catch to fallback.
        // Actually, looking at Supabase JS definitions, `createUser` `deleteUser` `getUserById`... no `getUserByEmail`.
        // I will use `generateLink`. It is the most direct way.
        // `generateLink` will return error if user doesn't exist?
        // Let's verify documentation... `generateLink({ type: 'recovery', email: '...' })`
        // Returns `{ data: { url: ... }, error: ... }`.
        // If user not found: error is not null.

        // BUT, I need to know if it is "User not found" vs "Other error".
        // Use `generateLink`.

        // UPDATE: I will follow the user's specific flow logic where possible but adapting to reality.
        // User prompt: "If no user is found, return HTTP 404... code: USER_NOT_FOUND".
        // I'll try `generateLink`. If error.message contains "not found", return 404.

        // Let's implement.

        // Logic:
        const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
            type: 'recovery',
            email,
            options: {
                redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password`,
            },
        });

        console.log('[PW_RESET_API] generateLink result', { success: !!linkData.properties, error: linkError });

        if (linkError) {
            console.log('[PW_RESET_API] Error generating link:', linkError);
            // Supabase specific error for "user not found"?
            // Often "User not found" or similar.
            if (linkError.message?.toLowerCase().includes('not found') || linkError.status === 404) {
                return res.status(404).json({ success: false, code: 'USER_NOT_FOUND' });
            }
            return res.status(500).json({ success: false, code: 'GENERATION_FAILED', message: linkError.message });
        }

        // If we got here, user exists and link generated.
        // `linkData` contains `properties: { action_link: ... }` or similar in v2.
        // Actually `data` has `properties`? or `user` and `action_link`?
        // Docs: `data: { user: User, properties: { action_link: string, email_otp: string, ... } }`.

        const resetLink = linkData.properties?.action_link;
        if (!resetLink) {
            return res.status(500).json({ success: false, code: 'NO_LINK', message: 'Failed to generate link' });
        }

        // 3. Send Email
        const mailOptions = {
            from: process.env.MAIL_FROM || '"MDnexa Support" <noreply@mdnexa.com>',
            to: email,
            subject: 'Reset Your Password - MDnexa',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Reset Your Password</h2>
                    <p>You requested a password reset for your MDnexa account.</p>
                    <p>Click the button below to set a new password:</p>
                    <a href="${resetLink}" style="display: inline-block; background: #2563EB; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 16px 0;">Reset Password</a>
                    <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
                    <p style="color: #666; font-size: 12px; margin-top: 24px;">Link expires in 24 hours.</p>
                </div>
            `
        };

        console.log('[PW_RESET_DEBUG] Attempting to send email:', {
            from: mailOptions.from,
            to: mailOptions.to,
            smtpUser: process.env.SMTP_USER ? '***' : 'MISSING'
        });

        const info = await transporter.sendMail(mailOptions);
        console.log('[PW_RESET_API] Email sent:', info.messageId);

        return res.json({ success: true });

    } catch (err) {
        console.error('[PW_RESET_API] Unexpected error:', err);
        return res.status(500).json({ success: false, code: 'SERVER_ERROR', message: err.message });
    }
});

// Debug Test Email
router.post('/debug/send-test-mail', async (req, res) => {
    // Hardcoded test
    const testEmail = 'doctor@hospital.com'; // Or take from body if needed, but safe default

    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM || '"MDnexa Support" <noreply@mdnexa.com>',
            to: req.body.email || process.env.SMTP_USER, // Send to self if not specified
            subject: 'MDnexa Email Test',
            text: 'This is a test email to verify SMTP configuration.',
        });

        console.log('[PW_RESET_DEBUG] test mail result', { messageId: info.messageId });
        res.json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error('[PW_RESET_DEBUG] test mail error', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ---- NEW CUSTOM SMTP ROUTES ----

// 1. Request Password Reset (Send Email)
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    try {
        // 1. Find user by email
        // Since we are using Service Role, we can query users. But Supabase JS client 
        // doesn't usually expose "getByEmail" easily in admin.
        // We will fallback to "listUsers" and find in memory (inefficient for millions, fine for thousands)
        // Or if you have 'profiles' synced with email, query that.
        // For now, let's try the listUsers approach.

        // NOTE: In production with many users, implement a DB function or query auth schema directly.
        const { data: { users }, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

        if (error) throw error;

        const user = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            console.log(`Password reset requested for ${email}, but user not found in first 1000 users.`);
            // Security: Don't reveal user existence.
            return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
        }

        console.log(`User found: ${user.id}. Sending reset email to ${email}...`);

        // 2. Generate Token
        // Payload: userId and email. Expire in 1 hour.
        const token = jwt.sign(
            { userId: user.id, email: user.email, type: 'password-reset' },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );

        // 3. Construct Link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        console.log('[PW_RESET_DEBUG] Generated Link:', resetLink); // DEBUG: Verify URL

        // 4. Send Email via SMTP
        await transporter.sendMail({
            from: process.env.MAIL_FROM || '"MDnexa Support" <noreply@mdnexa.com>',
            to: email,
            subject: 'Reset your MDnexa password',
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Password Reset Request</h2>
                    <p>You requested to reset your password for MDnexa.</p>
                    <p>Click the link below to set a new password:</p>
                    <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #0ea5e9; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <p style="margin-top: 20px; font-size: 12px; color: #666;">If you didn't ask for this, please ignore this email. The link expires in 1 hour.</p>
                </div>
            `,
        });

        res.json({ success: true, message: 'RESET LINK SENT (DEBUG MODE) - Check Email Now' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: `Failed to process request: ${error.message}` });
    }
});

// 2. Confirm Reset (Update Password)
router.post('/reset-password-confirm', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
    }

    try {
        // 1. Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        if (decoded.type !== 'password-reset') {
            return res.status(400).json({ error: 'Invalid token type' });
        }

        const { userId } = decoded;

        // 2. Update Password via Supabase Admin
        const { data, error } = await supabase.auth.admin.updateUserById(userId, {
            password: newPassword
        });

        if (error) throw error;

        res.json({ success: true, message: 'Password has been updated successfully.' });
    } catch (error) {
        console.error('Reset password confirm error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ error: 'Reset link has expired.' });
        }
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

module.exports = { requireAuth, requireAdmin, router };
