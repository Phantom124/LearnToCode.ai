const Hero = (prop) => {
    return(
        <section className="hero">
            <div className="hero-content">
                <div className="hero-text">
                    <h1>Code Smarter, Not Harder</h1>
                    <p>AI-powered learning that adapts to your pace. From beginner to expert, we'll guide you every step of the way.</p>
                    <div className="hero-cta-group">
                        <button className="primary-btn" onClick={() => window.open('/signup', '_blank', 'noopener,noreferrer')}>
                            Get Started
                            </button>
                        {/* <button className="secondary-btn">Watch Demo</button> */}
                    </div>
                </div>

                <div className="hero-image">
                    <img src={prop.image} alt="hero-logo 3d image"/>
                </div>

            </div>
        </section>
    );
};

export default Hero;