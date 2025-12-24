const pool = require('../config/db');

// Create a new user
const createUser = async (req, res) => {
    try {
        const { username, email, tenant_id } = req.body;
        const newUser = await pool.query(
            "INSERT INTO users (username, email, tenant_id) VALUES($1, $2, $3) RETURNING *",
            [username, email, tenant_id]
        );
        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = { createUser };