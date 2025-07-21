const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function auth(blacklistedTokens) {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided." });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Malformed token." });
        }
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid or expired token." });
            }
            if (blacklistedTokens.has(token)) {
                return res.status(401).json({ message: "Token revoked." });
            }
            req.user = decoded;
            next();
        });
    }
}

module.exports = auth;
