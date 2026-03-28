# Node.js Server Using Express 🚀

This project demonstrates how to create and manage HTTP servers using Node.js and Express. It includes two server implementations located in the `typeOne` and `typeTwo` folders, each showcasing different approaches to server setup and configuration.

---

## Project Structure 🗂️

```
httpServer.js
package.json
server.js
typeOne/
    app.js
    index.js
typeTwo/
    app.js
    index.js
```

### Key Files and Folders 📁

- **`typeOne/`**: Contains the first server implementation.
  - `app.js`: Defines the Express application and routes.
  - `index.js`: Configures and starts the server using the `http` module.
- **`typeTwo/`**: Contains the second server implementation.
  - `app.js`: Defines the Express application and routes.
  - `index.js`: Configures and starts the server using the `http` module.
- **`package.json`**: Contains project dependencies and scripts.
- **`httpServer.js`**: (Purpose not specified in the current context.)
- **`server.js`**: (Purpose not specified in the current context.)

---

## `typeOne` Server 🌐

The `typeOne` server is implemented in `typeOne/index.js` and uses the following components:

### Features ✨

1. **Dynamic Port Configuration**:
   - The server reads the port from the `.env` file using the `dotenv` library.
   - If no port is specified, it defaults to `4000`.

2. **Error Handling**:
   - Handles common server errors like `EACCES` (permission issues) and `EADDRINUSE` (port already in use).

3. **Event Listeners**:
   - Listens for `error` and `listening` events to manage server behavior.

4. **Express Integration**:
   - Uses an Express application (`app.js`) to define routes and middleware.

### Code Highlights 💡

#### Port Normalization 🛠️
```javascript
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
```
This function ensures the port value is valid, returning either a numeric port or a named pipe.

#### Error Handling ⚠️
```javascript
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + PORT;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
```
This function handles server errors gracefully, logging appropriate messages and exiting the process if necessary.

#### Event Listeners 🎧
```javascript
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + PORT;
  console.log('Listening on ' + bind);
});
```
These listeners manage server events, such as errors and successful startup.

---

### Advantages of Creating a Server in This Way 🌟

1. **🎛 Flexibility with the Underlying HTTP Server**:
   - By explicitly using `http.createServer(app)`, you gain direct access to the underlying Node.js HTTP server. This allows you to extend the server's functionality, such as adding WebSocket support, handling raw HTTP requests, or customizing server behavior beyond what Express provides.

2. **🧯 Error Handling**:
   - The `errorHandler` function ensures that common server errors, such as permission issues (`EACCES`) or port conflicts (`EADDRINUSE`), are handled gracefully. This prevents the server from crashing unexpectedly and provides clear feedback to the developer about what went wrong.

3. **🔀 Dynamic Port Configuration**:
   - The `normalizePort` function allows the server to dynamically configure its port based on environment variables or fallback defaults. This makes the server more portable and easier to deploy in different environments (e.g., development, staging, production).

4. **📡 Event-Driven Architecture**:
   - The use of event listeners (`error` and `listening`) provides a clean and modular way to handle server lifecycle events. This makes the code easier to maintain and extend, as specific actions can be tied to specific events.

5. **⚙️ Express Integration**:
   - The server is tightly integrated with the Express application (`app.js`), which simplifies request handling and routing. Express provides a robust framework for defining middleware, routes, and other server logic, making it easier to build scalable applications.

6. **🎨 Clear Logging with colors**:
   - The use of the `colors` library for styled console logs ensures that important messages, such as server startup or errors, are easy to spot. This improves the developer experience during debugging and monitoring.

7. **🧩 Separation of Concerns**:
   - By separating the Express application (`app.js`) from the server setup, the code adheres to the principle of separation of concerns. This makes the application logic reusable and testable, as the `app` can be used independently of the server (e.g., for unit testing).

8. **📈 Scalability**:
   - Since the server is built on top of Node.js's `http` module, it can handle a large number of concurrent connections efficiently. Additionally, the modular design makes it easier to scale the application by adding features or integrating with other services.

9. **🌍 Cross-Environment Compatibility**:
   - The use of `dotenv` to load environment variables ensures that the server can be easily configured for different environments without hardcoding values. This is particularly useful for deploying the server in cloud environments or containerized setups.

1. **🏗 Future Extensibility**:
   - By explicitly creating the server and handling events, the code is prepared for future extensions. For example, you could add HTTPS support, integrate with a load balancer, or implement advanced features like HTTP/2 without significant refactoring.

---

### What is `server.on` and What It Does 🔍

The `server.on` method is used to attach event listeners to the `server` object, which is an instance of the `http.Server` class. These event listeners allow you to handle specific events that occur during the server's lifecycle, such as errors or when the server starts listening for connections.

#### Key Events in the Code 📌

