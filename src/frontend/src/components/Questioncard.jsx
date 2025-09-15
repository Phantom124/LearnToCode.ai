import { useState, useEffect } from "react";
import "../styles/Questioncard.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QuestionCard = ({ question, qNumber, total, onNext }) => {

    function getCookie(name) {
        return document.cookie.split('; ').reduce((acc, pair) => {
            const [k, v] = pair.split('=');
            return k === encodeURIComponent(name) ? decodeURIComponent(v) : acc;
        }, null);
    }

    if (!question) return <div>Error occured while loading question</div>;
    const [multipleAnswer, setMultiple] = useState({ id: null, answer: null });
    const [blankAnswer, setBlank] = useState({ id: null, answer: "" });
    const [codeAnswer, setCode] = useState({ id: null, answer: "" });

    const [isSubmitting, setSubmitting] = useState(false);

    //just testing
    // useEffect(() => {
    //     console.log("Curr: ", blankAnswer);
    // }, [blankAnswer]);

    // useEffect(() => {
    //     console.log("Code: ", codeAnswer);
    // }, [codeAnswer]);

    const handleGrade = async (correctAnswer) => {
        // const res = await 
        fetch("/api/users/mark_question", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                api_key: getCookie("api_key"),
                question: question.question,
                user_answer: (question.type === "multiple-choice")? question.options[correctAnswer.answer-1] : correctAnswer.answer,
                score_increment: 100,
            }),
        }).then((res) => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        }).then((data) => {


            console.log("Marked question response:", data);
            // data = JSON.parse(data);

            if (data.data.isCorrect) {
                toast.success("Correct!", { autoClose: 2000 });
            } else {
                toast.error(`${data.feedback || "Incorrect answer"}`, {
                    autoClose: 3000,
                });
            }


            return data;
        }).catch((err) => {
            console.error("Error marking question:", err);
        });
    };

    const getActiveAnswer = () => {
        if (multipleAnswer.id !== null) return multipleAnswer;
        if (blankAnswer.id !== null && blankAnswer.answer !== "") return blankAnswer;
        if (codeAnswer.id !== null && codeAnswer.answer !== "") return codeAnswer;
        return null;
    };

    const [isLoading, setLoader] = useState(false);

    // useEffect

    return (
        <div className="question-card">
            
            <h2 className="question-title">Question #{qNumber}{total ? ` of ${total}` : ""}</h2>
            <p className="question-text">{question.question}</p>

            {question.type === "multiple-choice" && (

                <div className="options">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            className={`option-button ${multipleAnswer?.answer === index + 1 ? "selected-answer" : ""}`}
                            onClick={() => { setMultiple({ id: question.id, answer: index + 1 }); setBlank({ id: null, answer: "" }); setCode({ id: null, answer: "" }); }}
                        >
                            <div className="option-content">
                                <span>{option}</span>
                            </div>
                            {console.log("mult is" + multipleAnswer.answer)}
                        </button>
                    ))}
                </div>
            )}

            {question.type === "fill-in-the-blank" && (
                <div className="fill-blank">
                    <input
                        type="text"
                        placeholder="Type your answer here"
                        className="answer-input"
                        value={blankAnswer.answer}
                        onChange={(e) => { setBlank({ id: question.id, answer: e.target.value }); setCode({ id: null, answer: "" }); setMultiple({ id: null, answer: null }); }}
                    />
                </div>
            )}

            {question.type === "coding" && (
                <div className="code-editor-container">
                    <textarea
                        className="code-editor"
                        placeholder="Write your code here..."
                        rows={8}
                        value={codeAnswer.answer || ""}
                        onChange={(e) => { setCode({ id: question.id, answer: e.target.value }), setBlank({ id: null, answer: "" }); setMultiple({ id: null, answer: null }); }}
                    />
                </div>
            )}

            <div className="question-actions">
                <button
                    className="submit-button"
                    disabled={isSubmitting}
                    onClick={async () => {
                        const active = getActiveAnswer?.();
                        if (!active) return;
                        setSubmitting(true);
                        await handleGrade(active);
                        setSubmitting(false);
                        onNext();
                    }}
                >
                    {isSubmitting ? "Submitting..." : "Submit Answer"}
                </button>

            </div>
            <ToastContainer position="top-center" />
        </div>
    );
};

export default QuestionCard;