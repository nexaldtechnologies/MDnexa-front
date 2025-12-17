const express = require('express');
const supabase = require('../utils/supabase');
const { requireAuth } = require('./auth');

const router = express.Router();

// Get all sessions for user
router.get('/', requireAuth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('chat_sessions')
            .select('*')
            .eq('user_id', req.user.id)
            .order('updated_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new session
router.post('/', requireAuth, async (req, res) => {
    const { title, region, country } = req.body;
    try {
        const { data, error } = await supabase
            .from('chat_sessions')
            .insert({
                user_id: req.user.id,
                title: title || new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                region,
                country
            })
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete ALL sessions
router.delete('/all', requireAuth, async (req, res) => {
    try {
        const { error } = await supabase
            .from('chat_sessions')
            .delete()
            .eq('user_id', req.user.id);

        if (error) throw error;

        // Also clean up messages? Supabase cascade deletion should handle this if foreign keys are set correctly.
        // Assuming 'cascade' on delete of session.

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete session
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const { error } = await supabase
            .from('chat_sessions')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.user.id);

        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get messages for a session
router.get('/:id/messages', requireAuth, async (req, res) => {
    try {
        // First verify ownership
        const { data: session } = await supabase.from('chat_sessions').select('id').eq('id', req.params.id).eq('user_id', req.user.id).single();
        if (!session) return res.status(403).json({ error: "Access denied" });

        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', req.params.id)
            .order('created_at', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
