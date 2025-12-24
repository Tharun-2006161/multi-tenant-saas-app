const express = require('express');
const dotenv = require('dotenv');
const pool = require('./config/db');
const userRoutes = require('./routes/userRoutes'); 
// 1. ADD THIS LINE:
const projectRoutes = require('./routes/projectRoutes'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes); 
// 2. ADD THIS LINE:
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