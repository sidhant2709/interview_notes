import app from './app.js';
import http from 'http';
import colors from 'colors';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.TYPE_TWO_PORT || 4000;

app.set('port', PORT);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}..`.yellow.bold);
});
