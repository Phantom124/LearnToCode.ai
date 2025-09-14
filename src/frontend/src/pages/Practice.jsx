import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";


import c from "../../../../assets/icons8-c.svg"
import python from "../../../../assets/icons8-python.svg"
import JavaScript from "../../../../assets/icons8-javascript.svg"
import CSharp from "../../../../assets/icons8-c-sharp.svg"
import Ruby from "../../../../assets/icons8-ruby.svg"
import sql from "../../../../assets/icons8-sql.svg"
import java from "../../../../assets/icons8-java.svg"
import Start from "../components/Start";
import QuestionCard from "../components/Questioncard";
import GameOver from "../components/Gameover";
import Timer from "../components/Timer";


const Practice = () => {

    
    const [gameState, setGameState] = useState("start");

    const languages = [
        {id:1 ,name: "C++", logo: <img src={c} alt="C++ logo" /> },
        {id:2 , name: "Python", logo: <img src={python} alt="Python logo" /> },
        {id:3 , name: "JavaScript", logo: <img src={JavaScript} alt="JavaScript logo" /> },
        {id:4 , name: "C#", logo: <img src={CSharp} alt="C# logo" /> },
        {id:5 , name: "Ruby", logo: <img src={Ruby} alt="Ruby logo" /> },
        {id:6 , name: "SQL", logo: <img src={sql} alt="SQL logo" /> },
        {id:7 , name: "Java", logo: <img src={java} alt="Java logo" /> },
    ];


    const [languageId, setLanguageId] = useState(1);

    const selectedLang = languages.find(lang => lang.id === languageId);
    
    const questionss = [
        {
            "id": 1,
            "type": "multiple-choice",
            "question": "Which of the following is the correct way to declare a pointer in C++?",
            "options": [
            "int p;",
            "int *p;",
            "int &p;",
            "pointer int p;"
            ],
            "answer": "int *p;"
        },
        {
            "id": 3,
            "type": "write-code",
            "question": "Write a C++ program that prints 'Hello World' to the console."
        },
        {
            "id": 2,
            "type": "fill-in-the-blank",
            "question": "In C++, the keyword used to define a constant variable is ______.",
            "answer": "const"
        },
        
        
        {
            "id": 4,
            "type": "fill-in-the-blank",
            "question": "In C++, the operator used to allocate memory dynamically is ______.",
            "answer": "new"
        },
        {
            "id": 5,
            "type": "multiple-choice",
            "question": "Which of these is NOT a valid C++ data type?",
            "options": [
            "int",
            "float",
            "real",
            "double"
            ],
            "answer": "real"
        },
        {
            "id": 6,
            "type": "write-code",
            "question": "Write a C++ function that takes two integers and returns their sum."
        },
        {
            "id": 7,
            "type": "fill-in-the-blank",
            "question": "The process of creating multiple functions with the same name but different parameters is called ______.",
            "answer": "function overloading"
        },
        {
            "id": 8,
            "type": "multiple-choice",
            "question": "What is the correct syntax to include the iostream library?",
            "options": [
            "#include <iostream>",
            "#include iostream",
            "import iostream",
            "#include (iostream)"
            ],
            "answer": "#include <iostream>"
        },
        {
            "id": 9,
            "type": "write-code",
            "question": "Write a C++ class named 'Book' with two member variables: title and author, both strings. Provide a constructor to initialize them."
        },
        {
            "id": 10,
            "type": "fill-in-the-blank",
            "question": "In C++, the destructor of a class has the same name as the class but is preceded by the symbol ______.",
            "answer": "~"
        }
    ]
    
    const [questions, setQuestions] = useState([]);

    const handleStart = () => {
    setGameState("playing");
    // setTimeLeft(30);
    // setScore(0);
    // setCurrentQuestion(0);
    // setSelectedAnswer(null);
  };
  const getQuestions = () => {
    let q = questionss; // place holder for when i make api call
    setQuestions(q);
  }

    return (
        <div className="practice">
            <Sidebar/>
            <section className="practice-section">

                <div className="language-selection">
                    <label htmlFor="language-type">Select Language</label>
                    <select
                        onChange={(e) => setLanguageId(Number(e.target.value))}
                        name="language-type"
                        value={languageId}
                    >
                        {languages.map((lang) => (
                            <option key={lang.id} value={lang.id}>
                            {lang.name}
                            </option>
                        ))}

                    </select>
                    <div className="selected-language-logo">
                        {selectedLang.logo}                      
                    </div>
                </div>

                {gameState === "start" && <Start onStart={() => {
                    handleStart();
                    getQuestions();
                    }}/>
                }

                {gameState === "playing" && <QuestionCard question={questions[0]}/>

                }
                
            </section>
        </div>
    );
};

export default Practice;