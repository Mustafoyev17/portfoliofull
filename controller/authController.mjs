import User from '../models/User.mjs';
import jwt from 'jsonwebtoken';

const mxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, "everest secret key", {
        expiresIn: maxAge,
    });
}

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: "", password: ""};

    if (err.code === 11000) {
        errors.email = 'That email is already registered';
        return errors;
    }
    if (err.message.includes('users validation filed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    };
    return errors;
};
export const signup_get = (req, res) => {
    res.render('Signup');
};
export const login_get = (req, res) => {
    res.render('Login');
};
export const signup_post = async(req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.create({email,password})
        const token = createToken(user._id);
        res.cookie("jwt", token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({ user: user_id });
    }
    catch(err){
        const errors = handleErrors(err);
            res.status(400).json({ errors });
        }
};
export const login_post = (req, res) => {
    res.render('User login');
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

export const glovery_get = (req, res) => {
    res.render('glovery');
};
export const glovery_post = (req, res) => {
    res.render('glovery');
};
