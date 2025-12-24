const express = require('express');
const cors = require('cors'); // 1. IMPORT CORS
const dotenv = require('dotenv');
const pool = require('./config/db');
const userRoutes = require('./routes/userRoutes'); 
const projectRoutes = require('./routes/projectRoutes'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // 2. USE CORS (Must be before your routes!)
app.use(express.json());

// Routes
app.use('/api/users', userRoutes); 
app.use('/api/projects', projectRoutes); 

// Test Database Connection
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: "Database connected!", time: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Database connection failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});