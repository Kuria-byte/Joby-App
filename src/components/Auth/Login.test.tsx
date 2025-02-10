import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';

describe('Login', () => {
  const mockOnLogin = jest.fn();
  const mockOnSocialLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<Login onLogin={mockOnLogin} onSocialLogin={mockOnSocialLogin} />);
    
    expect(screen.getByText('Login to Joby')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<Login onLogin={mockOnLogin} onSocialLogin={mockOnSocialLogin} />);
    
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: /login/i });

    // Test invalid email
    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('validates password length', async () => {
    render(<Login onLogin={mockOnLogin} onSocialLogin={mockOnSocialLogin} />);
    
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    // Test short password
    await userEvent.type(passwordInput, '12345');
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<Login onLogin={mockOnLogin} onSocialLogin={mockOnSocialLogin} />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    expect(mockOnLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('handles social login buttons', async () => {
    render(<Login onLogin={mockOnLogin} onSocialLogin={mockOnSocialLogin} />);
    
    const linkedinButton = screen.getByRole('button', { name: /linkedin/i });
    const facebookButton = screen.getByRole('button', { name: /facebook/i });

    fireEvent.click(linkedinButton);
    expect(mockOnSocialLogin).toHaveBeenCalledWith('linkedin');

    fireEvent.click(facebookButton);
    expect(mockOnSocialLogin).toHaveBeenCalledWith('facebook');
  });

  it('shows required field errors when form is empty', async () => {
    render(<Login onLogin={mockOnLogin} onSocialLogin={mockOnSocialLogin} />);
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <Login onLogin={mockOnLogin} onSocialLogin={mockOnSocialLogin} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
