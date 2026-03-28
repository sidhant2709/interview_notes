import React, { useState } from 'react';
import useRandomUser from './useUsers';

const App = () => {
  const { users, currentUser, handleNextUser, handlePreviousUser, currentUserIndex } = useRandomUser();

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1>User List </h1>
      {currentUser && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <img src={currentUser.picture.large} alt={currentUser.name.first} />
            <p>Name: {`${currentUser.name.first} ${currentUser.name.last}`}</p>
            <p>Email: {currentUser.email}</p>
            <p>Phone: {currentUser.phone}</p>
          </div>
          <div>
            <button
              onClick={handlePreviousUser}
              style={{ margin: '15px' }}
              disabled={users.length === 0 || currentUserIndex === 0}
            >
              Previous
            </button>
            <button onClick={handleNextUser}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
