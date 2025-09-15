const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");
const { LevelContext, BeginnerState, IntermediateState, AdvancedState } = require('./levelState');

dotenv.config();

class QuestionSetHandler {
    constructor(stateContext = new LevelContext()) {
        this.stateContext = stateContext;
        this.genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }

    async createQuestionSet() {
        const userLevel = this.stateContext.getLevel();
        const language = this.stateContext.getLanguage();
// "answer": "[Correct option letter, e.g., 'C']",
// "explanation": "[Brief explanation of the correct answer and why other options are incorrect]"
// "answer": "[The correct word or phrase to fill the blank]",
// "explanation": "[Explanation of the answer and the concept]"
// "explanation": "[Explanation of the solution approach and logic]"

        const prompt = `Please generate a set of more than 5 but less than 11 coding questions for the ${language} programming language 
                        on a ${userLevel} level with some of them being multiple choice questions, others fill in the blank questions, 
                        and others being coding questions. The format of multiple choice questions should be as follows: 
            {
                "id": 1,
                "type": "multiple-choice",
                "topic": "[Relevant topic, e.g., 'Data Structures']",
                "question": "[Full text of the question]",
                "options": [
                    "A. [Option A]",
                    "B. [Option B]",
                    "C. [Option C]",
                    "D. [Option D]"
                ],
            } 
            The format of the Fill-in-the-Blank Questions must be as follows:
            {
                "id": 2,
                "type": "fill-in-the-blank",
                "topic": "[Relevant topic, e.g., 'Algorithms']",
                "question": "[Sentence with a blank, e.g., 'The time complexity of a linear search is O(__).']",
            }
            Coding Questions should follow this template: 
            {
                "id": 3,
                "type": "coding",
                "topic": "[Relevant topic, e.g., 'Functions']",
                "question": "[Description of the problem to be solved]",
                "starterCode": {
                "[Language, e.g., 'Python']": "[Starter code block]"
            }
            and please return this in a JSON structure, and only return the JSON. No other text. And please be creative with the questions `;

        try {
            const response = await this.genAI.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    thinkingConfig: {
                        thinkingBudget: 0,
                    },
                }
            });
            // console.log(response.text);
            return response.text;
        } catch (error) {
            const status = error?.status ?? error?.error?.code;
            console.warn(`GenAI error (attempt ${attempt}):`, status, error?.message || error);

                // retry for transient conditions (rate limit / overloaded)
            if (attempt < maxRetries && (status === 429 || status === 503 || status === 'UNAVAILABLE')) {
                // exponential backoff with jitter
                const backoff = Math.min(2000, Math.pow(2, attempt) * 100) + Math.floor(Math.random() * 200);
                await new Promise((resolve) => setTimeout(resolve, backoff));
                // continue; // retry
            }
            throw error;
        }
    }
}

module.exports = QuestionSetHandler;