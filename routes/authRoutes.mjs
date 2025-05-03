import express from 'express'
import { signup_get, signup_post, login_get, login_post, port_get, port_post } from '../controller/authController.mjs'

const router = express.Router();

router.get('/signup', signup_get)
router.post('/signup', signup_post)
router.get('/login', login_get)
router.post('/login', login_post)
router.get('/port', port_get)
router.post('/port', port_post)

export default router