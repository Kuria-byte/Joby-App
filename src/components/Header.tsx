import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { FaUserCircle } from 'react-icons/fa';

const Header: React.FC = () => {
  const handleAccountClick = () => {
    console.log('Manage account clicked');
  };

  return (
    <header className="app-header">
      <h1>Joby App</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <button onClick={handleAccountClick} className="account-icon">
        <FaUserCircle size={30} />
      </button>
    </header>
  );
};

export default Header;
