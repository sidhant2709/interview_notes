/*
In this implementation, the useUserList hook initializes the userList state to an empty array and the currentUserIndex state to -1. It provides two functions to fetch the next and previous users from the API, respectively. If the next user is already in the userList state, it just updates the currentUserIndex state to point to the next user. Otherwise, it fetches a new user from the API, appends it to the userList state, and updates the currentUserIndex state to point to the newly added user.

The hook also provides a getCurrentUser function that returns the user object corresponding to the current index.

The UserList component renders the user's picture, name, and two buttons to fetch the next and previous users. It uses the getCurrentUser, fetchNextUser, and fetchPrevUser functions provided by the useUserList hook to display the current user and handle button clicks.

Note that this implementation caches all the fetched users in the userList state, which can lead to high memory usage for a large number of users. To mitigate this, you could add a limit to the number of users stored in the userList state and remove the oldest user when the limit is reached.

*/

import { useState, useEffect } from 'react';

const useUser = () => {
  const [userList, setUserList] = useState([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(-1);

  const fetchNextUser = async () => {
    if (currentUserIndex < userList.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    } else {
      const response = await fetch('https://randomuser.me/api');
      const data = await response.json();
      const newUserList = [...userList, data.results[0]];
      setUserList(newUserList);
      setCurrentUserIndex(newUserList.length - 1);
    }
  };

  const fetchPrevUser = () => {
    if (currentUserIndex > 0) {
      setCurrentUserIndex(currentUserIndex - 1);
    }
  };

  useEffect(() => {
    fetchNextUser();
  }, []);

  const getCurrentUser = () => {
    return userList[currentUserIndex];
  };

  return {
    userList,
    getCurrentUser,
    fetchNextUser,
    fetchPrevUser,
    currentUserIndex,
  };
};

export default useUser;
