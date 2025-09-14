import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => {
            setIsSubmitting(false);
            if (data.status === "successful") {
                // Save api_key if needed
                localStorage.setItem('api_key', data.data.api_key);
                navigate('/practice');
            } else {
                setErrors({ general: data.message || "Login failed" });
            }
        })
        .catch(() => {
            setIsSubmitting(false);
            setErrors({ general: "Server error. Please try again." });
        });
    };

    return (
        <>
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1>Welcome Back</h1>
                        <p>Sign in to continue your coding journey</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? 'error' : ''}
                                placeholder="Your email address"
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? 'error' : ''}
                                placeholder="Your password"
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>
                        
                        <div className="form-options">
                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                />
                                <label htmlFor="rememberMe">Remember me</label>
                            </div>
                            
                        </div>
                        
                        <button 
                            type="submit" 
                            className="login-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                    
                    <div className="login-footer">
                        <p>Don't have an account? <Link to="/signup">Create one</Link></p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;