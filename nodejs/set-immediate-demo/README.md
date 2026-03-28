# 📨 Message Saver API (Express + Async/Await + Middleware + Swagger)

An Express.js service that demonstrates the use of `setImmediate`, `process.nextTick`, and `setTimeout` in Node.js. It supports message saving with optional fallback from a file, request validation, and full Swagger/OpenAPI documentation.

---

## 💡 Node.js Internals Used

### 1. `process.nextTick`

- **What is it?**
  `process.nextTick` schedules a callback to be executed on the next event loop iteration, before any I/O events (e.g., timers or network requests). It’s useful when you want to run code after the current operation completes but before the event loop continues.
- **Real-Life Analogy:**
  Think of it like a to-do list. You finish your current task (e.g., cooking), but before you check your phone messages (e.g., I/O), you decide to quickly add a new task to the list (e.g., prepare ingredients). This task must be completed before anything else.

```javascript
process.nextTick(() => {
  console.log('Executed nextTick callback');
});
```

### 2. `setImmediate`

- **What is it?**
  `setImmediate` schedules a callback to be executed in the next iteration of the event loop, specifically after I/O events like timers and network operations.
- **Real-Life Analogy:**
  Imagine you’re working on a report (processing data), but before continuing, you need to check your email (I/O task). Once that’s done, you can get back to work. `setImmediate` helps with scheduling the next task after completing I/O.

```javascript
setImmediate(() => {
  console.log('Executed setImmediate callback');
});
```

### 3. `setTimeout`

- **What is it?**
  `setTimeout` schedules a callback to be executed after a specified delay. It’s primarily used for deferred execution of a function after a certain period.
- **Real-Life Analogy:**
  It’s like setting a timer to take a break after working for 30 minutes. You don’t stop working immediately but take a break after a set time.

```javascript
setTimeout(() => {
  console.log('Executed setTimeout callback after 1 second');
}, 1000);
```

## 📦 Features

- ✅ Express REST API with async/await
- 🧼 Request validation middleware
- 💾 Optional fallback message (from file) using `?useFallback=true`
- 🧪 `setImmediate`, `nextTick`, `setTimeout` usage
- 📚 Swagger/OpenAPI for API docs
- 🎯 ESLint + Prettier formatting
- 🧪 Unit test for DB save

---

## 🚀 Getting Started

### 📁 Folder Structure

```
project-root/
│
├── src/
│   ├── db.js                  # DB logic (fake async save)
│   ├── routes.js              # Express route with fallback + validation
│   ├── middleware/
│   │   └── validateMessage.js # Request validation logic
│   └── server.js              # Entry point
│
├── data/
│   └── sample.txt             # Fallback message content
│
├── tests/
│   └── db.test.js             # Unit test for db.save()
│
├── swagger/
│   └── swagger.yaml           # OpenAPI docs
│
├── .eslintrc.json             # ESLint config
├── .prettierrc                # Prettier config
├── package.json
└── README.md
```

---

## 🔧 Installation

```bash
git clone <repo-url>
cd project-root
npm install
```

---

## ▶️ Running the Server

```bash
npm run dev
# or
node src/server.js
```

---

## 🧪 API Usage

### ✅ 1. Valid Message

```bash
curl -X POST http://localhost:3000/api/save   -H "Content-Type: application/json"   -d '{"message": "Valid message!"}'
```

✅ **Expected:** `200 OK`

---

### ❌ 2. Invalid: Not a String

```bash
curl -X POST http://localhost:3000/api/save   -H "Content-Type: application/json"   -d '{"message": 123}'
```

❌ **Expected:** `400 Bad Request` → `"Message must be a string."`

---

### ❌ 3. Invalid: Empty String

```bash
curl -X POST http://localhost:3000/api/save   -H "Content-Type: application/json"   -d '{"message": ""}'
```

❌ **Expected:** `400 Bad Request` → `"Message cannot be empty."`

---

### ❌ 4. Invalid: Message Too Long (Postman Body)

```json
{
  "message": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
}
```

❌ **Expected:** `400 Bad Request` → `"Message must be less than 256 characters."`

---

### ✅ 5. Missing Message with Fallback

```bash
curl -X POST "http://localhost:3000/api/save?useFallback=true"   -H "Content-Type: application/json"   -d '{}'
```

✅ **Expected:** `200 OK`, uses first 30 chars from `data/sample.txt`

---

### ❌ 6. Missing Message Without Fallback

```bash
curl -X POST "http://localhost:3000/api/save"   -H "Content-Type: application/json"   -d '{}'
```

❌ **Expected:** `400 Bad Request` → `"Message cannot be empty."`

---

## 📚 Swagger Docs

After starting the server, visit:

```
http://localhost:3000/api-docs
```

---

## 🧪 Run Tests

```bash
npm run test
```

---

## 🧼 Formatting

```bash
npm run lint
npm run format
```

---
