/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from 'react';

const About = ({ setIsLoggedIn, isLoggedIn }) => {
  useEffect(() => {
    setIsLoggedIn(isLoggedIn);
  }, []);
  return <div>About</div>;
};

export default About;
