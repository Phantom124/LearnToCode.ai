const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

class MarkingHandler{
    constructor(){
        this.genAI = new GoogleGenAI({apiKey: process.env.API_KEY});
    }

    // Correct Answer: ${question.answer || question.expectedOutput}

    async markQuestion(question, user_answer){
        const prompt = `Please consider the following question and user's answer:
        Question: ${JSON.stringify(question)}
        
        And here is the user's answer:
        User Answer: ${user_answer}
        
        Please do the following:
        -Say if the user's answer is correct or not.
        -Provide a brief explanation.
        -Provide a score out of 1 (1 being correct, 0 being incorrect).
        
        Please respond ONLY with a JSON object like:
        {"isCorrect": true/false, "score": 1/0, "feedback": "..."}`;

        console.log("Prompt", prompt);

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
            try {
                let raw = response.text.trim();
                // Remove Markdown code block if present
                if (raw.startsWith('```')) {
                    raw = raw.replace(/```json|```/g, '').trim();
                }
                console.log("AI cleaned response:", raw);
                marking = JSON.parse(raw);
            } catch (e) {
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


module.exports = MarkingHandler;