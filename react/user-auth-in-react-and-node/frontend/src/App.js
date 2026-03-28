import './App.css';
import React, { useState } from 'react';

import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { useNavigate } from 'react-router-dom';
import ErrorComponent from './components/Error';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    history('/');
  };

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Routes>
        <Route exact path="/" element={<Home setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
        <Route path="/about" element={<About setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
        <Route path="*" element={<ErrorComponent setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
      </Routes>
    </div>
  );
}

export default App;
