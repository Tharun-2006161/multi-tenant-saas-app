const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/db'); 
const userRoutes = require('./routes/userRoutes'); 
const projectRoutes = require('./routes/projectRoutes'); 

dotenv.config();
const app = express();

// Professional Fix: Allow both your local dev and your live Vercel site
app.use(cors({
  origin: [
    'https://multi-tenant-saas-app-sable.vercel.app',
    'http://localhost:5173'
  ], 
  credentials: true
})); 

app.use(express.json()); 

app.use('/api/users', userRoutes); 
app.use('/api/projects', projectRoutes); 

const initDb = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    // This is good—you confirmed this works in your Render logs!
    await pool.query(createTableQuery); 
    console.log("Users table is ready! ✅");
  } catch (err) {
    console.error("Error creating table:", err);
  }
};

const PORT = process.env.PORT || 5000;

initDb().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} 🚀`);
  });
});