const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const supabase = require('../utils/supabase');
const { requireAuth } = require('./auth');
const { requireAdmin } = require('../utils/accessControl');
const multer = require('multer');
const path = require('path');

const router = express.Router();
// Gemini AI setup (kept for future reference, unused in manual mode for now)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure Multer for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Create a new blog post (Redirects to Admin/Team check)
// Middleware order: 1. Auth 2. Admin Check 3. File Upload
router.post('/', requireAuth, requireAdmin, upload.single('image'), async (req, res) => {
    const { title, slug, content, status } = req.body;
    const userId = req.user.id;
    let image_url = req.body.image_url;

    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    console.log('[BLOG_SAVE] Saving blog for user:', userId, 'Title:', title, 'Image:', image_url);

    try {
        const { data, error } = await supabase
            .from('blogs')
            .insert([{ user_id: userId, title, slug, content, image_url, status }])
            .select();

        if (error) {
            console.error('[BLOG_SAVE] Supabase Insert Error:', error);
            throw error; // Will be caught below
        }

        console.log('[BLOG_SAVE] Success. Blog ID:', data[0]?.id);
        res.status(201).json(data[0]);
    } catch (error) {
        console.error('[BLOG_SAVE] Unexpected Error:', error);
        res.status(500).json({ error: 'Database Error: ' + error.message });
    }
});

// Get all blogs (Public Feed - No Auth Required)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('blogs')
            .select(`
                *,
                profiles:user_id (full_name, avatar_url)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific blog post
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Blog not found' });

        res.json(data);
    } catch (error) {
        res.status(404).json({ error: 'Blog not found' });
    }
});

// Update a blog post
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const { data, error } = await supabase
            .from('blogs')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;

        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a blog post
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
