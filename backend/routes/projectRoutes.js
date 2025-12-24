const express = require('express');
const router = express.Router();
const { createProject, getProjects, updateProject } = require('../controllers/projectController');
const verifyToken = require('../middleware/authMiddleware');

// Route to Create
router.post('/', verifyToken, createProject);

// Route to Read
router.get('/', verifyToken, getProjects);

// Route to Update (needs :id in the URL)
router.put('/:id', verifyToken, updateProject);

module.exports = router;