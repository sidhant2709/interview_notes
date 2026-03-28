# ⚙️ libuv

**libuv** is a multi-platform support library used by Node.js to handle asynchronous I/O operations efficiently.

## ✨ Key Features

- ⚡ Provides **event-driven, non-blocking I/O**.
- 🔄 Manages the **Event Loop** and **Thread Pool**.
- 📂 Handles various asynchronous operations in Node.js.

## 📖 Overview

libuv plays a crucial role in enabling Node.js to perform high-performance, asynchronous tasks by abstracting platform-specific details and providing a unified API for developers.

---

## ❓ Why is libuv Important in Node.js?

Node.js is single-threaded, meaning it cannot handle multiple CPU-intensive tasks in parallel. However, many operations like file I/O, networking, and database queries are time-consuming. To prevent blocking the main thread, Node.js offloads these operations to libuv, which uses:

- 🔄 **Event Loop** – Handles non-blocking asynchronous tasks.
- 🧵 **Thread Pool** – Offloads CPU-intensive operations to worker threads.
- 📡 **Async I/O Handling** – Manages file system, network, and DNS operations asynchronously.

---

## 🌟 Core Features of libuv

### ✅ 1. Event Loop (Main Component of Node.js)
The Event Loop in libuv continuously listens for I/O events and executes callbacks when tasks complete.
This enables **non-blocking, asynchronous processing**.

### ✅ 2. Thread Pool (For Blocking Operations)
Since Node.js is single-threaded, libuv uses a thread pool (default: 4 worker threads) to handle expensive operations like:

- 📂 File system operations (`fs.readFile`, `fs.writeFile`)
- 🔒 Cryptographic functions (`crypto.pbkdf2`, `bcrypt`)
- 🗜️ Compression (`zlib`)
- 🌐 DNS resolution (`dns.lookup`)

### ✅ 3. Non-Blocking I/O
libuv manages non-blocking operations such as:

- 🌐 Network requests (`http`, `https`, `net`)
- ⏱️ Timers (`setTimeout`, `setInterval`)
- 👶 Child processes (`child_process` module)

### ✅ 4. Cross-Platform Support
libuv works on **Windows**, **Linux**, **macOS**, and other operating systems.

---

## 🔄 How libuv Works with the Event Loop

The Event Loop in libuv has six phases, where each phase processes a specific type of operation:

| **Phase**               | **Description**                                                                 |
|-------------------------|---------------------------------------------------------------------------------|
| ⏱️ **Timers Phase**      | Executes `setTimeout` and `setInterval` callbacks.                              |
| 🔄 **Pending Callbacks** | Handles I/O callbacks from previous operations.                                |
| ⚙️ **Idle/Prepare**      | Internal libuv tasks.                                                          |
| 📡 **Poll Phase**        | Waits for new I/O events (e.g., network, filesystem).                           |
| 🚀 **Check Phase**       | Executes `setImmediate` callbacks.                                             |
| ❌ **Close Callbacks**   | Handles closed connections.                                                    |

---

## 📂 Example: How libuv Handles File I/O Asynchronously

Let’s see how libuv manages file reading without blocking the main thread.

### ⛔ Blocking (Synchronous) File Read

```javascript
const fs = require('fs');

console.log('Start');
const data = fs.readFileSync('file.txt', 'utf8'); // Blocking operation
console.log(data);
console.log('End');
```

**Problem:** The entire program pauses until the file is read.

---

### ✅ Non-Blocking (Asynchronous) File Read with libuv

```javascript
const fs = require('fs');

console.log('Start');

fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});

console.log('End');
```

### 🔍 How libuv Handles This:

1. `fs.readFile` sends an I/O request to libuv.
2. libuv offloads the task to its **Thread Pool**.
3. The main thread continues execution (`console.log('End')` runs immediately).
4. Once the file is read, libuv's **Event Loop** executes the callback.

**🔹 Output Order:**

```plaintext
Start
End
(file contents)  <-- Printed later when libuv completes reading the file
```

---

## 🧵 When Does libuv Use the Thread Pool?

| **Operation**                     | **Handled By**       |
|------------------------------------|----------------------|
| `setTimeout`, `setImmediate`       | Event Loop           |
| HTTP Requests                      | Event Loop           |
| File System (`fs.readFile`, `fs.writeFile`) | Thread Pool         |
| Cryptography (`crypto.pbkdf2`, `bcrypt`)   | Thread Pool         |
| DNS Lookups (`dns.lookup`)         | Thread Pool          |
| Compression (`zlib`)               | Thread Pool          |

---

## 🗝️ Key Takeaways

- libuv powers Node.js’s **Event Loop**, making it possible to handle multiple requests efficiently.
- It provides **non-blocking I/O operations**, ensuring that the main thread isn’t blocked.
- It uses a **Thread Pool** for CPU-intensive tasks like file I/O, cryptography, and compression.
- libuv is a **cross-platform library**, making Node.js work on Windows, Linux, and macOS.