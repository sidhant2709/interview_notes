import express from 'express';

const app = express();

// app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Sidhant Server</h1>');
});

app.get('/about', (req, res) => {
  res.json({ message: 'Hey! This is your server response! in about route' });
});

// app.use((request, response) => {
//   response.json({ message: 'Hey! This is your server response!' });
// });

export default app;
