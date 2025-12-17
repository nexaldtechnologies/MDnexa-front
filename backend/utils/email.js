const nodemailer = require('nodemailer');

const port = parseInt(process.env.SMTP_PORT || '587');
const secure = port === 465; // true for 465, false for 587/25

console.log('[SMTP Config] Initializing transport with:', {
    host: process.env.SMTP_HOST,
    port,
    secure,
    user: process.env.SMTP_USER ? '***' : 'missing'
});

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: port,
    secure: secure,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

module.exports = transporter;
