import { useState } from "react";
import path from "../../../../assets/icons8-path.svg"
import ai from "../../../../assets/icons8-ai.svg"
import code from "../../../../assets/icons8-code.svg"
import help from "../../../../assets/icons8-lightbulb.svg"
const Howitworks = () => {

    const [step, setStep] = useState(1);
    const howItWorks = [
        {
            id: 1,
            title: "Choose Your Path",
            description: "Select from Python, JavaScript, React, or other programming languages to start your coding journey.",
            icon: path
        },
        {
            id: 2,
            title: "AI-Guided Learning",
            description: "Get personalized lessons adapted to your skill level. Our AI explains concepts in a way you understand.",
            icon: ai
        },
        {
            id: 3,
            title: "Practice & Build",
            description: "Write real code in our interactive editor. Build projects while getting instant feedback and suggestions.",
            icon: code
        },
        {
            id: 4,
            title: "Get Instant Help",
            description: "Stuck on a bug? Ask our AI tutor anything. Get explanations, debugging help, and code reviews instantly.",
            icon: help
        }
    ]

    const handlePrevious = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleNext = () => {
        if (step < howItWorks.length) setStep(step + 1)
    }


    return(
        <section className="how-it-works">
            <div className="how-it-works-content">
                <h1>How it Works</h1>
                <div className="how-it-works-display">
                    <div className="step" key={howItWorks[step - 1].id}>
                        <h2>{howItWorks[step - 1].title}</h2>
                        <div className="icon-step"><img src={howItWorks[step - 1].icon}/></div>
                        <p>{howItWorks[step - 1].description}</p>
                    </div>

                    <div className="toggle">
                        <button onClick={handlePrevious} disabled={step==1}>Previous</button>
                        <button onClick={handleNext} disabled={step==howItWorks.length}>Next</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Howitworks;