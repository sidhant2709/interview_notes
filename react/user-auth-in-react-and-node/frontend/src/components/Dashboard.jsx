/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Dashboard = ({ setIsLoggedIn }) => {
  const userLoggedIn = JSON.parse(localStorage.getItem('userInfo')) || { name: '', email: '' };
  const { name, email } = userLoggedIn;

  useEffect(() => {
    if (name && email) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div>
      {userLoggedIn && name && email ? (
        <h1>{`${name} is logged in with email ${email}`}</h1>
      ) : (
        <Navigate replace to="/login" />
      )}
    </div>
  );
};

export default Dashboard;
