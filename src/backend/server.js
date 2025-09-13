require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
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
    port: process.env.DB_PORT,
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

const { LevelContext, BeginnerState, IntermediateState, AdvancedState } = require('./levelState');
const QuestionSetHandler = require('./questionHandler').default || require('./questionHandler');

app.get('/questions/get', async (req, res) => {
    try {
        const { api_key, language } = req.body;

        if (!(api_key && language)){
            return res.status(400).json({
                status : "unsuccessful",
                message : "Missing parameters",
                data : null
            });
        }

        //first get the score from db and using that score, we can determine the level
        let score = null;
        db.query("SELECT score from users where api_key = ?", [api_key], async (err, result) => {
            if (err || result.length === 0){
                return res.status(400).json({
                    status : "unsuccessful",
                    message : "User not found.",
                    data: null
                });
            }

            score = result[0].score;
            if (!score) score = 0;

        });

        let state = null;
        if (score < 100){
            state = new BeginnerState(score % 100);
        } else if (score < 200) {
            state = new IntermediateState(score % 100);
        } else if (score < 300) {
            state = new AdvancedState(score % 100);
        }

        context = new LevelContext(state, language); 
        qsh = new QuestionSetHandler(context);
        // questions = 

        return res.status(200).json({
            status : "successful",
            message : "Questions generated successfully.",
            data : await qsh.createQuestionSet(context)
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ 
            status: "unsuccessful", 
            message: "Server error", 
            data: null 
        });
    }
});

// mark_question endpoint
app.post('/users/mark_question', async(req, res) => {
    const { api_key, question_id, user_answer, correct_answer, score_increment } = req.body;

    if (!api_key || !question_id || !user_answer || !correct_answer || !score_increment){
        return res.status(400).json({
            status: "unsuccessful",
            message: "Please input all required fields",
            data: null
        });
    }

    // validate answer
    const validate_answer = user_answer.trim().toLowerCase() === correct_answer.trim().toLowerCase();

    if (!validate_answer){
        return res.status(200).json({
            status: "unsuccessful",
            message: "Incorrect answer",
            data: null
        });
    }

    // update user score (correct = increase score)
    db.query('UPDATE users SET score = score + ? WHERE api_key = ?', [score_increment, api_key], (err, results) => {
        if (err || results.affectedRows === 0){
            return res.status(500).json({
                status: "unsuccessful",
                message: "Could not update score",
                data: null
            });
        }
        return res.status(200).json({
            status: "successful",
            message: "Correct answer! Score updated.",
            data: {
                correct: true
            }
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
