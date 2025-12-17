const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');
const robustGemini = require('../utils/robustGemini');

// GET /api/health
// Basic connectivity check
router.get('/', async (req, res) => {
    const health = {
        server: 'ok',
        database: 'unknown',
        timestamp: new Date()
    };

    try {
        const start = Date.now();
        const { error } = await supabase.from('feature_flags').select('count', { count: 'exact', head: true });
        const latency = Date.now() - start;

        if (error) throw error;
        health.database = 'connected';
        health.db_latency_ms = latency;
        res.json(health);
    } catch (error) {
        health.database = 'error';
        health.error = error.message;
        res.status(503).json(health);
    }
});

// GET /api/health/ai
// Semantic "dry run" to verify AI is actually working
router.get('/ai', async (req, res) => {
    try {
        console.log("[Health] Running AI Smoke Test...");
        // Generate a single token to be cheap but prove it works
        const { text, model } = await robustGemini.generateMessage({
            message: "Say 'OK'",
            history: [],
            systemInstruction: "Reply with strictly 'OK'.",
            maxOutputTokens: 5
        });

        if (!text || !text.includes('OK')) {
            throw new Error(`AI generated unexpected content: ${text}`);
        }

        res.json({
            status: 'ok',
            model_used: model,
            test_response: text
        });

    } catch (error) {
        console.error("[Health] AI Smoke Test Failed:", error);
        res.status(503).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;
