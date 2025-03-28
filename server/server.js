import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Middleware
app.use(express.static(path.join(__dirname, '../public')));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gameforge'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database!');
});

// Helper functions
const generateToken = () => {
    return crypto.randomBytes(16).toString('hex');
};

const createSession = (userId, remember = false) => {
    const token = generateToken();
    const expiresDate = new Date();
    // Set expiration date based on remember flag (30 days if true, 24 hours if false)
    if (remember) {
        expiresDate.setDate(expiresDate.getDate() + 30);
    } else {
        expiresDate.setDate(expiresDate.getDate() + 1);
    }

    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO sessions (user_id, token, expires) VALUES (?, ?, ?)';
        const values = [userId, token, expiresDate];

        db.query(query, values, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({ token, expires: expiresDate });
        });
    });
};

const clearExpiredSessions = () => {
    const query = 'DELETE FROM sessions WHERE expires < NOW()';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error clearing expired sessions:', err);
            return;
        }
        console.log(`Cleared ${result.affectedRows} expired sessions`);
    });
};

// Middleware to check authentication
const authenticateUser = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const query = `
        SELECT s.*, u.id, u.name, u.email, u.role 
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND s.expires > NOW()
    `;

    db.query(query, [token], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        // User is authenticated, attach user data to request
        req.user = {
            id: results[0].id,
            name: results[0].name,
            email: results[0].email,
            role: results[0].role
        };
        next();
    });
};

// Clear expired sessions on server start and every 24 hours
clearExpiredSessions();
setInterval(clearExpiredSessions, 24 * 60 * 60 * 1000);

// API Endpoints

// Register endpoint
app.post('/register', async (req, res) => {
    const { name, email, password, marketingOptIn } = req.body;

    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if user with same email already exists
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insert user into database
            const insertQuery = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
            db.query(insertQuery, [name, email, hashedPassword, 'user'], (err, result) => {
                if (err) {
                    console.error('Database error during user creation:', err);
                    return res.status(500).json({ error: 'Failed to create user' });
                }

                // You could store marketing preference in another table if needed
                
                res.status(201).json({
                    success: true,
                    message: 'User registered successfully',
                    userId: result.insertId
                });
            });
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { identifier, password, remember } = req.body;

    // Validation
    if (!identifier || !password) {
        return res.status(400).json({ error: 'Username/email and password are required' });
    }

    try {
        // Check if user exists (by email or username)
        const query = 'SELECT * FROM users WHERE email = ? OR name = ?';
        db.query(query, [identifier, identifier], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = results[0];

            // Compare password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Create session with remember me flag
            const session = await createSession(user.id, remember);

            // Set cookie with proper options for "remember me"
            const cookieOptions = {
                httpOnly: true,
                expires: session.expires,
                sameSite: 'lax',
                path: '/'
            };
            
            res.cookie('token', session.token, cookieOptions);

            // Return user data (excluding password)
            const { password: _, ...userData } = user;
            res.json({
                success: true,
                message: 'Login successful',
                user: userData
            });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Logout endpoint
app.post('/logout', (req, res) => {
    const token = req.cookies.token;

    if (token) {
        // Remove session from database
        db.query('DELETE FROM sessions WHERE token = ?', [token], (err) => {
            if (err) {
                console.error('Error during logout:', err);
            }
        });

        // Clear cookie
        res.clearCookie('token', { path: '/' });
    }

    res.json({ success: true, message: 'Logged out successfully' });
});

// Authentication check endpoint
app.get('/auth', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.json(null);
    }

    const query = `
        SELECT u.id, u.name, u.email, u.role 
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND s.expires > NOW()
    `;

    db.query(query, [token], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            // Clear invalid cookie
            res.clearCookie('token', { path: '/' });
            return res.json(null);
        }

        // Return user data
        res.json(results[0]);
    });
});

// Protected route example
app.get('/user/profile', authenticateUser, (req, res) => {
    res.json({
        user: req.user,
        message: 'This is protected data'
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});