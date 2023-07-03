const express = require('express');

const router = express.Router();

const userController = require('../controller/user.controller');
// Middleware 
// const checkLogin = require('../middleware/checkLogin.js')
// To save the userdata
router.post('/savedata', userController.saveData);
// login 
router.post('/login', userController.loginUser);

module.exports = router;