1. **`server.on('error', errorHandler)`**:
   - This attaches the `errorHandler` function to the `error` event of the server.
   - The `error` event is triggered when the server encounters an issue, such as:
     - **`EACCES`**: Insufficient permissions to bind to the specified port.
     - **`EADDRINUSE`**: The port is already in use.
   - The `errorHandler` function processes the error, logs an appropriate message, and exits the process if necessary.

2. **`server.on('listening', () => { ... })`**:
   - This attaches a callback function to the `listening` event of the server.
   - The `listening` event is triggered when the server successfully starts and begins listening for incoming connections.
   - The callback retrieves the server's address using `server.address()` and logs a message indicating that the server is running. It specifies whether the server is bound to a named pipe or a port.

#### What `server.on` Does 🛠️
The `server.on` method listens for specific events emitted by the `http.Server` instance. When the specified event occurs, the attached callback function is executed. This allows you to handle server behavior dynamically and respond to different situations during the server's lifecycle.

#### Why Use `server.on` 🤔
Using `server.on` provides a clean, event-driven way to manage server behavior. It allows you to:
- Handle errors gracefully without crashing the application.
- Log important information when the server starts successfully.
- Extend the server's functionality by responding to other events (e.g., `connection`, `close`, etc.).

---

### Server Lifecycle 🔄

The lifecycle of a server in Node.js, particularly when using the `http` module, involves several stages from creation to termination. Each stage is associated with specific events that can be handled using event listeners like `server.on`. Here's a detailed explanation of the server's lifecycle:

#### 1. Server Creation 🛠️
   - The server is created using `http.createServer(app)`, where `app` is typically an Express application or a custom request handler function.
   - At this stage, the server is initialized but not yet listening for incoming connections.

   ```javascript
   const server = http.createServer(app);
   ```

#### 2. Server Configuration ⚙️
   - Before starting the server, you can configure it by setting properties or attaching event listeners.
   - For example, you might set the port using `app.set('port', PORT)` or attach listeners for events like `error` and `listening`.

   ```javascript
   server.on('error', errorHandler);
   server.on('listening', () => {
     console.log('Server is ready');
   });
   ```

#### 3. Server Listening 🎧
   - The server starts listening for incoming connections when `server.listen(PORT)` is called.
   - This triggers the `listening` event, indicating that the server is ready to accept requests.

   ```javascript
   server.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

   **Key Event:**
   - **`listening`**: Emitted when the server starts successfully. You can log a message or perform additional setup here.

#### 4. Handling Incoming Requests 📥
   - Once the server is listening, it begins handling incoming HTTP requests.
   - The request is passed to the handler function (e.g., the Express `app`), which processes it and sends a response.

   ```javascript
   app.get('/', (req, res) => {
     res.send('Hello, World!');
   });
   ```

#### 5. Error Handling ⚠️
   - During its lifecycle, the server may encounter errors, such as:
     - **`EACCES`**: Insufficient permissions to bind to the specified port.
     - **`EADDRINUSE`**: The port is already in use.
   - These errors trigger the `error` event, which can be handled to log messages or take corrective actions.

   ```javascript
   server.on('error', error => {
     if (error.code === 'EADDRINUSE') {
       console.error('Port is already in use');
     }
   });
   ```

#### 6. Server Shutdown 🛑
   - The server can be stopped gracefully using `server.close()`, which stops accepting new connections and waits for existing connections to finish.
   - This triggers the `close` event, allowing you to perform cleanup tasks.

   ```javascript
   server.close(() => {
     console.log('Server has been shut down');
   });
   ```

   **Key Event:**
   - **`close`**: Emitted when the server is fully shut down.

#### 7. Connection Lifecycle 🔗
   - Each incoming connection has its own lifecycle, which includes:
     - Establishing the connection.
     - Receiving the request.
     - Sending the response.
     - Closing the connection.
   - You can listen for connection-specific events using `server.on('connection', callback)`.

   ```javascript
   server.on('connection', socket => {
     console.log('New connection established');
   });
   ```

#### 8. Server Termination 🚪
   - The server process can terminate due to external signals (e.g., `SIGINT` for Ctrl+C) or internal errors.
   - You can handle termination signals to perform cleanup before the process exits.

   ```javascript
   process.on('SIGINT', () => {
     server.close(() => {
       console.log('Server terminated');
       process.exit(0);
     });
   });
   ```

---

## How to Run 🏃‍♂️

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and specify the port (optional):
   ```env
   PORT=8080
   ```

3. Start the `typeOne` server:
   ```bash
   node typeOne/index.js
   ```

4. Access the server:
   - Root route: [http://localhost:PORT/](http://localhost:PORT/)
   - About route: [http://localhost:PORT/about](http://localhost:PORT/about)

---

## Additional Notes 📝

- The `typeTwo` server follows a similar structure but may have different configurations or features.
- Ensure that the `colors` and `dotenv` libraries are installed for proper functionality.

---

## License 📜

This project is for educational purposes and does not include a specific license.