import c from "../../../../assets/icons8-c.svg"
import python from "../../../../assets/icons8-python.svg"
import JavaScript from "../../../../assets/icons8-javascript.svg"
import CSharp from "../../../../assets/icons8-c-sharp.svg"
import Ruby from "../../../../assets/icons8-ruby.svg"
import sql from "../../../../assets/icons8-sql.svg"
import java from "../../../../assets/icons8-java.svg"


const Languages = () => {
    const languages = [
        { name: "C++", logo: <img src={c} alt="C++ logo" /> },
        { name: "Python", logo: <img src={python} alt="Python logo" /> },
        { name: "JavaScript", logo: <img src={JavaScript} alt="JavaScript logo" /> },
        { name: "C#", logo: <img src={CSharp} alt="C# logo" /> },
        { name: "Ruby", logo: <img src={Ruby} alt="Ruby logo" /> },
        { name: "SQL", logo: <img src={sql} alt="SQL logo" /> },
        { name: "Java", logo: <img src={java} alt="Java logo" /> },
    ];

    const duplicatedLanguages = [...languages, ...languages];

    return (
        <section className="languages-section">
            <div className="container">
                <h2 className="section-heading">Languages We Support</h2>
                <p className="section-description">
                    Learn to code with our wide selection of programming languages
                </p>

                <div className="infinite-scroll-container">
                    <div className="infinite-scroll-track">
                        {duplicatedLanguages.map((lang, index) => (
                        <div className="language-logo" key={index}>
                            <div className="logo-container">{lang.logo}</div>
                            <span className="language-name">{lang.name}</span>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

        </section>
    );
};

export default Languages;