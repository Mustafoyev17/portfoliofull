import express from 'express';
import mongoose from 'mongoose';
import bp from 'body-parser';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.mjs';
import { requireAuth, checkUser } from './middleware/authMiddleware.mjs';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// ✅ MONGO URI ENV'DAN OLINMOQDA
const dbURI = process.env.MONGO_URI;

// middleware
app.use(express.static('public'));
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.log("MongoDB connection error:", err));

// routes
app.get('*', checkUser);
app.get('/home', requireAuth, (req, res) => res.render('home'));
app.use(authRoutes);

// port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
