const pool = require('../config/db');

const createUser = async (req, res) => {
    try {
        // Added password_hash here
        const { full_name, email, tenant_id, password_hash } = req.body; 
        
        const newUser = await pool.query(
            "INSERT INTO users (full_name, email, tenant_id, password_hash) VALUES($1, $2, $3, $4) RETURNING *",
            [full_name, email, tenant_id, password_hash]
        );
        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = { createUser };