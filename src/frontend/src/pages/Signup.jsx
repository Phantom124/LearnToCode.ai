import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
        userLevel: 'Beginner'
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const validate = () => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'First name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        if (!formData.agreeTerms) {
            newErrors.agreeTerms = 'You must agree to the terms and conditions';
        }
        
        return newErrors;
    };

    // set cookie (expires in days)
    function setCookie(name, value, days = 2) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Expires=${expires}; SameSite=Lax; Secure`;
    }

    // read cookie
    function getCookie(name) {
    return document.cookie.split('; ').reduce((acc, pair) => {
        const [k, v] = pair.split('=');
        return k === encodeURIComponent(name) ? decodeURIComponent(v) : acc;
    }, null);
    }

    // delete cookie
    function deleteCookie(name) {
        document.cookie = `${encodeURIComponent(name)}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        setErrors(newErrors);
        if (Object.keys(newErrors).length) return;

        try{

            const payload = {
                email: formData.email,
                password: formData.password,
                name: formData.firstName,
                surname: formData.lastName,
                user_level: formData.userLevel
            }

            const res = await axios.post('http://localhost:3000/users/signup', payload);
            // console.log(res.data);
            const api_key = res?.data?.data?.api_key; 

            setCookie('api_key', api_key);
            
            navigate('/practice');
        } catch (err) {
            setErrors({ form: err.message || 'Network error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="signup-container">
                <div className="signup-card">
                    <div className="signup-header">
                        <h1>Create Your Account</h1>
                        <p>Join thousands of learners on LearnToCode.ai</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="signup-form">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={errors.firstName ? 'error' : ''}
                                placeholder="Your first name"
                            />
                            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={errors.lastName ? 'error' : ''}
                                placeholder="Your last name"
                            />
                            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                        </div>
                        
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
                                placeholder="Create a password"
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={errors.confirmPassword ? 'error' : ''}
                                placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="userLevel">How would you describe your level in programming?</label>

                            <select
                                id="userLevel"
                                name="userLevel"
                                value={formData.userLevel}
                                onChange={handleChange}
                                className={errors.userLevel ? 'error' : ''}>

                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>

                            {errors.userLevel && <span className="error-message">{errors.userLevel}</span>}
                        </div>
                        
                        <div className="terms-checkbox">
                            <input
                                type="checkbox"
                                id="agreeTerms"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                className={errors.agreeTerms ? 'error' : ''}
                            />
                            <label htmlFor="agreeTerms">
                                I agree to the Terms of Service and Privacy Policy
                            </label>
                            {errors.agreeTerms && <span className="error-message">{errors.agreeTerms}</span>}
                        </div>
                        
                        <button 
                            type="submit" 
                            className="signup-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                    
                    <div className="signup-footer">
                        <p>Already have an account? <Link to="/login">Sign in</Link></p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;