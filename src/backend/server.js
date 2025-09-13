require('dotenv').config();

const express = require('express');
const app = express();
const PORT = 3000;
const axios = require('axios');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const http = require('http');

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

// login endpoint
app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password){
        return res.status(400).json({
            status: "unsuccessful",
            message: "Please input the required fields",
            data: null
        });
    }

    // db query
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err){
            return res.status(500).json({
                status: "unsuccessful",
                message: "Database error",
                data: null
            });
        }
        if (results.length === 0){
            return res.status(400).json({
                status: "unsuccessful",
                message: "Invalid credentials",
                data: null
            });
        }

        const user_profile = results[0];

        const match_found = await bcrypt.compare(password, user_profile.hashed_password);
        if (!match_found){
            return res.status(400).json({
                status: "unsuccessful",
                message: "Invalid credentials",
                data: null
            });
        }
        return res.status(200).json({
            status: "successful",
            message: "Login successful",
            data: {
                api_key: user_profile.api_key
            }
        });
    });
});

// get_profile endpoint
app.post('/users/get_profile', async (req, res) => {
    const { api_key } = req.body;

    if (!api_key){
        return res.status(400).json({
            status: "unsuccessful",
            message: "API Key required",
            data: null
        });
    }

    //db query
    db.query('SELECT email, name, surname, user_level FROM users WHERE api_key = ?', [api_key], async(err, results) => {
        if (err){
            return res.status(500).json({
                status: "unsuccessful",
                message: "Database error",
                data: null
            });
        }

        if(results.length === 0){
            return res.status(400).json({
                status: "unsuccessful",
                message: "Invalid API Key",
                data: null
            });
        }

        const user_profile = results[0];

        return res.status(200).json({
            status: "successful",
            message: "Profile retrieved successfully",
            data: user_profile
        });
    });
});

// update_profile endpoint
app.post('/users/update_profile', async (req, res) => {
    const { api_key, name, surname, user_level } = req.body;

    if (!api_key || !name || !surname || !user_level){
        return res.status(400).json({
            status: "unsuccessful", 
            message: "Please input the required fields",
            data: null
        });
    }

    //db query
    db.query('UPDATE users SET name = ?, surname = ?, user_level = ? WHERE api_key = ?', [name, surname, user_level, api_key], async (err, results) => {
        if (err){
            return res.status(500).json({
                status: "unsuccessful", 
                message: "Database error", 
                data: null
            });
        }

        if (results.affectedRows === 0){
            return res.status(400).json({
                status: "unsuccessful",
                message: "Invalid API Key",
                data: null
            });
        }

        // returning updated profile
        db.query('SELECT email, name, surname, user_level FROM users WHERE api_key =?', [api_key], async(err, results) => {
            if (err || results.length === 0){
                return res.status(500).json({
                    status: "unsuccessful",
                    message: "Could not retrieve updated profile",
                    data: null
                });
            }

            const user_profile = results[0];

            return res.status(200).json({
                status: "successful",
                message: "Profile updated successfully",
                data: user_profile
            });
        });
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

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });


//==============================================================================================================================
// socket endpoint

const httpServer = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(httpServer, {
    cors: { origin: "*" }
});

io.on('connection', (socket) => {  
    console.log('A user has connected: ', socket.id);

    socket.on('update_score', ({ api_key, score }, callback) => {
        db.query('UPDATE users SET score = ? WHERE api_key = ?', [score, api_key], (err, results) => {
            if (err || results.affectedRows === 0){
                callback({ status: "unsuccessful", message: "Score update failed" });
            }
            else{
                callback({ status: "successful", message: "Score updated" });
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('A user has disconnected: ', socket.id);
    });
});


httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
