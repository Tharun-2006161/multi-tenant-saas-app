const express = require('express');
const router = express.Router();
const { createProject, getProjects } = require('../controllers/projectController');
const verifyToken = require('../middleware/authMiddleware');

// POST http://localhost:5000/api/projects (Create)
router.post('/', verifyToken, createProject);

// GET http://localhost:5000/api/projects (Read)
router.get('/', verifyToken, getProjects);

module.exports = router;