const express = require('express');
const router = express.Router();
const { createProject } = require('../controllers/projectController');
const verifyToken = require('../middleware/authMiddleware');

// Every project route MUST be protected. 
router.post('/', verifyToken, createProject);

module.exports = router;