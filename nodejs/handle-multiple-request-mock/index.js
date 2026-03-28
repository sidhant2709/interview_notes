import express from 'express';

const app = express();
const PORT = 3000;

// Simulated database function
function getUserFromDatabase(id, callback) {
  // Simulate a delay (e.g., querying database)
  console.log(`Start fetching user ${id} from DB...`);
  setTimeout(() => {
    console.log(`Finished fetching user ${id}`);
    callback(null, { id, name: `User${id}` });
  }, 10000); // 10 seconds delay
}

// Route handler for GET /user/:id
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;

  // Simulate DB fetch
  getUserFromDatabase(userId, (err, user) => {
    if (err) {
      return res.status(500).send('Error fetching user');
    }
    res.send(user);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
