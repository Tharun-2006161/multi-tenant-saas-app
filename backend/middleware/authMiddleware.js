const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Get the token from the request header
    const token = req.header('Authorization');

    // 2. If no token, deny access
    if (!token) {
        return res.status(403).json({ error: "Access Denied. No token provided." });
    }

    try {
        // 3. Verify the token using our Secret Key
        // Note: We expect the format "Bearer <token>"
        const actualToken = token.split(" ")[1]; 
        const verified = jwt.verify(actualToken, process.env.JWT_SECRET);
        
        // 4. Attach the user data to the request so other routes can use it
        req.user = verified;
        
        // 5. Let them through to the next function!
        next(); 
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

module.exports = verifyToken;