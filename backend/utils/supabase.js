const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('[SUPABASE_DEBUG] Env Check:', {
    url: supabaseUrl ? 'Required (Found)' : 'MISSING',
    key: supabaseKey ? `Required (Found, length ${supabaseKey.length})` : 'MISSING'
});

if (!supabaseUrl || !supabaseKey) {
    console.error('[SUPABASE_ERROR] Missing Environment Variables!');
    console.error('SUPABASE_URL:', supabaseUrl ? '[SET]' : '[MISSING]');
    console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '[SET]' : '[MISSING]');
}

// Create client handling potential missing keys to avoid hard crash on require
// Explicitly check to prevent "URL not found" error from throwing immediately
let supabase;

if (supabaseUrl && supabaseKey) {
    console.log('[SUPABASE_DEBUG] Initializing Real Client');
    console.log('[SUPABASE_DEBUG] URL:', supabaseUrl);
    console.log('[SUPABASE_DEBUG] Key Length:', supabaseKey.length);
    supabase = createClient(supabaseUrl, supabaseKey);
} else {
    // Return a dummy object that logs errors when accessed, rather than crashing server startup
    console.warn('[SUPABASE] Initializing dummy client due to missing env vars');
    const proxyHandler = {
        get: function (target, prop, receiver) {
            return (...args) => {
                const msg = `[SUPABASE ERROR] Cannot call '${String(prop)}' because SUPABASE_URL or KEY is missing. Check Vercel Env Vars.`;
                console.error(msg);
                return {
                    data: null,
                    error: { message: msg }
                }; // Mock response structure
            };
        }
    };
    supabase = new Proxy({}, proxyHandler);
}

module.exports = supabase;
