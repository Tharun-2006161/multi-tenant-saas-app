const pool = require('../config/db');

// Create a new project (POST)
const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
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

// Get all projects for the logged-in user's company (GET)
const getProjects = async (req, res) => {
    try {
        // We pull the tenant_id from the verified token
        const { tenant_id } = req.user; 

        // We only select projects that belong to this specific tenant!
        const projects = await pool.query(
            "SELECT * FROM projects WHERE tenant_id = $1 ORDER BY created_at DESC", 
            [tenant_id]
        );
        
        res.json(projects.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = { createProject, getProjects };