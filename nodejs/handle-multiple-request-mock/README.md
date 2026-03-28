
# 🧠 Node.js Async/Await Example: Handling Simultaneous HTTP Requests

This project demonstrates how **Node.js handles multiple simultaneous HTTP requests** using **non-blocking asynchronous operations** with `async/await`.

## 🚀 Project Overview

This is a basic Express server with a single endpoint:

```bash
GET /user/:id
```

When this endpoint is hit, it simulates a database query that takes 2 seconds and then returns a mock user object.

---

## 📁 File Structure

```
.
├── index.js         # Main server file
└── README.md        # This file
```

---

## 📦 Technologies Used

- **Node.js** – JavaScript runtime with an event-driven, non-blocking architecture.
- **Express** – Web framework for Node.js.
- **async/await** – Modern syntax for handling asynchronous operations.
- **Promises** – Used to simulate asynchronous database calls.

---

## 🔍 Concepts Explained

### 1. Event Loop

Node.js runs on a **single-threaded event loop**. This loop listens for incoming events (like HTTP requests) and delegates time-consuming operations (like DB queries or file I/O) to background threads (via `libuv`).

### 2. Non-blocking I/O

Rather than waiting for I/O operations to complete, Node.js **delegates** them and continues processing other events. This allows the server to handle thousands of simultaneous connections efficiently.

### 3. async/await

Instead of using callbacks, we use the `async/await` syntax to write asynchronous code in a more synchronous and readable fashion.

Example:

```js
app.get('/user/:id', async (req, res) => {
  const user = await getUserFromDatabase(req.params.id);
  res.send(user);
});
```

### 4. Simulated Database Query

We simulate a DB call using `setTimeout` inside a Promise to mimic a delay:

```js
function getUserFromDatabase(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: \`User\${id}\` });
    }, 2000);
  });
}
```

This simulates a **non-blocking** operation that returns data after a delay.

---

## 📈 How Node.js Handles Simultaneous Requests

When two requests hit the server at the same time:

- The first call to `getUserFromDatabase` starts and is offloaded.
- The second request is immediately accepted, and its `getUserFromDatabase` is also offloaded.
- Both operations run in parallel in the background (via `libuv`'s thread pool).
- The event loop remains free to accept more requests.
- Once each Promise resolves, the corresponding response is sent back.

---

## 🧪 How to Test

1. Run the server:

```bash
node index.js
```

2. Send multiple requests using a browser or tools like Postman or curl:

```bash
curl http://localhost:3000/user/1
curl http://localhost:3000/user/2
```

3. Observe in the terminal that both user fetches start at nearly the same time and finish independently.

---

## ✅ Summary

- Node.js can handle multiple HTTP requests at once **without multiple threads**.
- This is possible because of its **event loop** and **non-blocking I/O** model.
- Using `async/await` makes it easier to write and understand asynchronous code.

---

Happy coding! 🎉
