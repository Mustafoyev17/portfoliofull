import express from 'express'
import 
{  
    home_get, 
    home_post, 
    signup_get, 
    signup_post, 
    login_get, 
    login_post, 
    portfolio_get, 
    portfolio_post, 
    pricing_get, 
    pricing_post, 
    glovery_get, 
    glovery_post, 
    career_get, 
    career_post,
    logout_get,
    chatbot_post,
    chatbot_get,

} 
from '../controller/authController.mjs'

const router = express.Router();

router.get('/signup', signup_get);
router.post('/signup', signup_post);
router.get('/login', login_get);
router.post('/login', login_post);
router.get('/portfolio', portfolio_get);
router.post('/portfolio', portfolio_post);
router.get('/career', career_get);
router.post('/career', career_post);
router.get('/home', home_get);
router.post('/home', home_post);
router.get('/pricing', pricing_get);
router.post('/pricing', pricing_post);
router.get('/glovery', glovery_get);
router.post('/glovery', glovery_post);
router.get('/logout', login_get);
router.post('/chatbot', chatbot_post);
router.get('/chatbot', chatbot_get);

export default router;