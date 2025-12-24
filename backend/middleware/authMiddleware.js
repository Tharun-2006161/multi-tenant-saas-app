const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // CRITICAL: Ensure we attach the tenant_id from the token to the request
        req.user = {
            id: verified.id,
            tenant_id: verified.tenant_id // This fixes the 'null' issue
        };
        next();
    } catch (err) {
        res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = authenticateToken;