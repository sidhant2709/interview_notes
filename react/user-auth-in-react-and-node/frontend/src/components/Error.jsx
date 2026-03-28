/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from 'react';

const ErrorComponent = ({ setIsLoggedIn, isLoggedIn }) => {
  useEffect(() => {
    if (!isLoggedIn) {
      setIsLoggedIn(!isLoggedIn);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return <div>404 Error: Page Not Found</div>;
};

export default ErrorComponent;
