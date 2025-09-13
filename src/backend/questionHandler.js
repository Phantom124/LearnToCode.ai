import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { LevelContext, BeginnerState, IntermediateState, AdvancedState } from './levelState.js';

dotenv.config();

class QuestionSetHandler {
    constructor() {
        this.genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }

    async createQuestionSet(stateContext = new LevelContext()) {
        const userLevel = stateContext.getLevel();

        const prompt = `Please generate a set of more than 5 but less than 11 coding questions on a ${userLevel} level`
            + ` with some of them being multiple choice questions, others fill in the blank questions, and others being coding questions. `
            + ` and please return this in a JSON format. `
            + ` The format of multiple choice questions should be as follows: {
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
                "answer": "[Correct option letter, e.g., 'C']",
                "explanation": "[Brief explanation of the correct answer and why other options are incorrect]"
                }`
            + ` The format of the Fill-in-the-Blank Questions must be as follows: {
                "id": 2,
                "type": "fill-in-the-blank",
                "topic": "[Relevant topic, e.g., 'Algorithms']",
                "question": "[Sentence with a blank, e.g., 'The time complexity of a linear search is O(__).']",
                "answer": "[The correct word or phrase to fill the blank]",
                "explanation": "[Explanation of the answer and the concept]"
                } `
            + ` Coding Questions should follow this template: { 
                "id": 3,
                "type": "coding",
                "topic": "[Relevant topic, e.g., 'Functions']",
                "question": "[Description of the problem to be solved]",
                "starterCode": {
                    "[Language, e.g., 'Python']": "[Starter code block]"
                },
                "testCases": [
                    {
                    "input": "[Input for test case 1]",
                    "expectedOutput": "[Expected output for test case 1]"
                    },
                    {
                    "input": "[Input for test case 2]",
                    "expectedOutput": "[Expected output for test case 2]"
                    }
                ],
                "explanation": "[Explanation of the solution approach and logic]"
                }`;

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
            console.log(response.text);
            return response.text;
        } catch (error) {
            console.error("Error generating question set:", error);
            throw error;
        }
    }
}

export default QuestionSetHandler;