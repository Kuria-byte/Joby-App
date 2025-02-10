import React, { useState } from 'react';
import { FaLinkedin, FaFacebook } from 'react-icons/fa';
import './Auth.css';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onSocialLogin: (provider: 'linkedin' | 'facebook') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSocialLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onLogin(email, password);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login to Joby</h2>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <button type="submit" className="submit-button">
          Login
        </button>

        <div className="social-login">
          <p>Or login with</p>
          <div className="social-buttons">
            <button
              type="button"
              onClick={() => onSocialLogin('linkedin')}
              className="social-button linkedin"
            >
              <FaLinkedin /> LinkedIn
            </button>
            <button
              type="button"
              onClick={() => onSocialLogin('facebook')}
              className="social-button facebook"
            >
              <FaFacebook /> Facebook
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
