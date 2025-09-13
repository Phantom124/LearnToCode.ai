// CONNECT TO SERVER

const express = require('express');
const app = express();
const PORT = 3000;
const axios = require('axios');

const api_key = 'AIzaSyBvhOyH5ns__FwflCWhIOKHN79iutRrsp8';
const gemini_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

app.use(express.json());

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



