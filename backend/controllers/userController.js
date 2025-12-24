const pool = require('../config/db');
const bcrypt = require('bcryptjs'); // Import bcrypt

const createUser = async (req, res) => {
    try {
        const { full_name, email, tenant_id, password_hash } = req.body; 

        // 1. Generate a "salt" (extra security layer)
        const salt = await bcrypt.genSalt(10);
        // 2. Scramble the password using the salt
        const securePassword = await bcrypt.hash(password_hash, salt);
        
        // 3. Save the SECURE password instead of the plain one
        const newUser = await pool.query(
            "INSERT INTO users (full_name, email, tenant_id, password_hash) VALUES($1, $2, $3, $4) RETURNING *",
            [full_name, email, tenant_id, securePassword]
        );
        
        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = { createUser };