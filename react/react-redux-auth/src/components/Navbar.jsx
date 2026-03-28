import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <nav>
      <div className="parent">
        <div className="child">
          <p className="text">
            <Link to="/">Home</Link>
          </p>

          <p className="text">
            <Link to="/about">About</Link>
          </p>
        </div>

        <div className="child">
          {isLoggedIn ? (
            <p className="button" onClick={handleLogout}>
              Logout
            </p>
          ) : (
            <>
              <p className="button">
                <Link to="/login">Login</Link>
              </p>
              <p className="button">
                <Link to="/register">Register</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
