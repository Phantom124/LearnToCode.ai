import Navbar from "../components/Navbar";
import logoPath from "../../../../assets/learntocode_logo.svg";
import heroImage from "../../../../assets/Hero-img.png";
import Hero from "../components/Hero";
import Howitworks from "../components/Howitworks";
import Languages from "../components/Languages";
import Footer from "../components/Footer";
const Homepage = () => {
    return(
        <><><Navbar image={logoPath} /><main><>
            <Hero image={heroImage} />
            <Howitworks />
            <Languages />
        </></main></><Footer /></>
    );
};

export default Homepage;