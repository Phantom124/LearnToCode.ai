import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

class MarkingHandler{
    constructor(){
        this.genAI = new GoogleGenAI({apiKey: process.env.API_KEY});
    }

    async markQuestion(question, user_answer){
        const prompt = `Please consider the following quesiton and user's answer:
        Question: ${JSON.stringify(question)}
        Correct Answer: ${question.answer || question.expectedOutput}
        
        And here is the user's answer:
        User Answer: ${user_answer}
        
        Please do the following:
        -Say if the user's answer is correct or not.
        -Provide a brief explanation.
        -Provide a score out of 1 (1 being correct, 0 being incorrect).
        
        Also return your response as JSON: { "isCorrect": true/false, "score": 1/0, "feedback": "..." }`;

        try{
            const response = await this.genAI.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    thinkingConfig: {
                        thinkingBudget: 0,
                    },
                }
            });

            let marking;
            try{
                marking = JSON.parse(response.text);
            }catch (e){
                marking = {
                    isCorrect: false,
                    score: 0,
                    feedback: 'Could not parse AI response'
                };
            }

            return marking;
            
        }catch (error){
            console.error("Error marking questions:", error);
            throw error;
        }
    }
}


export default MarkingHandler;