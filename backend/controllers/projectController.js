const pool = require('../config/db');

// Create a new project
const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        // IMPORTANT: We get the tenant_id from the TOKEN (req.user), 
        // not the body. This is why it's secure!
        const { tenant_id } = req.user; 

        const newProject = await pool.query(
            "INSERT INTO projects (name, description, tenant_id) VALUES($1, $2, $3) RETURNING *",
            [name, description, tenant_id]
        );
        
        res.json(newProject.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = { createProject };