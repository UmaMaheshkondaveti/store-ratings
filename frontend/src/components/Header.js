// src/components/Header.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { authData, logout } = useAuth();

  return (
    <header>
      <h1>Welcome {authData ? 'User' : 'Guest'}</h1>
      {authData ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button>Login</button>
      )}
    </header>
  );
};

export default Header;
