import express from 'express';
import mongoose from 'mongoose';
import bp from 'body-parser';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
import authRoutes from './routes/authRoutes.mjs';
import { requireAuth } from './middleware/authMiddleware.mjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

// Fayl yo'llari (EJS uchun)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB URI
const dbURI = process.env.MONGO_URI;

// Middleware
app.use(express.static('public'));
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
app.use(cookieParser());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB ulanish
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log(" MongoDB connected ✅"))
.catch((err) => console.log("MongoDB error ❌ ", err));

// Routes
app.use(authRoutes);

// GET /career sahifa
app.get('/', (req, res) => {
    const sent = req.query.sent === 'true';
    res.render('', { sent });
});

// POST /send-message => Email yuborish
app.post('/send-message', async (req, res) => {
    const { name, email, phone, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const mailOptions = {
        from: "Everest Evolution",
        to: process.env.GMAIL_USER,
        subject: 'New message from User',
        html: `
            <h1>New message:</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone number:</strong> ${phone}</p>
            <p><strong>Message:</strong> ${message}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Message send successfully ✅');
        res.redirect(req.headers.referer);
    } catch (err) {
        console.error('Emailda xatolik:', err);
        res.redirect(req.headers.referer);
    }
});

// Bosh sahifa (auth'dan keyin)
app.get('/home', requireAuth, (req, res) => {
    res.render('home');
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
