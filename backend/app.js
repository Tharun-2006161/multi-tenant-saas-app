const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); // <--- ADD THIS LINE
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test Database Connection Route
app.get('/test-db', async (req, res) => { // <--- ADD THIS BLOCK
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Database connected!', time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection error');
  }
});

// Basic Route
app.get('/', (req, res) => {
  res.send('Multi-Tenant SaaS API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});