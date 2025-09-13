require('dotenv').config();

const express = require('express');
const app = express();
const PORT = 3000;
const axios = require('axios');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' } // tighten for production
});

const api_key = process.env.API_KEY;
const gemini_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// mysql connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Could not connect to MySQL:', err);
    } else {
        console.log('Connected to MySQL database.');
        db.query(`
            CREATE TABLE IF NOT EXISTS users (
                email VARCHAR(255) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                surname VARCHAR(100) NOT NULL,
                hashed_password VARCHAR(255) NOT NULL,
                score INT DEFAULT 0,
                api_key VARCHAR(255) UNIQUE,
                user_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner'
            )
        `, (err) => {
            if (err) console.error('Error creating users table:', err);
        });
    }
});

app.use(express.json());

// signup endpoint
app.post('/users/signup', async (req, res) => {
    const { email, password, name, surname, user_level } = req.body;

    if (!email || !password || !name || !surname || !user_level) {
        return res.status(400).json({
            status: "unsuccessful",
            message: "Please input the required fields",
            data: null
        });
    }

    // check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).json({
                status: "unsuccessful",
                message: "Database error",
                data: null
            });
        }

        if (results.length > 0) {
            return res.status(409).json({
                status: "unsuccessful",
                message: "User already exists",
                data: null
            });
        }

        // hash password
        const hashed_password = await bcrypt.hash(password, 12);
        // generate api key for user
        const user_api_key = crypto.randomBytes(16).toString('hex');

        // insert new user
        db.query(
            `INSERT INTO users (email, name, surname, hashed_password, score, api_key, user_level)
             VALUES (?, ?, ?, ?, 0, ?, ?)`,
            [email, name, surname, hashed_password, user_api_key, user_level],
            (err) => {
                if (err) {
                    return res.status(500).json({
                        status: "unsuccessful",
                        message: "Could not create user",
                        data: null
                    });
                }
                return res.status(201).json({
                    status: "successful",
                    message: "Account created successfully",
                    data: {
                        api_key: user_api_key
                    }
                });
            }
        );
    });
});

app.post('/external-data', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await axios.post(
            `${gemini_url}?key=${api_key}`,
            {
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to LearnToCode.ai');
});

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
    });
});


// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});