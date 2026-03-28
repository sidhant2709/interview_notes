import { useState, useEffect, useCallback } from 'react';

const useRandomUser = () => {
  const [users, setUsers] = useState([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const fetchUsers = useCallback(async () => {
    const response = await fetch('https://randomuser.me/api/');
    const data = await response.json();
    setUsers(prevUsers => [...prevUsers, data.results[0]]);
  }, []);

  const handleNextUser = useCallback(() => {
    if (currentUserIndex === users.length - 1) {
      fetchUsers();
    }
    setCurrentUserIndex(prevIndex => prevIndex + 1);
  }, [currentUserIndex, users.length, fetchUsers]);

  const handlePreviousUser = useCallback(() => {
    setCurrentUserIndex(prevIndex => prevIndex - 1);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const currentUser = users[currentUserIndex];

  return { users, currentUser, handleNextUser, handlePreviousUser, currentUserIndex };
};

export default useRandomUser;
