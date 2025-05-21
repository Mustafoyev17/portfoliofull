import express from 'express';
import mongoose from 'mongoose';
import bp from 'body-parser';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer';
import authRoutes from './routes/authRoutes.mjs';
import { requireAuth } from './middleware/authMiddleware.mjs';
import { Chat } from './models/Chat.mjs';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { systemPrompt } from './system.mjs';

dotenv.config();
const app = express();
const MONGO_URI = process.env.MONGO_URI;

// Fayl yo‘llari
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully ✅'))
  .catch(err => console.error('MongoDB connection error ❌', err));

// Middleware
app.use(express.static('public'));
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
app.use(cookieParser());

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// OpenAI ulanish
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Auth routes
app.use(authRoutes);

// Bosh sahifa
app.get('/', (req, res) => {
  const sent = req.query.sent === 'true';
  res.render('home', { sent, aiResponse: null });
});

app.get("/signup", (req, res) => {
  res.render("signup"); // Bu "views/Signup.ejs" faylini qidiradi
});


// 🔥 Chat sahifasi (GET - barcha yozishmalar bilan)
app.get('/chatbot', async (req, res) => {
  try {
    const messages = await Chat.find().sort({ createdAt: 1 });
    res.render('chatbot', { messages, aiResponse: null });
  } catch (error) {
    console.error("Error loading chat", error);
    res.render('chatbot', { messages: [], aiResponse: null });
  }
});

// 📩 POST - Foydalanuvchi xabarini yuborish va AI javobini olish
app.post('/ask-chat', async (req, res) => {
  const { userMessage } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        systemPrompt,
        { role: "user", content: userMessage }
      ],
    });

    const aiReply = completion.choices[0].message.content;

    const newChat = new Chat({ user: userMessage, ai: aiReply });
    await newChat.save();

    const messages = await Chat.find().sort({ createdAt: 1 });
    res.render('chatbot', { messages, aiResponse: aiReply });
  } catch (error) {
    console.error("ChatGPT xatosi:", error);
    res.render('chatbot', { messages: [], aiResponse: "There was an error connecting to the AI" });
  }
});

// 🧹 POST - Barcha chat yozuvlarini tozalash
app.post('/clear-chat', async (req, res) => {
  try {
    await Chat.deleteMany({});
    res.redirect('/chatbot');
  } catch (error) {
    console.error("Error deleting correspondence", error);
    res.redirect('/chatbot');
  }
});

// 📩 E-mail orqali xabar yuborish
app.post('/send-message', async (req, res) => {
  const { name, location, email, phone, message } = req.body;

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
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong> ${message}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.redirect(req.headers.referer);
  } catch (err) {
    console.error('Email error', err);
    res.redirect(req.headers.referer);
  }
});

app.get('/home', requireAuth, (req, res) => {
  res.render('home');
});

// 🚀 Serverni ishga tushurish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});
