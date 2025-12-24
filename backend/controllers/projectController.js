const pool = require('../config/db');

// 1. Create a new project (POST)
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
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// 3. Update a project (PUT)
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, status } = req.body;
        const { tenant_id } = req.user;

        const updatedProject = await pool.query(
            "UPDATE projects SET name = $1, description = $2, status = $3 WHERE id = $4 AND tenant_id = $5 RETURNING *",
            [name, description, status, id, tenant_id]
        );

        if (updatedProject.rows.length === 0) {
            return res.status(404).json({ error: "Project not found or unauthorized" });
        }

        res.json(updatedProject.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// 4. Delete a project (DELETE) - NEW FUNCTION
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { tenant_id } = req.user;

        // Strict Security: only delete if the project matches the ID AND the user's company
        const deletedProject = await pool.query(
            "DELETE FROM projects WHERE id = $1 AND tenant_id = $2 RETURNING *",
            [id, tenant_id]
        );

        if (deletedProject.rows.length === 0) {
            return res.status(404).json({ error: "Project not found or unauthorized" });
        }

        res.json({ message: "Project deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = { createProject, getProjects, updateProject, deleteProject };