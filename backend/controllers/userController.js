const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

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
        await pool.query(
            "INSERT INTO tenants (id, name, subdomain, max_users, max_projects) VALUES ($1, $2, $3, $4, $5)",
            [tenant_id, `${full_name}'s Organization`, subdomain, 5, 10] 
        );

        // 2. Create the User linked to that Tenant
        const salt = await bcrypt.genSalt(10);
        // Note: We use password_hash to match your database schema
        const securePassword = await bcrypt.hash(password, salt);
        
        const newUser = await pool.query(
            "INSERT INTO users (full_name, email, tenant_id, password_hash) VALUES($1, $2, $3, $4) RETURNING id, full_name, email, tenant_id",
            [full_name, email, tenant_id, securePassword]
        );

        res.json(newUser.rows[0]);
    } catch (err) {
        console.error("DATABASE ERROR DURING REGISTRATION:", err.message);
        res.status(500).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) return res.status(401).json({ error: "Invalid Credentials" });

        const foundUser = user.rows[0];
        const isMatch = await bcrypt.compare(password, foundUser.password_hash);
        if (!isMatch) return res.status(401).json({ error: "Invalid Credentials" });

        // THIS IS THE KEY: We must include tenant_id in the token
        const token = jwt.sign(
            { 
                id: foundUser.id, 
                tenant_id: foundUser.tenant_id, // Make sure this is NOT null
                full_name: foundUser.full_name 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};
module.exports = { createUser, loginUser };