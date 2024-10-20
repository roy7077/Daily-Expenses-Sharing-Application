const express=require('express');
const router = express.Router();
const { login, signUp } = require('../Controllers/auth');

// console.log("hello auth.js")
router.post('/login',login);
router.post('/signup',signUp);

module.exports=router;