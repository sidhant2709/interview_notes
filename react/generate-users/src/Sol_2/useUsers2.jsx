import { useState, useEffect, useCallback } from 'react';

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('https://randomuser.me/api/');
      const data = await response.json();
      setUsers(prevUsers => [...prevUsers, ...data.results]);
    } catch (error) {
      console.error(error);
    }
  }, []);

  console.log('currentIndex', currentIndex);

  console.log(users);

  useEffect(() => {
    fetchUsers();
  }, [currentIndex]);

  const nextUser = () => {
    setCurrentIndex(prevIndex => (prevIndex === users.length - 1 ? 0 : prevIndex + 1));
  };

  const previousUser = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? users.length - 1 : prevIndex - 1));
  };

  return {
    users,
    currentUser: users[currentIndex],
    nextUser,
    previousUser,
    currentIndex,
  };
};

export default useUsers;
