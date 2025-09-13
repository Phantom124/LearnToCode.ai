const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer>
            <p>&copy; {currentYear} LearnToCode AI. All rights reserved.</p>
        </footer>
    );
};

export default Footer;