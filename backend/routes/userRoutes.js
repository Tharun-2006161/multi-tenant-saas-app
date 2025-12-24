const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');

// This defines the POST request to create a user
router.post('/register', createUser);

module.exports = router;