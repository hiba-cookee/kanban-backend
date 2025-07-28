const userControllers = require('../controllers/userControllers')
const express = require('express');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

const router = express.Router()

router.post('/register', userControllers.createUser);
router.post('/login', userControllers.loginUser);
router.get('/all-users',jwtMiddleware,userControllers.getAllUsers)

module.exports = router;