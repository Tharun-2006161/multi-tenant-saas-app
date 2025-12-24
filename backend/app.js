const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes'); 
const projectRoutes = require('./routes/projectRoutes'); 

dotenv.config();
const app = express();

// --- ADD THESE TWO LINES HERE ---
app.use(cors());          // Allows frontend to talk to backend
app.use(express.json());  // CRITICAL: This fixes the "undefined" error
// --------------------------------

app.use('/api/users', userRoutes); 
app.use('/api/projects', projectRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));