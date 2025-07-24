const userControllers = require('../controllers/userControllers')
const express = require('express');

const router = express.Router()

router.post('/register', userControllers.createUser);
router.post('/login', userControllers.loginUser);

module.exports = router;