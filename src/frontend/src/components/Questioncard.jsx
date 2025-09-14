import { useState } from "react";
import "../styles/Questioncard.css";

const QuestionCard = ({ question }) => {
  if (!question) return <div>Loading question...</div>;
  const [multipleAnswer, setMultiple] = useState(null);
  return (
    <div className="question-card">
      <h2 className="question-title">Question #{question.id}</h2>
      <p className="question-text">{question.question}</p>

      {question.type === "multiple-choice" && (
        <div className="options">
          {question.options.map((option, index) => (
            <button
              key={index}
              className="option-button"
              onClick={()=> {setMultiple(index+1)}}
            >
              <div className="option-content">
                <span>{option}</span>
              </div>
              {console.log("mult is" + multipleAnswer)}
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
          />
        </div>
      )}

      {question.type === "write-code" && (
        <div className="code-editor-container">
          <textarea
            className="code-editor"
            placeholder="Write your code here..."
            rows={8}
          ></textarea>
        </div>
      )}

      <div className="question-actions">
        <button className="submit-button">Submit Answer</button>
      </div>
    </div>
  );
};

export default QuestionCard;