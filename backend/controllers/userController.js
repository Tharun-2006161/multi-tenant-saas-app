const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// CREATE USER (REGISTER)
const createUser = async (req, res) => {
    try {
        const { full_name, email, password } = req.body; 
        
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

        const tenant_id = uuidv4(); 
        const subdomain = full_name.toLowerCase().replace(/\s+/g, '-'); 

        // 1. Create the Tenant with ALL required constraints 
        // Including max_users and the new max_projects
        await pool.query(
            "INSERT INTO tenants (id, name, subdomain, max_users, max_projects) VALUES ($1, $2, $3, $4, $5)",
            [tenant_id, `${full_name}'s Organization`, subdomain, 5, 10] 
        );

        // 2. Create the User linked to that Tenant
        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(password, salt);
        
        const newUser = await pool.query(
            "INSERT INTO users (full_name, email, tenant_id, password_hash) VALUES($1, $2, $3, $4) RETURNING *",
            [full_name, email, tenant_id, securePassword]
        );

        res.json(newUser.rows[0]);
    } catch (err) {
        console.error("DATABASE ERROR DURING REGISTRATION:", err.message);
        res.status(500).json({ error: err.message });
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

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT_SECRET is missing from .env file!");
            return res.status(500).send("Server Configuration Error");
        }

        // Token now correctly includes the generated tenant_id
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