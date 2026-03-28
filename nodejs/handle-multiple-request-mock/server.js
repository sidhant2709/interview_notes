import express from 'express';

const app = express();
const PORT = 3000;

// Simulated async database function using Promise
function getUserFromDatabase(id) {
  return new Promise((resolve) => {
    console.log(`Start fetching user ${id} from DB...`);
    setTimeout(() => {
      console.log(`Finished fetching user ${id}`);
      resolve({ id, name: `User${id}` });
    }, 12000); // 12 seconds delay
  });
}

// Route handler using async/await
app.get('/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await getUserFromDatabase(userId);
    res.send(user);
  } catch (error) {
    res.status(500).send('Error fetching user');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
