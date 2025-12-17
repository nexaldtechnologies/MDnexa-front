const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ override: true });

const authRoutes = require('./routes/auth');
const blogsRoutes = require('./routes/blogs');
const subscriptionsRoutes = require('./routes/subscriptions');
const crmRoutes = require('./routes/crm');
const usersRoutes = require('./routes/users');
const webhooksRoutes = require('./routes/webhooks');
const settingsRoutes = require('./routes/settings');
const referralRoutes = require('./routes/referrals');
const chatRoutes = require('./routes/chat');
const sessionsRoutes = require('./routes/sessions');
const healthRoutes = require('./routes/health');

const app = express();
const port = process.env.PORT || 3000;

// Mount webhooks BEFORE express.json()
app.use('/api/webhooks', webhooksRoutes);

// CORS Configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_ALT,
    "http://localhost:5173", // Always allow local Vite dev
    "http://localhost:5174", // Verify fallback port
    "http://localhost:3000"  // Always allow local backend access if needed
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // Allow non-browser clients (e.g. server-to-server)

        if (
            allowedOrigins.includes(origin) ||
            origin.startsWith("https://nexaldtechnologies-mdnexald-") // Allow Vercel previews
        ) {
            return callback(null, true);
        }

        console.warn(`CORS blocked origin: ${origin}`); // Helpful for debugging
        return callback(null, true); // Permissive for debugging
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // Enable preflight for all routes
app.use(express.json()); // CRITICAL: This was missing!
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});
app.use('/uploads', express.static('uploads')); // Serve uploaded images

app.use('/api/blogs', blogsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes.router);
app.use('/api/settings', settingsRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/gemini', require('./routes/gemini'));

app.use('/api/health', healthRoutes);

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = app;
