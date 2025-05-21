import User from '../models/User.mjs';
import jwt from 'jsonwebtoken';// authController.mjs
import { Chat } from '../models/Chat.mjs';



const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, "everest", {
        expiresIn: maxAge,
    });
}

const handleErrors = (err) => {
  let errors = { email: '', password: '' };

  // custom xatoliklar
  if (err.message === 'incorrect email') {
    errors.email = 'Email not registered';
  }
  if (err.message === 'incorrect password') {
    errors.password = 'Password is incorrect';
  }

  // MongoDB unique error
  if (err.code === 11000) {
    errors.email = 'Email already registered';
    return errors;
  }

  // Validation errors
  if (err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};
export const signup_get = (req, res) => {
    res.render('Signup');
};
export const login_get = (req, res) => {
    res.render('Login', { errors: { email: '', password: '' } });
};
export const signup_post = async(req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.create({email,password})
        const token = createToken(user._id);
        res.cookie("jwt", token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({ user: user._id });
    }
    catch(err){
        const errors = handleErrors(err);
            res.status(400).json({ errors });
        }
};
export const login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id }); // ✅ JSON
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors }); // ✅ JSON
  }
};



export const portfolio_get = (req, res) => {
    res.render('portfolio');
};
export const portfolio_post = (req, res) => {
    res.render('portfolio');
};
export const career_get = (req, res) => {
    res.render('career');
};
export const career_post = (req, res) => {
    res.render('career');
};

export const home_get = (req, res) => {
    res.render('home');
};
export const home_post = (req, res) => {
    res.render('home');
};
export const pricing_get = (req, res) => {
    res.render('pricing');
};
export const pricing_post = (req, res) => {
    res.render('pricing');
};
// Misol uchun
export const chatbot_get = async (req, res) => {
  try {
    const messages = await Chat.find().sort({ createdAt: 1 });
    res.render('chatbot', { messages, aiResponse: null });
  } catch (error) {
    console.error("Error loading chatbot page ❌", error);
    res.render('chatbot', { messages: [], aiResponse: null });
  }
};

export const chatbot_post = async (req, res) => {
  try {
    const messages = await MessageModel.find({ userId: req.user.id }); // yoki kerakli query
    
    res.render('chatbot', {
      messages, // ← bu joy muhim
      user: req.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const glovery_get = (req, res) => {
    res.render('glovery');
};
export const glovery_post = (req, res) => {
    res.render('glovery');
};
export const logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
};