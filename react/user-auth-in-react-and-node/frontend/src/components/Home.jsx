/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from 'react';
import Dashboard from './Dashboard';

const Home = ({ setIsLoggedIn, isLoggedIn }) => {
  useEffect(() => {
    if (!isLoggedIn) {
      console.log(isLoggedIn);
      localStorage.clear();
    }
    setIsLoggedIn(isLoggedIn);
  }, []);
  return (
    <div>
      <Dashboard setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
};

export default Home;
