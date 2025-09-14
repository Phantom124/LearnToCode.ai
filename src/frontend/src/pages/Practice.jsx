import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";


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

    const [index, setIndex] = useState(0);
    
    const [loading, setLoading] = useState(false);
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

    const handleIncrement = () => {
        setIndex((i) => {
        const next = i + 1;
        if (next >= questions.length) {
        setGameState("end");
        return i; 
        }
        return next;
    });
    };


    const [languageId, setLanguageId] = useState(1);

    const selectedLang = languages.find(lang => lang.id === languageId);
    
    
    const [questions, setQuestions] = useState([]);

    const handleStart = () => {
    setGameState("playing");
    // setTimeLeft(30);
    // setScore(0);
    // setCurrentQuestion(0);
    // setSelectedAnswer(null);
  };
  const getQuestions = () => {
    // let q = questionss; // place holder for when i make api call
    setQuestions(q);
  }

  useEffect(() => {
  const langName = languages.find(lang => lang.id === languageId)?.name;

  setLoading(true);
  fetch("/api/questions/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: "b994e7f382b4f6678af8fa3894a34f20",
      language: langName,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data from API:", data);

      let cleanData = data.data;

      if (typeof cleanData === "string") {
        try {
          cleanData = cleanData
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
          cleanData = JSON.parse(cleanData);
        } catch (err) {
          console.error("Failed to parse JSON string from API:", err);
          cleanData = [];
        }
      }

      setQuestions(cleanData);
    })
    .catch((error) => {
      console.error("Error fetching questions:", error);
      setQuestions([]);
    }).finally(() => {
        setLoading(false); // 🔹 unblock
      });
  }, [languageId]);


  console.log("howdy" + questions)

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
                    }}/>
                }

                {gameState === "playing" && questions[index] && (
                    <QuestionCard
                        question={questions[index]}
                        qNumber={index + 1}
                        total={questions.length}
                        onNext={handleIncrement}
                    />
                )}

                {/* {gameState === "end" && <GameOver/>} */}

                {loading && (
                <div className="loader-container">
                    <p>AI Loading, give me about 20 seconds...</p>
                    <ClipLoader size={40} color="#000" />
                </div>
                )}

                
                
            </section>
        </div>
    );
};

export default Practice;