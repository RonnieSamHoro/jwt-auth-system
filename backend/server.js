require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User');
const rateLimit = require('express-rate-limit');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key';

// === In-memory token blacklist ===
const blacklistedTokens = new Set();
const refreshTokens = new Set(); // Store valid refresh tokens

// === Middleware ===
app.use(cors());
app.use(express.json());

// === Rate Limiter for Login Route ===
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Increased from 5 to 10 for better UX
    message: { message: "Too many login attempts, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// === Connect to MongoDB ===
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected!'))
    .catch((err) => console.error('MongoDB error:', err));

// === Password Strength Validation ===
function isStrongPassword(password) {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongRegex.test(password);
}

// === Token Generation ===
function generateTokens(user) {
    const accessToken = jwt.sign(
        { username: user.username, id: user._id },
        JWT_SECRET,
        { expiresIn: '15m' } // Short-lived access token
    );
    
    const refreshToken = jwt.sign(
        { username: user.username, id: user._id },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' } // Long-lived refresh token
    );
    
    return { accessToken, refreshToken };
}

// === Routes ===

// --- Registration ---
app.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ message: "Username and password are required." });
        if (!isStrongPassword(password))
            return res.status(400).json({ message: "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character." });

        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: "User already exists." });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ 
            username, 
            password: hashedPassword,
            failedAttempts: 0,
            lockUntil: null
        });
        await user.save();

        return res.status(201).json({ message: "Registration successful." });
    } catch (err) {
        next(err);
    }
});

// --- Login ---
app.post('/login', loginLimiter, async (req, res, next) => {
    try {
        const { username, password, rememberMe } = req.body;
        if (!username || !password)
            return res.status(400).json({ message: "Username and password are required." });

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid credentials." });

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / (1000 * 60));
            return res.status(423).json({ 
                message: `Account locked. Try again in ${lockTimeRemaining} minutes.`,
                lockUntil: user.lockUntil
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Increment failed attempts
            user.failedAttempts = (user.failedAttempts || 0) + 1;
            
            // Lock account after 5 failed attempts
            if (user.failedAttempts >= 5) {
                user.lockUntil = Date.now() + (15 * 60 * 1000); // 15 minutes
                await user.save();
                return res.status(423).json({ 
                    message: "Account locked due to multiple failed attempts. Try again in 15 minutes.",
                    lockUntil: user.lockUntil
                });
            }
            
            await user.save();
            return res.status(400).json({ 
                message: `Invalid credentials. ${5 - user.failedAttempts} attempts remaining.`,
                attemptsRemaining: 5 - user.failedAttempts
            });
        }

        // Reset failed attempts on successful login
        user.failedAttempts = 0;
        user.lockUntil = null;
        user.lastLogin = new Date();
        await user.save();

        const { accessToken, refreshToken } = generateTokens(user);
        refreshTokens.add(refreshToken);

        res.json({ 
            accessToken, 
            refreshToken, 
            username: user.username,
            expiresIn: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000, // 7 days or 15 minutes
            rememberMe
        });
    } catch (err) {
        next(err);
    }
});

// --- Refresh Token ---
app.post('/refresh', (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
    }
    
    if (!refreshTokens.has(refreshToken)) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
    
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            refreshTokens.delete(refreshToken);
            return res.status(403).json({ message: "Invalid refresh token" });
        }
        
        const newAccessToken = jwt.sign(
            { username: decoded.username, id: decoded.id },
            JWT_SECRET,
            { expiresIn: '15m' }
        );
        
        res.json({ accessToken: newAccessToken });
    });
});

// --- Logout (Token Revocation) ---
app.post('/logout', (req, res) => {
    const authHeader = req.headers['authorization'];
    const { refreshToken } = req.body;
    
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            blacklistedTokens.add(token);
        }
    }
    
    if (refreshToken) {
        refreshTokens.delete(refreshToken);
    }
    
    return res.json({ message: "Logged out successfully." });
});

// --- Protected Dashboard ---
app.get('/protected', auth(blacklistedTokens), (req, res) => {
    res.json({ 
        message: `Welcome to your dashboard, ${req.user.username}!`,
        user: {
            username: req.user.username,
            id: req.user.id
        },
        tokenExpiry: req.user.exp
    });
});

// === 404 handler ===
app.use((req, res, next) => {
    res.status(404).json({ message: "Endpoint not found." });
});

// === Centralized Error Handler ===
app.use((err, req, res, next) => {
    console.error(err);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({ message: err.message || "Internal Server Error." });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
