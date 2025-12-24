const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // You need this for the token!

// CREATE USER (REGISTER)
const createUser = async (req, res) => {
    try {
        const { full_name, email, tenant_id, password_hash } = req.body; 
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(password_hash, salt);
        
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

// LOGIN USER
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        // 3. Create the JWT Token
        const token = jwt.sign(
            { id: user.rows[0].id, tenant_id: user.rows[0].tenant_id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = { createUser, loginUser };