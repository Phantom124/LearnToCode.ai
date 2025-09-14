import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Gameover from "../components/Gameover";
import Questioncard from "../components/Questioncard";
import Start from "../components/Start";
import Timer from "../components/Timer";
import "../styles/Quiz.css";

function Quiz() {
  const [gameState, setGameState] = useState("start"); // "start", "playing", "end"
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const QUESTIONS = [
        {
            question: "Which of the following is NOT a JavaScript data type?",
            options: ["String", "Boolean", "Character", "Number"],
            correct: 2,
        },
        {
            question: "How do you declare a JavaScript variable?",
            options: ["variable carName", "v carName", "var carName", "int carName"],
            correct: 2,
        },
        {
            question: "Which operator is used to assign a value to a variable?",
            options: ["=", "*", "-", "x"],
            correct: 0,
        },
        {
            question: "What will '10' + 20 evaluate to in JavaScript?",
            options: ["30", "'1020'", "TypeError", "NaN"],
            correct: 1,
        },
        {
            question: "Which function is used to parse a string to an integer in JavaScript?",
            options: ["Integer.parse()", "int()", "parseInt()", "parseInteger()"],
            correct: 2,
        },
        {
            question: "How do you create a function in JavaScript?",
            options: [
            "function myFunction()", 
            "function:myFunction()", 
            "function = myFunction()", 
            "create myFunction()"
            ],
            correct: 0,
        },
        {
            question: "How do you call a function named 'myFunction'?",
            options: ["call myFunction()", "myFunction()", "call function myFunction()", "Call.myFunction()"],
            correct: 1,
        },
        {
            question: "How can you add a comment in JavaScript?",
            options: ["'This is a comment", "//This is a comment", "<!--This is a comment-->", "**This is a comment**"],
            correct: 1,
        },
        {
            question: "What is the correct way to write a JavaScript array?",
            options: [
            "var colors = (1:'red', 2:'green', 3:'blue')", 
            "var colors = ['red', 'green', 'blue']", 
            "var colors = 'red', 'green', 'blue'", 
            "var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')"
            ],
            correct: 1,
        },
        {
            question: "Which event occurs when the user clicks on an HTML element?",
            options: ["onmouseover", "onchange", "onclick", "onmouseclick"],
            correct: 2,
        }
    ];

  useEffect(() => {
    let timer;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === "playing") {
      setGameState("end");
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  const handleStart = () => {
    setGameState("playing");
    // setTimeLeft(30);
    // setScore(0);
    // setCurrentQuestion(0);
    // setSelectedAnswer(null);
  };

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    const isCorrect = index === QUESTIONS[currentQuestion].correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setGameState("end");
      }
    }, 1500);
  };

  return (
    <div className="quiz-page">
      <Sidebar />
      <main className="quiz-content">
        <div className="quiz-container">
          {gameState === "start" && <Start onStart={handleStart} />}
          
          {gameState === "playing" && (
            <div className="quiz-game">
              <Timer timeLeft={timeLeft} />
              <Questioncard
                question={QUESTIONS[currentQuestion]}
                onAnswerSelect={handleAnswer}
                selectedAnswer={selectedAnswer}
                totalQuestions={QUESTIONS.length}
                currentQuestion={currentQuestion}
              />
              <div className="quiz-score">
                Score: {score}/{QUESTIONS.length}
              </div>
            </div>
          )}
          
          {gameState === "end" && (
            <Gameover
              score={score}
              totalQuestions={QUESTIONS.length}
              onRestart={handleStart}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Quiz;