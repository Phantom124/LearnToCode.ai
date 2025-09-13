import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";


import c from "../../../../assets/icons8-c.svg"
import python from "../../../../assets/icons8-python.svg"
import JavaScript from "../../../../assets/icons8-javascript.svg"
import CSharp from "../../../../assets/icons8-c-sharp.svg"
import Ruby from "../../../../assets/icons8-ruby.svg"
import sql from "../../../../assets/icons8-sql.svg"
import java from "../../../../assets/icons8-java.svg"


const Practice = () => {

    const languages = [
        {id:1 ,name: "C", logo: <img src={c} alt="C logo" /> },
        {id:2 , name: "Python", logo: <img src={python} alt="Python logo" /> },
        {id:3 , name: "JavaScript", logo: <img src={JavaScript} alt="JavaScript logo" /> },
        {id:4 , name: "C#", logo: <img src={CSharp} alt="C# logo" /> },
        {id:5 , name: "Ruby", logo: <img src={Ruby} alt="Ruby logo" /> },
        {id:6 , name: "SQL", logo: <img src={sql} alt="SQL logo" /> },
        {id:7 , name: "Java", logo: <img src={java} alt="Java logo" /> },
    ];


    const [languageId, setLanguageId] = useState(1);

    const selectedLang = languages.find(lang => lang.id === languageId);

    function changeIcon() {
        for (let i = 0; i < languages.length; i++) {
            if (languages[i].name === language) {
                setIcon(languages[i].logo)
            }
        }
    }

    return (
        <div className="practice">
            <Sidebar/>
            <section className="practice-section">
                <h1 className="practice-title">Welcome to the Battleground</h1>
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
            </section>
        </div>
    );
};

export default Practice;