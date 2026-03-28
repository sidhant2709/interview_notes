import http from 'http';
import colors from 'colors';

const server = http.createServer((request, response) => {
  response.end('Hey! This is your server response!');
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}..`.yellow.bold);
});
