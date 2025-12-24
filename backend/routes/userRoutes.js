const express = require('express');
const router = express.Router();
const { createUser, loginUser } = require('../controllers/userController');

// http://localhost:5000/api/users/register
router.post('/register', createUser);

// http://localhost:5000/api/users/login
router.post('/login', loginUser);

module.exports = router;