const Navbar = (props) => {
    return (
        <header>
            <div className="logo">
                <a href="/"><img src={props.image} alt="learn-to-code-logo"/></a>
            </div>

            <nav className="home-nav">
                <ul role="list">
                    <li><a href="/">About Us</a></li>
                    <li><a href="/login" target="_blank">Login</a></li>
                    <li><a href="/signup" target="_blank">Sign Up</a></li>
                </ul>
            </nav>
        </header>
    );
}

export default Navbar;