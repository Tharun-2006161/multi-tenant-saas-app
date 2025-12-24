const pool = require('../config/db');

// 1. Create a new project (POST)
const createProject = async (req, res) => {
    try {
        const { name, description, category } = req.body;
        const { tenant_id } = req.user; 

        const newProject = await pool.query(
            "INSERT INTO projects (name, description, category, tenant_id) VALUES($1, $2, $3, $4) RETURNING *",
            [name, description, category || 'General', tenant_id]
        );
        
        res.status(201).json(newProject.rows[0]);
    } catch (err) {
        console.error("Create Error:", err.message);
        res.status(500).json({ error: "Failed to create project" });
    }
};

// 2. Get all projects (GET)
const getProjects = async (req, res) => {
    try {
        const { tenant_id } = req.user; 
        const projects = await pool.query(
            "SELECT * FROM projects WHERE tenant_id = $1 ORDER BY created_at DESC", 
            [tenant_id]
        );
        res.json(projects.rows);
    } catch (err) {
        console.error("Fetch Error:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
};

// 3. Update a project (PUT)
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, status, category } = req.body;
        const { tenant_id } = req.user;

        const updatedProject = await pool.query(
            "UPDATE projects SET name = $1, description = $2, status = $3, category = $4 WHERE id = $5 AND tenant_id = $6 RETURNING *",
            [name, description, status, category, id, tenant_id]
        );

        if (updatedProject.rows.length === 0) {
            return res.status(404).json({ error: "Project not found or unauthorized" });
        }

        res.json(updatedProject.rows[0]);
    } catch (err) {
        console.error("Update Error:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { tenant_id } = req.user;

        // Final fix: Ensure the ID is treated as a string for the UUID query
        const result = await pool.query(
            "DELETE FROM projects WHERE id = $1::uuid AND tenant_id = $2 RETURNING *",
            [id, tenant_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Project not found or unauthorized" });
        }

        res.json({ message: "Project deleted successfully" });
    } catch (err) {
        console.error("Final Delete Error:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
};
module.exports = { createProject, getProjects, updateProject, deleteProject };