const express = require('express');
const router = express.Router();
const { createUser, loginUser } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware'); // Import the Bouncer

// Public Routes (Anyone can access)
router.post('/register', createUser);
router.post('/login', loginUser);

// Protected Route (Only people with a valid Token can access)
router.get('/me', verifyToken, (req, res) => {
    // req.user comes from the middleware we just wrote!
    res.json({ 
        message: "Welcome to the secret profile page!", 
        user: req.user 
    });
});

module.exports = router;