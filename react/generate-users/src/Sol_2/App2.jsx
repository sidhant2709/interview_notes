import useUsers from '../Sol_3/useUsers';

const App = () => {
  const { users, currentUser, nextUser, previousUser, currentIndex } = useUsers();

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h1>User List</h1>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <img src={currentUser.picture.large} alt={`${currentUser.name.first} ${currentUser.name.last}`} />
        <p>
          Name: {currentUser.name.first} {currentUser.name.last} {currentIndex}
        </p>
        <p>Email: {currentUser.email}</p>
        <p>Phone: {currentUser.phone}</p>
      </div>
      <div>
        <button onClick={previousUser}>Previous</button>
        <button onClick={nextUser}>Next</button>
      </div>
    </div>
  );
};

export default App;
