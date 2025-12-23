const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route (Test if it works)
app.get('/', (req, res) => {
  res.send('Multi-Tenant SaaS API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});