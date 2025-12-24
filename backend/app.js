const express = require('express');
const dotenv = require('dotenv');
const pool = require('./config/db');
// ADD THIS LINE HERE:
const userRoutes = require('./routes/userRoutes'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// ADD THIS LINE HERE (Below express.json):
app.use('/api/users', userRoutes); 

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