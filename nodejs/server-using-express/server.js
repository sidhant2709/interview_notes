import express from 'express';
import colors from 'colors';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/about', (request, response) => {
  response.send('<h1>Sidhant Server</h1>');
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}..`.yellow.bold);
});
