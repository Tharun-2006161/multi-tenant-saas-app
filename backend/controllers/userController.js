const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// CREATE USER (REGISTER)
const createUser = async (req, res) => {
    try {
        // Change password_hash to password here to match your JSON input
        const { full_name, email, tenant_id, password } = req.body; 

        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

        const salt = await bcrypt.genSalt(10);
        // Now using 'password' which is no longer undefined!
        const securePassword = await bcrypt.hash(password, salt);
        
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

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        // Safety check for the secret
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT_SECRET is missing from .env file!");
            return res.status(500).send("Server Configuration Error");
        }

        const token = jwt.sign(
            { id: user.rows[0].id, tenant_id: user.rows[0].tenant_id },
            secret,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = { createUser, loginUser };