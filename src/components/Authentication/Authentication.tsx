import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService, LoginCredentials, SignupCredentials, AuthResponse } from '../../services/authService';
import { logError, showErrorToast } from '../../utils/errorUtils';
import './Authentication.css';

interface AuthenticationProps {
  onAuthSuccess: (userId: string) => void;
}

const Authentication: React.FC<AuthenticationProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      showErrorToast(new Error('Please fill in all required fields'));
      return false;
    }

    if (!isLogin) {
      if (!formData.name) {
        showErrorToast(new Error('Please enter your name'));
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        showErrorToast(new Error('Passwords do not match'));
        return false;
      }
      if (formData.password.length < 8) {
        showErrorToast(new Error('Password must be at least 8 characters long'));
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;

    setIsLoading(true);

    try {
      const response: AuthResponse = isLogin
        ? await authService.login(formData as LoginCredentials)
        : await authService.signup(formData as SignupCredentials);

      onAuthSuccess(response.user.id);
    } catch (error) {
      logError(error as Error, 'Authentication', undefined, {
        mode: isLogin ? 'login' : 'signup',
        email: formData.email
      });
      showErrorToast(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: {
      opacity: 0,
      x: isLogin ? -100 : 100
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      x: isLogin ? 100 : -100,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Login to continue' : 'Sign up to get started'}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? 'login' : 'signup'}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleSubmit}
            className="auth-form"
          >
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </motion.div>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
            />

            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </motion.div>
            )}

            <motion.button
              type="submit"
              className={`auth-button ${isLoading ? 'loading' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner" />
              ) : (
                isLogin ? 'Login' : 'Sign Up'
              )}
            </motion.button>
          </motion.form>
        </AnimatePresence>

        <motion.p
          className="auth-switch"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            disabled={isLoading}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Authentication;
