# Node.js Interview Preparation Guide

### For Senior Full-Stack Developers (5 Years Experience)

> Tech Stack: React | Node.js | Python | AWS Lambda

-----

## 📋 Table of Contents

1. [Core Node.js Concepts](#1-core-nodejs-concepts)
1. [Event Loop & Asynchronous Programming](#2-event-loop--asynchronous-programming)
1. [Streams & Buffers](#3-streams--buffers)
1. [Modules & CommonJS vs ESM](#4-modules--commonjs-vs-esm)
1. [Error Handling Patterns](#5-error-handling-patterns)
1. [Express.js & Middleware](#6-expressjs--middleware)
1. [Authentication & Security](#7-authentication--security)
1. [Database Patterns (SQL & NoSQL)](#8-database-patterns)
1. [Caching Strategies](#9-caching-strategies)
1. [Message Queues & Event-Driven Architecture](#10-message-queues--event-driven-architecture)
1. [Performance & Clustering](#11-performance--clustering)
1. [Testing in Node.js](#12-testing-in-nodejs)
1. [Gen AI Integration in Node.js](#13-gen-ai-integration-in-nodejs)
1. [System Design Questions for Node.js](#14-system-design-questions-for-nodejs)
1. [High-Level / Advanced Concepts](#15-high-level--advanced-concepts)
1. [🧠 Deep-Dive Prompts for Claude](#16-deep-dive-prompts-for-claude)

-----

## 1. Core Node.js Concepts

### What is Node.js?

**What:** A runtime environment that executes JavaScript outside the browser using Chrome’s V8 engine.
**Why:** Enables JavaScript on the server side; non-blocking I/O makes it ideal for I/O-heavy apps.
**Purpose:** Build scalable network applications, REST APIs, real-time systems.

### Single-Threaded Non-Blocking Model

```javascript
// ❌ BAD - Blocking (CPU-intensive, freezes the event loop)
const crypto = require('crypto');

function blockingHash(data) {
  // This blocks the entire thread while hashing
  // No other request can be processed during this time
  return crypto.createHash('sha256').update(data).digest('hex');
}

// ✅ GOOD - Non-blocking using worker threads for CPU tasks
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// Main thread - offloads CPU work
function hashAsync(data) {
  return new Promise((resolve, reject) => {
    // Creates a new thread for CPU-heavy work
    // This frees the event loop for other requests
    const worker = new Worker(__filename, {
      workerData: { data } // Pass data to worker thread
    });

    worker.on('message', resolve);  // Worker sends result back
    worker.on('error', reject);     // Handle worker errors
  });
}

// Worker thread code (same file, different context)
if (!isMainThread) {
  const { data } = workerData;
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  parentPort.postMessage(hash); // Send result to main thread
}
```

**Line-by-line explanation:**

**What this code does:** Demonstrates the difference between blocking (CPU-intensive synchronous code) and non-blocking (worker-thread-based) approaches for CPU-heavy operations in Node.js.

**Why this matters:** Node.js runs on a single thread. Any CPU-intensive operation (like hashing, image resizing, encryption) blocks that thread, meaning all other incoming HTTP requests are frozen until the operation completes.

**How it works:** Worker threads create separate OS-level threads that run in parallel with the main thread. The main thread delegates heavy work to a worker and gets back a result via message passing.

| Line | Explanation |
|------|-------------|
| `const crypto = require('crypto')` | Imports Node's built-in crypto module for hashing. This line is synchronous — it loads the module into memory once and caches it. |
| `crypto.createHash('sha256').update(data).digest('hex')` | Synchronously computes a SHA-256 hash. `.createHash` creates a hash object; `.update(data)` feeds data into the algorithm; `.digest('hex')` finalises and returns the result as a hex string. The entire operation runs on the main thread, blocking everything else. |
| `const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')` | Destructures four key exports from the `worker_threads` module: `Worker` (class to spawn threads), `isMainThread` (boolean telling whether current context is primary), `parentPort` (communication channel back to main thread), `workerData` (read-only data passed in from the spawner). |
| `new Worker(__filename, { workerData: { data } })` | `__filename` is the path of the current script — the worker re-runs the same file but in a separate thread context. `workerData` is the payload sent to the worker; it is cloned (not shared) for thread safety. |
| `worker.on('message', resolve)` | Registers a listener: when the worker calls `parentPort.postMessage(hash)`, the `'message'` event fires here and the promise resolves with the hash value. |
| `worker.on('error', reject)` | If the worker thread throws an unhandled error, the promise rejects — ensuring the caller can `try/catch` the failure. |
| `if (!isMainThread)` | This guard ensures the worker-specific code only runs inside the worker thread context, not on the initial main-thread load of the file. |
| `parentPort.postMessage(hash)` | Sends the computed hash from the worker thread back to the main thread via the message channel. This is the non-blocking return path. |

**Purpose:** Use worker threads for any CPU-bound task (hashing, compression, parsing large JSON, image processing) so the event loop remains free to handle other requests.

-----

## 2. Event Loop & Asynchronous Programming

### What is the Event Loop?

**What:** A mechanism that allows Node.js to perform non-blocking operations despite being single-threaded.
**Why:** Node offloads I/O to the OS kernel, which notifies Node when done. The event loop picks up callbacks.
**Purpose:** Process many concurrent connections without creating a thread per connection.

### Event Loop Phases (in order)

```
timers → pending callbacks → idle/prepare → poll → check → close callbacks
```

```javascript
// Demonstrates event loop phase ordering
console.log('1 - Synchronous (main thread)');

// setTimeout goes to "timers" phase (runs after minimum delay)
setTimeout(() => console.log('2 - setTimeout (timers phase)'), 0);

// setImmediate goes to "check" phase (runs after I/O)
setImmediate(() => console.log('3 - setImmediate (check phase)'));

// Promise.then goes to microtask queue (runs between phases)
Promise.resolve().then(() => console.log('4 - Promise microtask'));

// process.nextTick runs BEFORE any other async callback
// It drains the nextTick queue completely before moving to next phase
process.nextTick(() => console.log('5 - nextTick (highest priority async)'));

console.log('6 - Synchronous (main thread end)');

// Output order: 1, 6, 5, 4, 2, 3
// Explanation:
// 1 & 6 = synchronous, runs first
// 5 = nextTick queue, processed before any I/O or timer callbacks
// 4 = microtask (Promise), processed after nextTick, before timers
// 2 = timers phase
// 3 = check phase (after timers)
```

**What this code does:** Illustrates the precise execution order of different async scheduling mechanisms in Node.js.

**Why this matters:** Misunderstanding execution order causes subtle bugs — e.g., assuming a `setTimeout(fn, 0)` runs before a resolved Promise is a common mistake. Interviewers test this directly.

**How it works:** Node.js processes tasks in a strict priority order after the synchronous call stack drains:
1. **Synchronous code** runs first (the main call stack).
2. **`process.nextTick` queue** drains completely before anything else — even before Promises.
3. **Microtask queue** (resolved Promises / `queueMicrotask`) drains next.
4. **Timers phase** — `setTimeout` / `setInterval` callbacks whose delays have expired.
5. **Check phase** — `setImmediate` callbacks run here, after I/O polling.

| Line | Explanation |
|------|-------------|
| `console.log('1 - Synchronous')` | Runs immediately on the call stack. Nothing async yet. |
| `setTimeout(() => ..., 0)` | Schedules the callback in the **timers** phase. Even with `0` ms delay, it cannot run until the call stack is empty and all microtasks are drained. |
| `setImmediate(() => ...)` | Schedules the callback in the **check** phase of the event loop — which comes *after* the timers phase in most contexts outside an I/O callback. |
| `Promise.resolve().then(...)` | Queues the `.then` callback into the **microtask queue**. It runs after `nextTick` callbacks but before timers and I/O. |
| `process.nextTick(...)` | Queues the callback into the **nextTick queue** — the highest-priority async queue. It runs before Promises, timers, and I/O events. |
| `console.log('6 - Synchronous end')` | Still synchronous — runs before any async callback. |

**Purpose:** Understand this order to correctly reason about race conditions, DB/cache reads being stale, and when to use `process.nextTick` vs `Promise.resolve()` for deferral.

### Async/Await - Production Patterns

```javascript
// ✅ Production-grade async pattern with proper error handling
class UserService {
  constructor(db, cache, emailService) {
    this.db = db;           // Database connection
    this.cache = cache;     // Redis client
    this.emailService = emailService;
  }

  async createUser(userData) {
    // Step 1: Validate input (synchronous, fast)
    this.#validateUserData(userData);

    // Step 2: Check if user exists (async DB call)
    const existing = await this.db.users.findOne({ email: userData.email });
    if (existing) {
      throw new ConflictError('User with this email already exists');
    }

    // Step 3: Hash password (CPU work - but bcrypt is already async)
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    // 12 = cost factor; higher = slower hash but more secure

    // Step 4: Run independent operations in PARALLEL (saves time)
    // Promise.all runs all promises simultaneously
    const [user, _] = await Promise.all([
      this.db.users.create({          // Create user in DB
        ...userData,
        password: hashedPassword,
        createdAt: new Date()
      }),
      this.cache.del(`users:${userData.email}`) // Invalidate any cached data
    ]);

    // Step 5: Send welcome email (fire-and-forget, don't await)
    // We don't block the response waiting for email
    this.emailService.sendWelcome(user.email).catch(err => {
      // Log but don't fail the request if email fails
      logger.error('Failed to send welcome email', { userId: user.id, err });
    });

    return user;
  }

  #validateUserData(data) { // Private method (ES2022 # syntax)
    if (!data.email || !data.password) {
      throw new ValidationError('Email and password are required');
    }
  }
}
```

**What this code does:** Shows a production-grade `UserService.createUser` method with proper sequencing of synchronous validation, async DB calls, parallel operations, and fire-and-forget side effects.

**Why this matters:** Naively writing `await` on every line serialises work unnecessarily, slowing responses. This pattern combines correctness, performance, and resilience.

**How it works:**

| Line / Block | Explanation |
|---|---|
| `constructor(db, cache, emailService)` | Dependency injection — each dependency is passed in rather than instantiated inside the class. This makes the class testable (you can mock `db`, `cache`, and `emailService`). |
| `this.#validateUserData(userData)` | Synchronous validation runs first — cheapest operation, fail early before hitting the database. The `#` prefix denotes a private class field (ES2022), inaccessible outside the class. |
| `await this.db.users.findOne({ email: userData.email })` | Async DB lookup to enforce uniqueness at the application layer (in addition to DB constraints). `await` pauses only this async function — the event loop continues serving other requests. |
| `if (existing) throw new ConflictError(...)` | Throw a typed error so the global error handler can return HTTP 409 with a meaningful message. |
| `await bcrypt.hash(userData.password, 12)` | `bcrypt.hash` is deliberately async — the 12 rounds of hashing happen inside libuv's thread pool, so it doesn't block the event loop even though it's CPU-intensive. |
| `const [user, _] = await Promise.all([...])` | **Parallel execution** — DB insert and cache invalidation are independent, so they run simultaneously. `Promise.all` waits for both; if either fails it rejects the whole operation. This saves latency vs sequential `await`. |
| `this.emailService.sendWelcome(...).catch(...)` | **Fire-and-forget**: the response is sent immediately without waiting for email delivery. `.catch` prevents an unhandled promise rejection if the email service fails. Failures are logged but do not block the user creation. |
| `#validateUserData(data)` | Private helper method; encapsulates validation logic. Throwing `ValidationError` here will be caught by `try/catch` in the route handler. |

**Purpose:** A template for service-layer async methods — validate early, parallelise independent work, use fire-and-forget for non-critical side effects, and always handle errors.

### Promise.allSettled vs Promise.all

```javascript
// Promise.all - FAILS FAST (rejects if ANY promise rejects)
try {
  const [users, orders, products] = await Promise.all([
    fetchUsers(),    // If this fails...
    fetchOrders(),   // ...this is cancelled too
    fetchProducts()  // ...and this
  ]);
} catch (err) {
  // One failure = all fail
}

// Promise.allSettled - ALWAYS RESOLVES (collects all results/errors)
const results = await Promise.allSettled([
  fetchUsers(),
  fetchOrders(),
  fetchProducts()
]);

results.forEach(result => {
  if (result.status === 'fulfilled') {
    console.log('Success:', result.value);  // Got data
  } else {
    console.error('Failed:', result.reason); // Got error, but others still ran
  }
});

// USE CASE: Dashboard loading multiple independent widgets
// You want ALL to attempt, show what succeeded, gracefully handle failures
```

**What this code does:** Compares `Promise.all` (fail-fast) with `Promise.allSettled` (always resolves with each outcome).

**Why this matters:** Choosing the wrong combinator can either mask failures silently or make an entire page fail because one non-critical widget errored.

**How it works:**

| Construct | Behaviour |
|---|---|
| `Promise.all([...])` | Rejects immediately when the **first** promise rejects. The other promises keep running (not cancelled), but their results are discarded. |
| `try { ... } catch (err)` | Catches the first rejection. You have no visibility into which of the three failed or what the others returned. |
| `Promise.allSettled([...])` | **Always** resolves (never rejects) after all promises finish. Each result has `status: 'fulfilled'` or `status: 'rejected'`. |
| `result.status === 'fulfilled'` | Check whether this particular promise succeeded. `result.value` holds the data. |
| `result.reason` | If the promise rejected, `result.reason` is the error (equivalent to what `catch(err)` would receive). |

**Purpose:**
- Use `Promise.all` when all results are required and failure of one means the whole operation should fail (e.g., multi-step transaction).
- Use `Promise.allSettled` when each item is independent and you want partial results (e.g., dashboard widgets, batch notifications).

### What are Streams?

**What:** Objects that let you read/write data piece by piece (chunks) instead of all at once.
**Why:** Processing large files (logs, videos, CSVs) without loading them entirely into memory.
**Purpose:** Memory efficiency and performance for data pipelines.

### Real-World: Processing Large CSV Upload

```javascript
const fs = require('fs');
const csv = require('csv-parser');        // Parse CSV rows
const { Transform } = require('stream'); // Custom transform stream
const { pipeline } = require('stream/promises'); // Promise-based pipeline

// Transform stream: validates and transforms each CSV row
class UserTransform extends Transform {
  constructor() {
    super({ objectMode: true }); // objectMode: work with objects, not raw bytes
    this.processedCount = 0;
    this.errors = [];
  }

  // _transform is called for EACH chunk/row passing through
  _transform(row, encoding, callback) {
    try {
      // Validate each row
      if (!row.email || !row.name) {
        this.errors.push({ row, error: 'Missing required fields' });
        callback(); // Skip this row, don't push to next stream
        return;
      }

      this.processedCount++;

      // Transform: normalize the data
      const transformed = {
        email: row.email.toLowerCase().trim(),
        name: row.name.trim(),
        importedAt: new Date().toISOString()
      };

      // Push to next stream in pipeline
      this.push(transformed);
      callback(); // Signal: ready for next chunk
    } catch (err) {
      callback(err); // Signal: error occurred, abort pipeline
    }
  }

  // _flush: called when all data has been processed
  _flush(callback) {
    console.log(`Processed: ${this.processedCount}, Errors: ${this.errors.length}`);
    callback();
  }
}

// Writable stream: batches DB inserts for efficiency
class DatabaseWriteStream extends Writable {
  constructor(db) {
    super({ objectMode: true });
    this.db = db;
    this.batch = [];
    this.BATCH_SIZE = 100; // Insert 100 records at a time
  }

  async _write(record, encoding, callback) {
    this.batch.push(record);

    // When batch is full, insert to DB
    if (this.batch.length >= this.BATCH_SIZE) {
      try {
        await this.db.users.insertMany(this.batch);
        this.batch = []; // Clear the batch
        callback();
      } catch (err) {
        callback(err);
      }
    } else {
      callback(); // Batch not full yet, continue
    }
  }

  // Don't forget remaining records that didn't fill a batch
  async _final(callback) {
    if (this.batch.length > 0) {
      await this.db.users.insertMany(this.batch);
    }
    callback();
  }
}

// USAGE: Pipe them together
async function processCSVUpload(filePath, db) {
  const transformer = new UserTransform();
  const dbWriter = new DatabaseWriteStream(db);

  // pipeline() = like .pipe() but handles errors and cleanup properly
  await pipeline(
    fs.createReadStream(filePath),  // Read file in chunks (not all at once!)
    csv(),                           // Parse chunks into row objects
    transformer,                     // Validate & transform rows
    dbWriter                         // Write to database in batches
  );

  return { processed: transformer.processedCount, errors: transformer.errors };
}
```

**What this code does:** Builds a memory-efficient pipeline to read a large CSV file from disk, validate and transform every row, and insert records into a database in batches — without ever loading the entire file into memory.

**Why this matters:** Loading a 500 MB CSV with `fs.readFileSync` or `readFile` would exhaust Node's heap. Streams process data in small chunks (by default 16 KB), keeping memory usage constant regardless of file size.

**How it works:** Four stream stages are wired together in a pipeline:

```
ReadStream → csv-parser → UserTransform → DatabaseWriteStream
(raw bytes)  (row objects) (validated objs)  (DB inserts)
```

| Line / Block | Explanation |
|---|---|
| `const { Transform } = require('stream')` | Imports the `Transform` base class — used to create a stream that reads input and produces transformed output. It's both Readable and Writable. |
| `super({ objectMode: true })` | `objectMode: true` tells the stream to work with JavaScript objects (rows), not raw `Buffer`/string chunks. Required when you want to pass structured data between stream stages. |
| `_transform(row, encoding, callback)` | This method is called **once per chunk** (one CSV row). It receives the row, must process it, optionally call `this.push(result)` to pass data downstream, and always call `callback()` to signal readiness for the next chunk. |
| `callback()` without `this.push(...)` | Skips the row (invalid row) — nothing is passed downstream, but processing continues. |
| `this.push(transformed)` then `callback()` | Passes the normalised object to the next stream stage (the DB writer) and signals readiness for the next chunk. |
| `callback(err)` | Signals an error — the pipeline will be aborted and the error propagated to `pipeline()`'s rejection. |
| `_flush(callback)` | Called once after the last chunk — useful for summary logging, flushing buffers, or sending final stats. |
| `this.BATCH_SIZE = 100` | Accumulates 100 records before doing a single `insertMany` — drastically reduces DB round-trips vs inserting one at a time. |
| `_write(record, encoding, callback)` | Called for each object received from upstream. Pushes to `this.batch`; when the batch is full, it inserts and clears it. |
| `_final(callback)` | Equivalent to `_flush` for Writable streams — ensures any partial batch (< 100 records) at the end of the file is also inserted. |
| `pipeline(...)` from `stream/promises` | Wires all streams together. Unlike manual `.pipe()`, `pipeline` correctly propagates errors and destroys all streams on failure, preventing memory leaks. |
| `fs.createReadStream(filePath)` | Opens the file and emits it as a stream of `Buffer` chunks — file is never fully loaded into memory. |

**Purpose:** The canonical Node.js pattern for processing large files (uploads, ETL jobs, log analysis) without memory exhaustion. The `pipeline` utility is preferred over `.pipe()` in all production code.

### CommonJS (CJS) vs ES Modules (ESM)

```javascript
// ===== CommonJS (traditional Node.js) =====
// File: utils.cjs

const path = require('path');         // Synchronous, cached after first load
const { readFile } = require('fs');   // Destructure from CJS module

// module.exports = what other files receive when they require() this
module.exports = {
  formatPath: (p) => path.resolve(p),
  readConfig: async (file) => {
    const data = await readFile(file, 'utf8');
    return JSON.parse(data);
  }
};

// Usage:
const { formatPath } = require('./utils.cjs');

// ===== ES Modules (modern Node.js, requires "type": "module" in package.json) =====
// File: utils.mjs (or utils.js with "type": "module")

import path from 'path';             // Static, analyzed at parse time
import { readFile } from 'fs/promises'; // Named import

export function formatPath(p) {
  return path.resolve(p);
}

export async function readConfig(file) {
  const data = await readFile(file, 'utf8');
  return JSON.parse(data);
}

// Usage:
import { formatPath } from './utils.mjs';
```

**What this code does:** Shows both the CommonJS (CJS) and ES Module (ESM) syntax for exporting and importing code in Node.js.

**Why this matters:** Node.js supports two module systems, and they are **not interchangeable** without bridging code. Understanding the difference matters for library authoring, build tooling, and debugging `require is not defined` or `Cannot use import statement` errors.

**How it works:**

**CommonJS (CJS) lines:**

| Line | Explanation |
|---|---|
| `const path = require('path')` | **Synchronous** module load — Node immediately executes the module file (or returns a cached copy) before moving to the next line. Safe inside conditional blocks. |
| `const { readFile } = require('fs')` | Destructures a named export from the `fs` module. In CJS, `require()` returns the `module.exports` object; you can destructure it freely. |
| `module.exports = { ... }` | The `module.exports` object is what callers receive from `require('./utils.cjs')`. Anything not on this object is private to the module. |
| `const { formatPath } = require('./utils.cjs')` | Dynamic import — `require` can be called anywhere, including inside functions or conditionals, allowing lazy loading. |

**ES Modules (ESM) lines:**

| Line | Explanation |
|---|---|
| `import path from 'path'` | **Static** import — analysed at **parse time** before any code runs. Cannot be inside an `if` block. Enables tree-shaking by bundlers. |
| `import { readFile } from 'fs/promises'` | Named import from the promise-based `fs` sub-path. ESM supports `fs/promises` directly; in CJS you'd write `require('fs').promises`. |
| `export function formatPath(p) { ... }` | Named export — can have multiple per file. Bundlers use this to eliminate unused exports (tree-shaking). |
| `export async function readConfig(file) { ... }` | Exporting an async function; callers must `await` the result. |
| `import { formatPath } from './utils.mjs'` | Named import — static, resolved at parse time. The `.mjs` extension must be explicit; when using `.js` files, extension may be omitted if `"type": "module"` is set in `package.json`, but explicit extensions are always recommended for clarity. |

**Purpose:** Use CJS for legacy Node.js code, existing npm packages, and `require()`-based tooling. Prefer ESM for new projects to benefit from tree-shaking, top-level `await`, and better static analysis.

|Feature        |CommonJS                      |ESM                    |
|---------------|------------------------------|-----------------------|
|Syntax         |`require()` / `module.exports`|`import` / `export`    |
|Loading        |Synchronous                   |Asynchronous           |
|Tree-shaking   |❌ No                          |✅ Yes                  |
|Top-level await|❌ No                          |✅ Yes                  |
|`__dirname`    |✅ Available                   |❌ Use `import.meta.url`|
|Default in Node|✅ Yes                         |Needs config           |

-----

## 5. Error Handling Patterns

### What is proper error handling?

**What:** Categorizing, catching, and responding to errors in a structured way.
**Why:** Unhandled errors crash Node.js; poor errors leak stack traces to clients (security risk).
**Purpose:** Graceful degradation, proper HTTP status codes, debugging.

```javascript
// Custom error hierarchy - production pattern
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational; // Operational = expected errors (404, 401)
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor); // Cleaner stack trace
  }
}

// Specific error types extend AppError
class ValidationError extends AppError {
  constructor(message, fields) {
    super(message, 400); // 400 Bad Request
    this.fields = fields; // Which fields failed validation
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor() {
    super('Authentication required', 401);
  }
}

// ===== Global Express Error Handler =====
// This middleware catches ALL errors thrown in route handlers
function globalErrorHandler(err, req, res, next) {
  // Default to 500 if statusCode not set (programming error)
  err.statusCode = err.statusCode || 500;

  // Log error details (use structured logging in production)
  logger.error({
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    requestId: req.id,         // Trace individual requests
    path: req.path,
    method: req.method
  });

  // Don't send stack traces to clients in production!
  if (process.env.NODE_ENV === 'production') {
    if (err.isOperational) {
      // Safe to send details for expected errors
      return res.status(err.statusCode).json({
        status: 'error',
        message: err.message,
        ...(err.fields && { fields: err.fields }) // Include validation fields if present
      });
    }
    // Programming errors: send generic message, fix the bug
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again.'
    });
  }

  // Development: send full error details
  res.status(err.statusCode).json({
    status: 'error',
    message: err.message,
    stack: err.stack,
    error: err
  });
}

// ===== Handle unhandled promise rejections & uncaught exceptions =====
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', reason);
  // Give server time to finish ongoing requests, then exit
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // Exit immediately - state may be corrupt
  process.exit(1);
});
```

**What this code does:** Establishes a typed error hierarchy for the application and two global safety nets that prevent unhandled errors from silently corrupting state or crashing without logs.

**Why this matters:** Without structured error handling: (1) stack traces leak to clients (security), (2) every route needs duplicate error-handling logic, (3) unhandled rejections can silently swallow bugs in production.

**How it works:**

**Error class hierarchy:**

| Line | Explanation |
|---|---|
| `class AppError extends Error` | Base class for all operational errors. Extending `Error` ensures `instanceof Error` checks pass, and the error has a stack trace. |
| `super(message)` | Calls the `Error` constructor to set `this.message` and generate the stack trace. Must be called before accessing `this`. |
| `this.statusCode = statusCode` | Stores the HTTP status code on the error so the global handler can use it without a `switch` statement. |
| `this.isOperational = isOperational` | Distinguishes **operational errors** (expected, e.g., 404) from **programming errors** (bugs, e.g., `TypeError`). Only operational errors get detailed messages sent to clients. |
| `this.timestamp = new Date().toISOString()` | Captures when the error occurred for log correlation. |
| `Error.captureStackTrace(this, this.constructor)` | V8-specific API that removes the `AppError` constructor itself from the stack trace, making logs cleaner and pointing directly to the callsite. |
| `class ValidationError extends AppError` | Adds a `fields` property to carry which fields failed — useful for form validation responses (HTTP 400). |
| `class NotFoundError extends AppError` | Pre-wires a 404 status code, so callers just write `throw new NotFoundError('User')` with no magic numbers. |

**Global Express error handler:**

| Line | Explanation |
|---|---|
| `function globalErrorHandler(err, req, res, next)` | Express detects error-handling middleware by its **4-argument signature** (err, req, res, next). It is called whenever `next(err)` is invoked or an async handler throws. |
| `err.statusCode = err.statusCode \|\| 500` | Falls back to 500 for unexpected programming errors that don't set a status code. |
| `if (process.env.NODE_ENV === 'production')` | Guards against leaking stack traces and internal details to API consumers in production. |
| `if (err.isOperational)` | Send the specific error message for known user-facing errors (validation, not-found, etc.) but hide implementation details for unexpected errors. |
| `res.status(500).json({ message: 'Something went wrong.' })` | Generic response for programming errors — hides the bug from clients while the on-call engineer investigates the logs. |

**Global process safety nets:**

| Line | Explanation |
|---|---|
| `process.on('unhandledRejection', ...)` | Fires when a Promise rejects and no `.catch()` or `try/catch` handles it. Node.js will crash by default in newer versions — this gives you a chance to log before exiting. `server.close()` drains existing requests before shutdown. |
| `process.on('uncaughtException', ...)` | Fires when synchronous code throws without a surrounding `try/catch`. **Process state may be corrupt**, so `process.exit(1)` is the only safe response. Never try to resume after an uncaught exception. |

**Purpose:** Production Express apps need a single, centralised error handler that differentiates known vs unknown errors, prevents info leakage, and provides structured logging for observability tools (Datadog, CloudWatch, Sentry).

### Middleware Chain (Production Setup)

```javascript
const express = require('express');
const helmet = require('helmet');         // Security headers
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');         // HTTP request logging
const compression = require('compression'); // Gzip responses
const cors = require('cors');

const app = express();

// ===== Security Middleware (runs on EVERY request) =====

// helmet: Sets ~15 security-related HTTP headers automatically
// Prevents XSS, clickjacking, MIME sniffing, etc.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],              // Only load resources from same origin
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles
    }
  }
}));

// CORS: Which origins can make cross-origin requests
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,       // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

// Rate limiting: Prevent brute force and DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 100,                  // Max 100 requests per window per IP
  standardHeaders: true,     // Return rate limit info in headers
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many requests, slow down.' });
  }
});
app.use('/api/', limiter);   // Apply only to API routes

// Compress responses: Reduces bandwidth by 70-80%
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false; // Opt-out header
    return compression.filter(req, res); // Default: compress text, JSON, etc.
  },
  level: 6 // Compression level 1-9 (6 = good balance of speed vs size)
}));

// Parse incoming JSON bodies
app.use(express.json({
  limit: '10mb',        // Reject bodies larger than 10MB (prevents memory exhaustion)
  strict: true          // Only accept arrays and objects at root level
}));

// Request logging
app.use(morgan('combined', {
  stream: { write: (msg) => logger.info(msg.trim()) } // Pipe to your logger
}));

// ===== Custom Middleware: Request ID & Timing =====
app.use((req, res, next) => {
  req.id = crypto.randomUUID(); // Unique ID per request for tracing
  req.startTime = Date.now();

  // Add ID to response headers (useful for debugging with clients)
  res.setHeader('X-Request-Id', req.id);

  // After response is sent, log timing
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`, {
      requestId: req.id
    });
  });

  next(); // Pass to next middleware
});
```

**What this code does:** Configures a complete production-grade Express middleware stack covering security, CORS, rate limiting, compression, body parsing, logging, and per-request tracing.

**Why this matters:** Middleware runs on every request in the order it is registered. Getting the order and configuration wrong can expose security holes, break CORS, or degrade performance.

**How it works:** Each `app.use(...)` call adds a function to the middleware chain. When a request arrives, Express runs them top to bottom; each calls `next()` to continue or sends a response to stop the chain.

| Middleware / Line | Explanation |
|---|---|
| `require('helmet')` | Sets ~15 HTTP security response headers (e.g., `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`) in one call, preventing XSS, clickjacking, and MIME-type sniffing. |
| `contentSecurityPolicy.directives.defaultSrc: ["'self'"]` | Tells browsers to only load scripts/images/styles from the same origin — blocks injected third-party content. |
| `app.use(cors({ origin: ..., credentials: true }))` | Configures Cross-Origin Resource Sharing. `origin` whitelists allowed domains; `credentials: true` allows the browser to send cookies with cross-origin requests (required for session/JWT cookie auth). |
| `process.env.ALLOWED_ORIGINS?.split(',')` | Optional chaining `?.` safely reads an env var that may be undefined, avoiding a runtime error. `.split(',')` converts a comma-separated string to an array of origins. |
| `rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })` | Sliding window rate limiter. `windowMs` = 15 minutes in milliseconds; `max` = maximum requests per IP in that window. After 100 requests, subsequent ones receive 429. |
| `standardHeaders: true` | Adds `RateLimit-*` headers to responses so clients know their quota and reset time. |
| `app.use('/api/', limiter)` | Scopes rate limiting to `/api/*` routes only — static file routes like `/public/` are not limited. |
| `compression({ level: 6 })` | Gzip-compresses HTTP responses. Level 6 balances compression ratio vs CPU cost. Reduces JSON payload size by ~70%. |
| `req.headers['x-no-compression']` | Allows individual clients to opt out of compression (useful for clients that measure raw transfer speed in tests). |
| `express.json({ limit: '10mb', strict: true })` | Parses `application/json` request bodies. `limit` prevents an attacker from sending a 1 GB body to exhaust memory. `strict: true` rejects top-level primitives like `"hello"` — only objects and arrays. |
| `morgan('combined', { stream: ... })` | HTTP access logger using Apache's `combined` format (IP, timestamp, method, URL, status, bytes, referrer, user-agent). Piped to your structured logger so all logs go through one system. |
| `crypto.randomUUID()` | Generates a unique UUID v4 for each request. Attached to logs and response headers so you can trace a single request across all log lines. |
| `req.startTime = Date.now()` | Records the timestamp when the request enters the middleware stack, used to compute response latency. |
| `res.setHeader('X-Request-Id', req.id)` | Returns the request ID in the response header so the client can include it in bug reports or support tickets. |
| `res.on('finish', () => { ... })` | The `'finish'` event fires *after* the response is fully sent. Used here to log method, path, status code, and latency — all four are only available after the response is complete. |
| `next()` | Passes control to the next middleware in the chain. Without this call, the request would hang. |

**Purpose:** This stack is the boilerplate security and observability foundation for any production Express API. Register these before your route handlers.

### JWT Authentication (Production)

```javascript
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Promisify the callback-based verify function
const jwtVerify = promisify(jwt.verify);

class AuthService {
  // Generate access token (short-lived) and refresh token (long-lived)
  generateTokens(userId, role) {
    // Access token: used for API requests, expires quickly
    const accessToken = jwt.sign(
      { sub: userId, role },                        // Payload (don't store sensitive data!)
      process.env.JWT_ACCESS_SECRET,                // Different secret per token type
      { expiresIn: '15m', issuer: 'your-app' }     // 15 minutes - short by design
    );

    // Refresh token: only used to get new access tokens
    const refreshToken = jwt.sign(
      { sub: userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }                           // 7 days
    );

    return { accessToken, refreshToken };
  }

  // Middleware: protect routes
  authenticate = async (req, res, next) => {
    try {
      // Extract token from Authorization header: "Bearer <token>"
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedError();
      }

      const token = authHeader.split(' ')[1]; // Get just the token part

      // Verify signature and expiry
      const decoded = await jwtVerify(token, process.env.JWT_ACCESS_SECRET);

      // IMPORTANT: Check if token was revoked (e.g., user logged out)
      // Store revoked tokens in Redis with TTL matching token expiry
      const isRevoked = await redis.get(`revoked:${decoded.jti}`);
      if (isRevoked) throw new UnauthorizedError();

      // Attach user info to request for downstream use
      req.user = { id: decoded.sub, role: decoded.role };
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new AppError('Token expired, please refresh', 401));
      }
      next(err);
    }
  }

  // Authorization: check permissions
  authorize = (...roles) => (req, res, next) => {
    // ...roles = spread operator: authorize('admin', 'moderator')
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission', 403));
    }
    next();
  }
}

// Usage in routes:
const auth = new AuthService();
router.get('/admin/users', auth.authenticate, auth.authorize('admin'), getUsers);
```

**What this code does:** Implements JWT-based authentication (verifying who the user is) and role-based authorisation (verifying what they are allowed to do) as reusable Express middleware.

**Why this matters:** JWT is stateless — no server-side session store needed. But without revocation checking, a stolen token is valid until expiry. This pattern adds that critical revocation layer.

**How it works:**

| Line / Block | Explanation |
|---|---|
| `const jwtVerify = promisify(jwt.verify)` | `jsonwebtoken`'s `verify` uses callbacks; `promisify` converts it to a Promise so it can be `await`ed cleanly inside an async function. |
| `jwt.sign({ sub: userId, role }, secret, { expiresIn: '15m' })` | Creates a signed JWT. `sub` (subject) is the standard claim for user ID. The token is signed with a **secret** — only your server can produce valid tokens. `expiresIn: '15m'` embeds an expiry timestamp in the token payload. |
| Two separate secrets (`JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`) | Using different secrets per token type means a compromised refresh secret cannot be used to forge access tokens and vice versa. |
| `expiresIn: '15m'` vs `'7d'` | Access tokens are short-lived to limit exposure if stolen. Refresh tokens are long-lived for user convenience. If an access token is stolen, it's only valid for 15 minutes. |
| `authenticate = async (req, res, next) => { ... }` | Arrow function assigned to a class property ensures `this` is always the `AuthService` instance when used as middleware (arrow functions capture `this` lexically). |
| `req.headers.authorization?.startsWith('Bearer ')` | Optional chaining avoids a crash if the header is absent. The Bearer scheme is the HTTP standard for token authentication. |
| `authHeader.split(' ')[1]` | Extracts just the token from `"Bearer eyJhbG..."` — splits on the space and takes the second element. |
| `await jwtVerify(token, process.env.JWT_ACCESS_SECRET)` | Verifies: (1) the token was signed by us (signature check), (2) it hasn't expired (timestamp check). Throws `TokenExpiredError` or `JsonWebTokenError` on failure. |
| `redis.get(\`revoked:${decoded.jti}\`)` | `jti` is the JWT ID claim — a unique identifier per token. **Note:** `jti` must be explicitly added to the token payload when signing: `jwt.sign({ sub: userId, role, jti: uuidv4() }, ...)`. When a user logs out, you store `revoked:<jti>` in Redis with a TTL equal to the token's remaining lifetime. This check catches revoked tokens that are not yet expired. |
| `req.user = { id: decoded.sub, role: decoded.role }` | Attaches the decoded user identity to the request object so downstream route handlers can use `req.user.id` without re-decoding the token. |
| `err.name === 'TokenExpiredError'` | Differentiates "token is expired (refresh it)" from "token is forged/invalid (reject)". Allows clients to detect the expired case and automatically refresh. |
| `authorize = (...roles) => (req, res, next) => { ... }` | Returns a middleware factory. `authorize('admin', 'moderator')` creates a middleware that only allows requests where `req.user.role` is in that list. Uses **currying** — first call configures, second call handles the request. |
| `router.get('/admin/users', auth.authenticate, auth.authorize('admin'), getUsers)` | Middleware chain: every request to this route must first pass authentication, then the admin role check, before `getUsers` is called. |

**Purpose:** Secure API routes with minimal boilerplate. Separation of `authenticate` and `authorize` follows the Single Responsibility Principle — authentication validates identity, authorisation validates permissions.

### Repository Pattern with Connection Pooling

```javascript
const { Pool } = require('pg'); // PostgreSQL driver with built-in pooling

// Connection pool: reuse DB connections instead of creating per request
const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 5432,
  max: 20,               // Maximum connections in pool
  idleTimeoutMillis: 30000,  // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Fail fast if can't connect in 2s
});

// Log pool events for monitoring
pool.on('error', (err) => logger.error('Unexpected pool error', err));

// Repository: wraps all DB operations for a model
class UserRepository {
  constructor(pool) {
    this.pool = pool;
  }

  // Use parameterized queries - NEVER string concatenation (SQL injection!)
  async findById(id) {
    const { rows } = await this.pool.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1 AND deleted_at IS NULL',
      [id]  // $1 is replaced safely; no SQL injection possible
    );
    return rows[0] || null; // Return null if not found (don't throw)
  }

  // Transactions: ensure multiple operations succeed or all rollback
  async transferCredits(fromUserId, toUserId, amount) {
    // Get a dedicated connection from the pool for the transaction
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN'); // Start transaction

      // Deduct from sender (pessimistic lock with FOR UPDATE)
      const { rows: [sender] } = await client.query(
        'SELECT credits FROM users WHERE id = $1 FOR UPDATE',
        // FOR UPDATE: locks this row until transaction ends
        // Prevents race conditions with concurrent transfers
        [fromUserId]
      );

      if (sender.credits < amount) {
        throw new ValidationError('Insufficient credits');
      }

      await client.query(
        'UPDATE users SET credits = credits - $1 WHERE id = $2',
        [amount, fromUserId]
      );

      await client.query(
        'UPDATE users SET credits = credits + $1 WHERE id = $2',
        [amount, toUserId]
      );

      // Record transaction for audit trail
      await client.query(
        'INSERT INTO credit_transfers (from_user, to_user, amount) VALUES ($1, $2, $3)',
        [fromUserId, toUserId, amount]
      );

      await client.query('COMMIT'); // All succeeded, make permanent

    } catch (err) {
      await client.query('ROLLBACK'); // Any error: undo everything
      throw err; // Re-throw for caller to handle
    } finally {
      client.release(); // ALWAYS release back to pool, even on error
    }
  }
}
```

**What this code does:** Demonstrates the Repository pattern using a PostgreSQL connection pool, showing both simple parameterised queries and a database transaction with row-level locking.

**Why this matters:** (1) Opening a new DB connection per request is expensive (TCP handshake, TLS, auth). Pools reuse connections. (2) Without transactions and row locks, concurrent transfers can cause race conditions where two requests read the same balance simultaneously and both deduct, leading to double-spending. (3) SQL injection is one of the most common vulnerabilities — parameterised queries are the complete defence.

**How it works:**

| Line | Explanation |
|---|---|
| `const { Pool } = require('pg')` | Imports the connection pool from the `pg` (node-postgres) library. A pool maintains a collection of ready-to-use DB connections. |
| `max: 20` | Maximum simultaneous connections. If all 20 are in use, new requests wait in a queue rather than crashing. Set based on your DB's `max_connections` limit. |
| `idleTimeoutMillis: 30000` | Connections unused for 30 seconds are closed and removed from the pool. Prevents resource leaks when traffic drops. |
| `connectionTimeoutMillis: 2000` | If no connection is available from the pool within 2 seconds, the query fails fast rather than waiting indefinitely — protects upstream response times. |
| `pool.on('error', ...)` | Handles unexpected errors on idle connections (e.g., DB restart). Without this listener, Node.js would throw an unhandled error and crash. |
| `this.pool.query('SELECT ... WHERE id = $1', [id])` | **Parameterised query**: `$1` is a placeholder; the driver sends the query and parameters separately to the DB, making SQL injection impossible. Never use string concatenation (`'WHERE id = ' + id`). |
| `rows[0] \|\| null` | Returns `null` (not `undefined` or an empty array) when the user is not found — consistent, easy to check for callers. |
| `const client = await this.pool.connect()` | Acquires a **dedicated** connection from the pool. Transactions require a single connection — using the pool directly could execute each query on a different connection, breaking the transaction. |
| `await client.query('BEGIN')` | Starts a transaction. All subsequent queries on this `client` are part of the same atomic unit. |
| `SELECT ... FOR UPDATE` | **Pessimistic row lock**: locks the selected row for the duration of the transaction. Other transactions trying to `SELECT ... FOR UPDATE` the same row will block until this one commits or rolls back. Prevents the "lost update" race condition. |
| `await client.query('COMMIT')` | Makes all changes permanent in the DB. Only reached if all queries succeeded. |
| `await client.query('ROLLBACK')` | Undoes all changes made in this transaction. Called in `catch` so any error leaves the DB in its original state. |
| `client.release()` in `finally` | **Critical**: always returns the connection to the pool, even if an error occurred. Without this, connections leak and the pool eventually becomes exhausted. |

**Purpose:** The Repository pattern centralises all DB access for a model, making it easy to swap the underlying store, add caching, or add logging. Transactions and locking ensure data integrity in concurrent environments (e.g., payment systems, inventory management).

### Redis Caching with Cache-Aside Pattern

```javascript
const Redis = require('ioredis');

// ioredis: more feature-rich than 'redis' package
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    // Exponential backoff: wait longer between retries
    // times=1: wait 1s, times=2: wait 2s, etc. Max 30s
    return Math.min(times * 1000, 30000);
  },
  maxRetriesPerRequest: 3,
  lazyConnect: true,  // Don't connect until first command
});

class CacheService {
  constructor(redis, defaultTTL = 3600) {
    this.redis = redis;
    this.defaultTTL = defaultTTL; // 1 hour default
  }

  // Cache-aside pattern: app checks cache, falls back to DB
  async getOrSet(key, fetchFn, ttl = this.defaultTTL) {
    // Step 1: Try cache first
    const cached = await this.redis.get(key);
    if (cached) {
      return JSON.parse(cached); // Cache hit: return immediately
    }

    // Step 2: Cache miss - fetch from source
    const data = await fetchFn();

    if (data !== null && data !== undefined) {
      // Step 3: Store in cache with expiry
      // EX = expire in seconds
      await this.redis.setex(key, ttl, JSON.stringify(data));
    }

    return data;
  }

  // Invalidate related cache keys when data changes
  async invalidatePattern(pattern) {
    // SCAN: safe alternative to KEYS (doesn't block Redis)
    const stream = this.redis.scanStream({ match: pattern, count: 100 });

    const pipeline = this.redis.pipeline(); // Batch delete commands
    stream.on('data', (keys) => {
      keys.forEach(key => pipeline.del(key)); // Queue deletes
    });

    await new Promise((resolve, reject) => {
      stream.on('end', async () => {
        await pipeline.exec(); // Execute all deletes at once
        resolve();
      });
      stream.on('error', reject);
    });
  }
}

// Usage:
const cache = new CacheService(redis);
const user = await cache.getOrSet(
  `user:${userId}`,
  () => userRepo.findById(userId), // Only called on cache miss
  1800 // 30 minutes TTL
);

// When user updates, invalidate their cache
await cache.invalidatePattern(`user:${userId}*`);
```

**What this code does:** Implements the **Cache-Aside** (Lazy Loading) pattern using Redis via `ioredis`, plus a safe pattern-based cache invalidation using `SCAN` instead of `KEYS`.

**Why this matters:** Without caching, every request hits the database. For read-heavy endpoints (user profiles, product listings), this causes unnecessary DB load, higher latency, and scalability limits. Redis serves cached responses in < 1 ms vs 10–50 ms for a DB query.

**How it works:**

| Line | Explanation |
|---|---|
| `const Redis = require('ioredis')` | `ioredis` is the most feature-rich Redis client for Node.js — supports Cluster, Sentinel, pipelining, and Lua scripting. |
| `retryStrategy: (times) => Math.min(times * 1000, 30000)` | Called on each reconnection attempt. Returns the delay in milliseconds before the next retry. Caps at 30 s to avoid hammering a recovering Redis server. |
| `maxRetriesPerRequest: 3` | If a Redis command fails 3 times in a row, it throws an error rather than retrying indefinitely. Keeps the application responsive when Redis is degraded. |
| `lazyConnect: true` | Does not establish the TCP connection until the first command is issued. Useful when the service may start before Redis is ready. |
| `defaultTTL = 3600` | 1-hour default TTL (Time To Live). After 3600 seconds, Redis automatically deletes the key, preventing stale data from persisting forever. |
| `await this.redis.get(key)` | Tries to retrieve the value from Redis. Returns `null` if the key doesn't exist (cache miss) or the stored string if it does (cache hit). |
| `JSON.parse(cached)` | Redis stores strings, not objects. `JSON.stringify` was used when storing; `JSON.parse` restores the original object. |
| `const data = await fetchFn()` | `fetchFn` is a callback (e.g., `() => db.users.findById(id)`) — called only on a cache miss. This keeps the `CacheService` agnostic of where data comes from. |
| `this.redis.setex(key, ttl, JSON.stringify(data))` | `SETEX` atomically sets the key and its expiry in one command. `JSON.stringify` serialises the object for storage. |
| `if (data !== null && data !== undefined)` | **Recommendation shown in code**: don't cache `null` or `undefined` — caching a "not found" state would prevent the cache from refreshing when the data is later created (negative caching). This guard prevents that scenario. |
| `this.redis.scanStream({ match: pattern, count: 100 })` | `SCAN` iterates through keys matching a glob pattern in batches of 100. Unlike `KEYS *`, it does not block Redis even with millions of keys. |
| `const pipeline = this.redis.pipeline()` | Batches multiple `DEL` commands into a single round-trip to Redis. Much more efficient than sending one `DEL` per key. |
| `await pipeline.exec()` | Sends all the batched `DEL` commands to Redis at once. |

**Purpose:** Cache-Aside is the most common caching pattern — the application code is responsible for reading from and writing to the cache. It avoids caching empty/null results and allows fine-grained TTL control per data type.

### Bull Queue (Redis-backed job queue)

```javascript
const Bull = require('bull');

// Create queues - each is a Redis list under the hood
const emailQueue = new Bull('email-notifications', {
  redis: { host: process.env.REDIS_HOST },
  defaultJobOptions: {
    attempts: 3,              // Retry failed jobs 3 times
    backoff: {
      type: 'exponential',    // Wait: 2s, 4s, 8s between retries
      delay: 2000             // Initial delay
    },
    removeOnComplete: 100,    // Keep last 100 completed jobs (for debugging)
    removeOnFail: 50,         // Keep last 50 failed jobs
  }
});

// Producer: Add jobs to the queue
class NotificationService {
  async sendWelcomeEmail(user) {
    // Add to queue - returns immediately, email sent asynchronously
    await emailQueue.add('welcome', {
      userId: user.id,
      email: user.email,
      name: user.name
    }, {
      delay: 5000,  // Send 5 seconds after signup (let DB settle)
      priority: 1   // Higher priority (1 > 2 > 3...)
    });
  }
}

// Consumer: Process jobs from the queue
emailQueue.process('welcome', 5, async (job) => {
  // 5 = concurrency: process up to 5 jobs simultaneously
  const { userId, email, name } = job.data;

  try {
    // Update progress (visible in Bull dashboard)
    await job.progress(25);

    const template = await loadTemplate('welcome');
    await job.progress(50);

    await sendgrid.send({
      to: email,
      subject: `Welcome, ${name}!`,
      html: template.render({ name })
    });

    await job.progress(100);

    // Return value is stored with the completed job
    return { sent: true, timestamp: new Date() };

  } catch (err) {
    // Throwing here triggers the retry logic
    logger.error('Failed to send welcome email', { jobId: job.id, err });
    throw err;
  }
});

// Queue events for monitoring
emailQueue.on('completed', (job, result) => {
  logger.info(`Job ${job.id} completed`, result);
});

emailQueue.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed after all retries`, { err });
  // Could alert PagerDuty, update DB status, etc.
});
```

**What this code does:** Sets up a Redis-backed job queue using Bull with automatic retry logic (exponential backoff), concurrency control, progress tracking, and queue monitoring hooks.

**Why this matters:** Sending emails, processing images, or calling third-party APIs inside an HTTP request handler is fragile — if they fail, the user gets an error. Message queues decouple the work: the request responds immediately, and the job is processed reliably in the background with automatic retry.

**How it works:**

| Line | Explanation |
|---|---|
| `new Bull('email-notifications', { redis: ... })` | Creates (or connects to) a Bull queue named `email-notifications`. Under the hood, Bull uses Redis lists and sorted sets to store jobs durably. |
| `attempts: 3` | If a job throws, Bull retries it up to 3 times total. On the 4th failure, it moves to the "failed" state. |
| `backoff: { type: 'exponential', delay: 2000 }` | **Exponential backoff**: wait 2 s before retry 1, 4 s before retry 2, 8 s before retry 3. Prevents hammering a temporarily unavailable service. |
| `removeOnComplete: 100` | Keeps only the last 100 completed jobs in Redis for debugging. Without this, completed jobs accumulate indefinitely and consume memory. |
| `removeOnFail: 50` | Keeps last 50 failed jobs so you can inspect them in the Bull dashboard or logs. |
| `await emailQueue.add('welcome', data, { delay: 5000, priority: 1 })` | Adds a job named `welcome` with the given data. `delay: 5000` postpones processing by 5 s (useful to let downstream services catch up after signup). `priority: 1` means this job is processed before lower-priority jobs. |
| `emailQueue.process('welcome', 5, async (job) => { ... })` | Registers a processor for jobs named `'welcome'`. `5` = concurrency — up to 5 jobs processed simultaneously by this worker. |
| `job.data` | The payload object passed when the job was added. Persisted in Redis, survives worker restarts. |
| `await job.progress(25)` | Reports percentage progress (0–100). Visible in the Bull dashboard and accessible via `job.progress()` from outside the processor. |
| `return { sent: true, timestamp: new Date() }` | The return value is stored with the completed job in Redis and passed to `emailQueue.on('completed', (job, result) => ...)`. |
| `throw err` inside processor | Rethrowing the error signals Bull to mark this attempt as failed and schedule a retry (up to `attempts` times). |
| `emailQueue.on('completed', ...)` | Event hook — fires when a job successfully completes. Use for metrics, database status updates, or downstream triggers. |
| `emailQueue.on('failed', ...)` | Fires after all retry attempts are exhausted. Use to trigger alerts (PagerDuty, Slack), update a `status: 'failed'` column in the DB, or dead-letter the job for manual review. |

**Purpose:** Message queues are essential for reliability in production. They provide durable, at-least-once delivery with retry, rate limiting, and observability for any background workload (emails, notifications, data processing, reports).

### Cluster Module (Utilize All CPU Cores)

```javascript
const cluster = require('cluster');
const os = require('os');

// cluster.isPrimary = running as the master process?
if (cluster.isPrimary) {
  const numCPUs = os.cpus().length; // Get number of CPU cores
  console.log(`Primary process ${process.pid} - forking ${numCPUs} workers`);

  // Fork a worker for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork(); // Creates child process running same script
  }

  // Restart workers if they die (crash resilience)
  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died (${signal || code}). Restarting...`);
    cluster.fork(); // Replace dead worker immediately
  });

  // Graceful shutdown: stop accepting new connections, finish existing
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, gracefully shutting down...');

    for (const id in cluster.workers) {
      cluster.workers[id].send('shutdown'); // Signal workers to stop
    }

    // Wait for workers to finish
    setTimeout(() => process.exit(0), 30000); // Force exit after 30s
  });

} else {
  // Worker process: runs the actual Express server
  const app = require('./app'); // Your Express app

  const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Worker ${process.pid} started`);
  });

  // Workers listen for shutdown signal from primary
  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      server.close(() => {
        // Finish processing existing requests, then exit cleanly
        logger.info(`Worker ${process.pid} shutting down`);
        process.exit(0);
      });
    }
  });
}
```

**What this code does:** Uses Node.js's built-in `cluster` module to spawn one worker process per CPU core, all sharing the same port, turning a single-threaded Node.js app into a multi-process one.

**Why this matters:** Node.js is single-threaded. A 16-core server running a single Node.js process uses only 1/16th of its CPU capacity. Clustering multiplies throughput by spawning one process per core. It also provides crash resilience — if a worker dies, the primary restarts it immediately.

**How it works:**

| Line | Explanation |
|---|---|
| `require('cluster')` | Built-in Node.js module that enables multi-process clustering. All workers share the same server port via OS-level load balancing. |
| `os.cpus().length` | Returns the number of logical CPU cores. On a 4-core machine this is 4 (or 8 with hyperthreading). We fork one worker per core. |
| `cluster.isPrimary` | `true` in the initial process (the process manager). `false` in each forked worker. The same script file is run for both — `isPrimary` branches the execution path. |
| `cluster.fork()` | Creates a new child process running the same script. The child process starts with `cluster.isPrimary === false`. OS kernel distributes incoming TCP connections across workers. |
| `cluster.on('exit', (worker, code, signal) => { cluster.fork(); })` | **Crash resilience**: if a worker crashes (OOM, unhandled exception), the primary immediately spawns a replacement. The service stays up. |
| `worker.send('shutdown')` | IPC (Inter-Process Communication) — sends a message to a worker process. Workers listen on `process.on('message', ...)` to receive it. |
| `setTimeout(() => process.exit(0), 30000)` | Force exits the primary after 30 s if workers haven't cleanly shut down. Prevents hanging during deployment. |
| `const app = require('./app')` | In workers only: loads the Express app. This is deferred to workers so only they handle HTTP traffic, not the primary process manager. |
| `app.listen(process.env.PORT \|\| 3000)` | Each worker binds to the same port. The OS kernel (on Linux) distributes incoming connections using SO_REUSEPORT, achieving load balancing without a reverse proxy. |
| `process.on('message', (msg) => { ... })` | Worker receives the `'shutdown'` IPC message. Calls `server.close()` which stops accepting new connections but waits for existing requests to finish before calling the callback. |

**Purpose:** Clustering is the simplest way to scale a Node.js app to use all CPU cores on a single machine. For multi-machine scaling, use a load balancer (e.g., AWS ALB) in front of multiple instances, each running a cluster. PM2 or Kubernetes deployments commonly use this pattern.

### Integration Testing with Jest & Supertest

```javascript
const request = require('supertest');  // HTTP testing library
const { app, server } = require('../app');
const db = require('../db');

// Jest lifecycle hooks
beforeAll(async () => {
  // Run migrations on test database before all tests
  await db.migrate.latest();
});

afterAll(async () => {
  // Cleanup: close server and DB connection
  server.close();
  await db.destroy();
});

beforeEach(async () => {
  // Reset data before each test (use transactions for speed)
  await db('users').truncate();
});

describe('POST /api/auth/register', () => {
  const validUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'SecurePass123!'
  };

  it('should create a user and return tokens', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(validUser)
      .expect(201); // Assert HTTP status code

    // Assert response structure
    expect(response.body).toMatchObject({
      status: 'success',
      data: {
        user: expect.objectContaining({ // Check subset of object
          email: validUser.email,
          name: validUser.name
        })
      }
    });

    // Assert tokens are returned
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.refreshToken).toBeDefined();

    // Assert password is NOT in response
    expect(response.body.data.user.password).toBeUndefined();

    // Assert DB state
    const dbUser = await db('users').where({ email: validUser.email }).first();
    expect(dbUser).toBeTruthy();
    expect(dbUser.password).not.toBe(validUser.password); // Should be hashed
  });

  it('should return 409 if email already exists', async () => {
    await db('users').insert({ ...validUser, password: 'hashed' });

    const response = await request(app)
      .post('/api/auth/register')
      .send(validUser)
      .expect(409);

    expect(response.body.message).toMatch(/already exists/i);
  });
});
```

**What this code does:** Demonstrates integration testing for a user registration endpoint using Jest (test runner) and Supertest (HTTP assertion library), verifying HTTP responses, response bodies, and database state.

**Why this matters:** Unit tests mock everything and can miss bugs at the HTTP layer (wrong status codes, serialisation issues, middleware errors). Integration tests exercise the full request/response cycle against a real (test) database.

**How it works:**

| Line | Explanation |
|---|---|
| `const request = require('supertest')` | Supertest makes HTTP requests to your Express `app` object directly, without starting a real server on a port. It handles listening/closing internally. |
| `beforeAll(async () => { await db.migrate.latest(); })` | Runs **once** before all tests in this file. Applies all pending migrations so the test database schema is up to date. |
| `afterAll(async () => { server.close(); await db.destroy(); })` | Runs **once** after all tests finish. Closes the HTTP server and database connection pool to prevent Jest from hanging after tests complete. |
| `beforeEach(async () => { await db('users').truncate(); })` | Runs **before each individual test**. Clears the users table so tests start with a clean, predictable state and don't affect each other. |
| `describe('POST /api/auth/register', () => { ... })` | Groups related tests under a label. Makes test output readable and allows running a specific group with `jest --testNamePattern`. |
| `const validUser = { ... }` | Shared test fixture at the `describe` scope — all tests within this group share this valid user object without duplication. |
| `await request(app).post('/api/auth/register').send(validUser).expect(201)` | Makes a POST request with the body `validUser`. `.expect(201)` asserts the HTTP status code is 201 Created — Supertest throws if it doesn't match. |
| `expect(response.body).toMatchObject({ ... })` | `toMatchObject` does a **partial** deep match — it only checks the specified properties, ignoring other fields. Preferred over `toEqual` because it's less brittle to API additions. |
| `expect.objectContaining({ email: ..., name: ... })` | Nested partial matcher — asserts the `user` object contains these fields without requiring an exact shape. |
| `expect(response.body.data.user.password).toBeUndefined()` | Critical security assertion: confirms the password hash is not accidentally returned in the response. |
| `await db('users').where({ email: validUser.email }).first()` | Verifies the side effect — checks the database directly to confirm the user was actually persisted, not just returned in a response. |
| `expect(dbUser.password).not.toBe(validUser.password)` | Confirms the password was hashed — the stored value must differ from the plaintext input. |
| `await db('users').insert({ ...validUser, password: 'hashed' })` | Pre-seeds the DB with an existing user so the next registration attempt hits the duplicate-email path. |
| `expect(response.body.message).toMatch(/already exists/i)` | Uses a case-insensitive regex to assert the error message — more resilient than exact string comparison if wording changes slightly. |

**Purpose:** Integration tests give high confidence that your API behaves correctly end-to-end. Test against a dedicated test database (not production or staging), and always reset state between tests to keep them deterministic and independent.

### What & Why?

**What:** Integrating Large Language Models (LLMs) like Claude, GPT-4, or open-source models into Node.js backends.
**Why:** Power intelligent features: chat, summarization, classification, code generation, RAG systems.
**Key concerns:** Streaming responses, token limits, rate limiting, prompt injection security, cost control.

### Streaming LLM Response to Client

```javascript
const Anthropic = require('@anthropic-ai/sdk');
const express = require('express');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Route: streams AI response to client in real-time
router.post('/api/ai/chat', authenticate, async (req, res) => {
  const { messages, systemPrompt } = req.body;

  // SECURITY: Sanitize user input (prevent prompt injection)
  const sanitizedMessages = messages.map(msg => ({
    role: msg.role,
    // Remove any attempts to override system prompt
    content: msg.content.replace(/<\/?[^>]+(>|$)/g, '') // Strip HTML tags
  }));

  // Set headers for SSE (Server-Sent Events) streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable Nginx buffering

  try {
    // Create streaming request to Claude API
    const stream = await anthropic.messages.stream({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      system: systemPrompt || 'You are a helpful assistant.',
      messages: sanitizedMessages,
    });

    let totalTokens = 0;

    // Stream each text chunk to the client as it arrives
    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        // SSE format: "data: <json>\n\n"
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }

      if (chunk.type === 'message_delta' && chunk.usage) {
        totalTokens = chunk.usage.output_tokens;
      }
    }

    // Track usage for billing/monitoring
    await usageTracker.record({
      userId: req.user.id,
      tokens: totalTokens,
      model: 'claude-opus-4-5',
      timestamp: new Date()
    });

    // Signal stream end
    res.write('data: [DONE]\n\n');
    res.end();

  } catch (err) {
    // Send error via SSE (client must handle this)
    res.write(`data: ${JSON.stringify({ error: 'AI service error' })}\n\n`);
    res.end();
  }
});
```

**What this code does:** Streams an LLM (Claude) response token-by-token to the browser in real time using Server-Sent Events (SSE), while sanitising input against prompt injection and tracking token usage.

**Why this matters:** Waiting for the entire LLM response before sending it (non-streaming) can take 10–30 seconds, making the UI feel broken. Streaming allows the browser to display words as they are generated, just like the ChatGPT interface.

**How it works:**

| Line | Explanation |
|---|---|
| `new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })` | Initialises the Anthropic SDK client. The API key is read from an env variable — never hardcode secrets in source code. |
| `router.post('/api/ai/chat', authenticate, ...)` | The `authenticate` middleware runs first, ensuring only authenticated users can call the AI endpoint (important for cost control). |
| `messages.map(msg => ({ ...msg, content: msg.content.replace(/<\/?[^>]+(>|$)/g, '') }))` | **Basic sanitisation (not comprehensive prompt injection protection)**: strips HTML/XML tags from user messages. This is a minimal defence — prompt injection can also occur through natural language instructions like "Ignore previous instructions and...". A full defence requires input validation schemas, output moderation, and ideally a separate prompt-classification step before passing to the model. |
| `res.setHeader('Content-Type', 'text/event-stream')` | Sets the SSE MIME type. The browser recognises this and keeps the connection open, reading each `data: ...` line as an event rather than treating the response as a file download. |
| `res.setHeader('Cache-Control', 'no-cache')` | Prevents proxies and browsers from caching the streaming response. |
| `res.setHeader('Connection', 'keep-alive')` | Keeps the TCP connection open for the duration of the stream. Required for SSE. |
| `res.setHeader('X-Accel-Buffering', 'no')` | Disables Nginx's response buffering (if Nginx is the reverse proxy). Without this, Nginx would buffer the entire response before forwarding it, defeating the streaming purpose. |
| `anthropic.messages.stream({ model, max_tokens, system, messages })` | Creates a **streaming** request to the Claude API. The SDK returns an async iterable that yields chunks as they arrive. `max_tokens: 1024` caps the response length and therefore the cost per request. |
| `for await (const chunk of stream)` | Async iteration: waits for each token chunk from the API, processes it, and sends it to the client. The event loop handles other requests while waiting for the next chunk. |
| `chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta'` | Filters to only text chunks (ignoring start/end events). Each `text_delta` contains a small piece of the generated text (a few characters or a word). |
| `res.write(\`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n\`)` | SSE format: each message starts with `data:`, is JSON encoded, and ends with **two newlines**. The browser's `EventSource` API parses this format automatically. |
| `chunk.usage.output_tokens` | Final chunk contains token usage stats. Stored for billing, rate limiting, and cost monitoring. |
| `await usageTracker.record({ userId, tokens, model, timestamp })` | Persists token usage so you can bill users, enforce quotas, and monitor AI costs by model. |
| `res.write('data: [DONE]\n\n')` | Signals the client that the stream is finished. The frontend listens for this sentinel value to close the connection and stop displaying a loading indicator. |
| `res.write(\`data: ${JSON.stringify({ error: ... })}\n\n\`)` | Errors during streaming are also sent via SSE (can't use HTTP status codes mid-stream since headers are already sent). The client must check for `event.data.error`. |

**Purpose:** Real-time streaming LLM responses are essential for a good user experience in AI chat applications. SSE is simpler than WebSockets for uni-directional server→client streaming.

```javascript
const { OpenAI } = require('openai');
const { PineconeClient } = require('@pinecone-database/pinecone');

class RAGService {
  constructor(openai, pinecone, anthropic) {
    this.openai = openai;       // For embeddings
    this.pinecone = pinecone;   // Vector database
    this.anthropic = anthropic; // For generation
  }

  // Step 1: Ingest documents (run offline / as a job)
  async ingestDocument(docId, text, metadata) {
    // Split text into overlapping chunks
    // Overlap: prevent losing context at chunk boundaries
    const chunks = this.#chunkText(text, { size: 512, overlap: 50 });

    for (const [i, chunk] of chunks.entries()) {
      // Convert text to vector embedding (numerical representation)
      const { data: [{ embedding }] } = await this.openai.embeddings.create({
        model: 'text-embedding-ada-002', // 1536-dimensional vectors
        input: chunk
      });

      // Store vector in Pinecone
      await this.pinecone.upsert({
        vectors: [{
          id: `${docId}-chunk-${i}`,
          values: embedding,         // The vector (1536 numbers)
          metadata: {
            text: chunk,             // Store original text for retrieval
            docId,
            chunkIndex: i,
            ...metadata              // e.g., { source: 'docs', date: '...' }
          }
        }]
      });
    }
  }

  // Step 2: Query (called at runtime for each user question)
  async query(userQuestion, topK = 5) {
    // Convert question to embedding
    const { data: [{ embedding: queryEmbedding }] } = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: userQuestion
    });

    // Find most similar chunks in vector DB
    const { matches } = await this.pinecone.query({
      vector: queryEmbedding,
      topK,                    // Return top 5 most similar chunks
      includeMetadata: true    // Include the stored text
    });

    // Filter low-confidence matches (score = cosine similarity 0-1)
    const relevantChunks = matches
      .filter(m => m.score > 0.75) // Only include if > 75% similar
      .map(m => m.metadata.text);

    // Build context from retrieved chunks
    const context = relevantChunks.join('\n\n---\n\n');

    // Generate answer grounded in retrieved context
    const response = await this.anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      system: `Answer questions based ONLY on the provided context. 
               If the answer isn't in the context, say so.
               Context:\n${context}`,
      messages: [{ role: 'user', content: userQuestion }]
    });

    return {
      answer: response.content[0].text,
      sources: matches.map(m => ({ docId: m.metadata.docId, score: m.score }))
    };
  }

  #chunkText(text, { size, overlap }) {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
      chunks.push(text.slice(start, start + size));
      start += size - overlap; // Move forward but keep some overlap
    }
    return chunks;
  }
}
```

**What this code does:** Implements a two-phase RAG (Retrieval-Augmented Generation) system: an **ingestion phase** that converts documents into searchable vectors, and a **query phase** that retrieves relevant context and generates grounded answers.

**Why this matters:** LLMs hallucinate when asked questions about proprietary or recent data. RAG grounds the model's answer in your actual documents, reducing hallucinations and keeping answers factually accurate.

**How it works:**

**Ingestion phase (`ingestDocument`):**

| Line | Explanation |
|---|---|
| `this.#chunkText(text, { size: 512, overlap: 50 })` | Splits large documents into 512-character chunks (~128 tokens). `overlap: 50` means consecutive chunks share 50 characters — this prevents answers being lost at chunk boundaries (e.g., a sentence spanning two chunks). **Note:** Character-based chunking is used here for simplicity. In production, prefer token-based chunking (e.g., using `tiktoken`) since `text-embedding-ada-002` has a context window of 8191 tokens and most semantic units are better measured in tokens than raw characters. The chunk size should be tuned for your document type — 256–512 tokens is a common starting point. |
| `this.openai.embeddings.create({ model: 'text-embedding-ada-002', input: chunk })` | Calls OpenAI's embedding API, which converts text into a 1536-dimensional numerical vector. Semantically similar texts produce numerically similar vectors (measured by cosine similarity). |
| `const { data: [{ embedding }] } = await ...` | Nested destructuring: unpacks `response.data[0].embedding` in one step. |
| `this.pinecone.upsert({ vectors: [{ id, values, metadata }] })` | Stores the vector in Pinecone. `id` uniquely identifies the chunk; `values` is the 1536-number vector; `metadata` stores the original text and source info for retrieval later. `upsert` = insert or update if the ID already exists. |
| `#chunkText` with `start += size - overlap` | Each iteration advances by `size - overlap` (= 462 chars), ensuring each new chunk starts 50 chars before the previous one ended. |

**Query phase (`query`):**

| Line | Explanation |
|---|---|
| `this.openai.embeddings.create({ input: userQuestion })` | Converts the user's question into the same vector space as the stored document chunks. |
| `this.pinecone.query({ vector: queryEmbedding, topK, includeMetadata: true })` | Performs an **approximate nearest-neighbour** (ANN) search in the vector space. Returns the `topK` chunks whose embeddings are most similar to the question embedding. |
| `.filter(m => m.score > 0.75)` | `score` is the cosine similarity (0–1). Chunks below 0.75 similarity are likely irrelevant — filtering them prevents sending noise to the LLM as context. |
| `relevantChunks.join('\n\n---\n\n')` | Combines retrieved text chunks into a single context string, separated by horizontal rules for readability in the prompt. |
| `system: \`Answer questions based ONLY on the provided context...\`` | **Grounding instruction**: instructs the LLM not to use its pre-trained knowledge, only the retrieved context. Reduces hallucination by anchoring responses to real documents. |
| `return { answer, sources }` | Returns both the generated answer and the source document IDs with relevance scores — enables citation rendering in the UI. |

**Purpose:** RAG is the standard architecture for building chatbots over private data (documentation, knowledge bases, PDFs). The ingestion pipeline runs offline; the query pipeline runs per user request at low latency.

```javascript
class AIRateLimiter {
  constructor(redis) {
    this.redis = redis;
  }

  // Token bucket per user: prevent excessive AI usage
  async checkAndConsumeTokens(userId, estimatedTokens) {
    const key = `ai:tokens:${userId}:${this.#getCurrentHour()}`;
    // Use current hour as key so it auto-resets each hour

    const pipeline = this.redis.pipeline();
    pipeline.incrby(key, estimatedTokens); // Add tokens used
    pipeline.expire(key, 3600);            // Expire after 1 hour
    const [[, totalUsed]] = await pipeline.exec();

    const HOURLY_LIMIT = 50000; // 50k tokens per hour per user
    if (totalUsed > HOURLY_LIMIT) {
      throw new AppError('AI usage limit reached. Try again next hour.', 429);
    }

    return { used: totalUsed, limit: HOURLY_LIMIT, remaining: HOURLY_LIMIT - totalUsed };
  }

  #getCurrentHour() {
    return Math.floor(Date.now() / 3600000); // Hours since epoch
  }
}
```

**What this code does:** Implements a per-user token bucket rate limiter for AI API calls, using Redis to track and cap hourly token usage, with automatic hourly reset.

**Why this matters:** LLM API calls are priced per token. Without rate limiting, a single user (or an attack) can spend thousands of dollars in minutes. This limiter enforces per-user hourly caps using atomic Redis operations.

**How it works:**

| Line | Explanation |
|---|---|
| `const key = \`ai:tokens:${userId}:${this.#getCurrentHour()}\`` | Key includes both the user ID and the current **hour** (a number that changes every 60 minutes). When the hour changes, a new key is created — effectively resetting the counter without a scheduled job. |
| `Math.floor(Date.now() / 3600000)` | `Date.now()` returns milliseconds since epoch. Dividing by 3,600,000 (ms per hour) and flooring gives a number that increments by 1 each hour. This is a time-bucket key. |
| `this.redis.pipeline()` | Groups multiple Redis commands into one network round-trip. More efficient than two separate `await` calls. |
| `pipeline.incrby(key, estimatedTokens)` | Atomically increments the counter by the number of tokens this request will use. `INCRBY` is atomic in Redis — no race condition even if two requests arrive simultaneously. |
| `pipeline.expire(key, 3600)` | Sets the key to expire in 3600 seconds. This is a safety net — if the hour-bucket key is somehow never incremented again, Redis will clean it up automatically. |
| `const [[, totalUsed]] = await pipeline.exec()` | `pipeline.exec()` returns an array of `[error, result]` pairs. `[[, totalUsed]]` destructures the first result's value (the incremented counter after adding the current request's tokens). |
| `if (totalUsed > HOURLY_LIMIT)` | If the user's hourly token spend exceeds the cap, throw a 429 error. **Important trade-off**: we increment *before* checking, so the current request is counted even when it's the request that pushes the user over the limit. This means a user at 99,990/100,000 tokens can still consume up to 100,000 + `estimatedTokens` in a single request. This is intentional for simplicity — to enforce a hard cap, check first with `INCRBY` in a Lua script or check against `totalUsed - estimatedTokens < limit`. |
| `return { used, limit, remaining }` | Returns quota info so the caller can include it in the API response headers (`X-RateLimit-Remaining`, etc.) for clients to display. |

**Purpose:** Combine this with a middleware that calls `checkAndConsumeTokens` before every AI endpoint invocation. The atomic Redis increment prevents double-spending in concurrent requests, and the time-bucket pattern gives automatic hourly resets without cron jobs.

### Q1: Design a Real-Time Chat System

**Architecture:**

```
Client (React) ←→ WebSocket Server (Node.js + Socket.io)
                         ↓
                   Redis Pub/Sub (cross-server messaging)
                         ↓
                   Message DB (MongoDB/PostgreSQL)
                         ↓
                   Notification Service (Bull Queue)
```

```javascript
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');

// Redis adapter: synchronizes events across multiple Node.js instances
// Without this, user on server-1 can't message user on server-2
const pubClient = redis.duplicate(); // Separate connection for publishing
const subClient = redis.duplicate(); // Separate connection for subscribing

io.adapter(createAdapter(pubClient, subClient));
// Now events are broadcast to ALL connected servers

io.use(async (socket, next) => {
  // Authenticate WebSocket connections using JWT
  try {
    const token = socket.handshake.auth.token;
    const user = await authService.verifyToken(token);
    socket.userId = user.id;   // Attach user to socket
    socket.join(`user:${user.id}`); // Personal room for direct messages
    next();
  } catch {
    next(new Error('Authentication failed'));
  }
});

io.on('connection', (socket) => {
  socket.on('join-room', async (roomId) => {
    // Verify user has permission to join room
    const canJoin = await roomService.canUserJoin(socket.userId, roomId);
    if (!canJoin) return socket.emit('error', 'Access denied');

    socket.join(roomId); // Subscribe to room events
  });

  socket.on('send-message', async ({ roomId, content }) => {
    // Save to DB first for persistence
    const message = await messageService.create({
      roomId, senderId: socket.userId, content
    });

    // Broadcast to ALL users in the room (across all servers via Redis)
    io.to(roomId).emit('new-message', message);

    // Queue push notifications for offline users
    await notificationQueue.add('push', { roomId, message });
  });
});
```

**What this code does:** Implements a horizontally-scalable real-time chat system using Socket.io, with JWT authentication on WebSocket connections, room-based messaging, and Redis Pub/Sub to synchronise events across multiple server instances.

**Why this matters:** A single Socket.io server can handle thousands of connections but fails when you scale to multiple servers — a message sent on server-1 can't reach users on server-2 without a message broker. Redis Pub/Sub solves this.

**How it works:**

| Line | Explanation |
|---|---|
| `redis.duplicate()` | Creates an **independent** Redis connection for pub and sub. Redis requires separate connections for publishing and subscribing — you cannot use the same connection for both. |
| `io.adapter(createAdapter(pubClient, subClient))` | Configures Socket.io to use Redis for distributing events. When you call `io.to(roomId).emit(...)`, Socket.io publishes to Redis, and all other server instances subscribed to that channel re-emit the event to their local sockets. |
| `io.use(async (socket, next) => { ... })` | **Socket.io middleware**: runs for every new WebSocket connection attempt. It's the WebSocket equivalent of Express middleware. Call `next()` to allow, `next(error)` to reject. |
| `socket.handshake.auth.token` | The client passes the JWT in the Socket.io handshake `auth` object: `io({ auth: { token: accessToken } })`. This is the standard way to authenticate WebSocket connections. |
| `socket.join(\`user:${user.id}\`)` | Subscribes the socket to a personal room. Used to send direct messages to a specific user: `io.to('user:123').emit(...)`. |
| `socket.userId = user.id` | Stores the authenticated user's ID on the socket object for later use (e.g., in event handlers). Equivalent to `req.user` in Express. |
| `io.on('connection', (socket) => { ... })` | Fires when a client successfully connects and passes authentication middleware. `socket` is the unique connection object for this client. |
| `socket.on('join-room', async (roomId) => { ... })` | Listens for a client event. The client emits `socket.emit('join-room', 'room-123')` and this handler runs server-side. |
| `roomService.canUserJoin(socket.userId, roomId)` | **Authorisation check**: verifies in the DB that this user has permission to join the room before subscribing them to its events. Never trust client-provided room IDs without authorisation. |
| `socket.join(roomId)` | Subscribes this socket to the named room. Any future `io.to(roomId).emit(...)` calls will reach this socket. |
| `await messageService.create({ roomId, senderId, content })` | Saves the message to the DB **before** broadcasting. This ensures messages survive server restarts and can be loaded on reconnect or by new joiners. |
| `io.to(roomId).emit('new-message', message)` | Broadcasts the message to **every socket** in the room, across **all server instances** (via Redis adapter). |
| `notificationQueue.add('push', { roomId, message })` | Queues push notifications for users who are offline. The worker processes this asynchronously — sending APNS/FCM push notifications does not block the WebSocket handler. |

**Purpose:** This pattern supports horizontal scaling: run 10 server instances behind a load balancer; Redis ensures all users see all messages regardless of which server they're connected to.

```javascript
// Sliding window rate limiter using Redis sorted sets
class SlidingWindowRateLimiter {
  async isAllowed(identifier, limit, windowSeconds) {
    const now = Date.now();
    const windowStart = now - (windowSeconds * 1000);
    const key = `ratelimit:${identifier}`;

    const pipeline = this.redis.pipeline();

    // Remove old requests outside the window
    pipeline.zremrangebyscore(key, '-inf', windowStart);

    // Count requests in current window
    pipeline.zcard(key);

    // Add current request with timestamp as score
    pipeline.zadd(key, now, `${now}-${Math.random()}`);

    // Set expiry to clean up automatically
    pipeline.expire(key, windowSeconds);

    const results = await pipeline.exec();
    const currentCount = results[1][1]; // Count after removing old requests

    return {
      allowed: currentCount < limit,
      remaining: Math.max(0, limit - currentCount - 1),
      resetAt: new Date(now + windowSeconds * 1000)
    };
  }
}
```

**What this code does:** Implements a **sliding window** rate limiter using Redis sorted sets — more accurate than fixed-window limiting (which allows burst at window boundaries).

**Why this matters:** A fixed-window limiter allows double the rate at window boundaries (100 requests in the last second of one window + 100 requests in the first second of the next). The sliding window always counts only the last N seconds, regardless of where the window boundary falls.

**How it works:** Redis Sorted Sets (`ZADD`) store each request as a member with its timestamp as the score, enabling efficient time-range queries.

| Line | Explanation |
|---|---|
| `const windowStart = now - (windowSeconds * 1000)` | Calculates the timestamp of the start of the current window. Requests with timestamps older than this are outside the window and should be removed. |
| `const key = \`ratelimit:${identifier}\`` | `identifier` could be a user ID, IP address, or API key — whatever you're rate-limiting by. Each gets its own sorted set. |
| `pipeline.zremrangebyscore(key, '-inf', windowStart)` | **Removes old requests**: deletes all members with score (timestamp) less than `windowStart`. This keeps the set containing only requests within the current window. `'-inf'` means "from the beginning of time". |
| `pipeline.zcard(key)` | **Counts requests**: `ZCARD` returns the number of members in the sorted set — i.e., the number of requests in the current window **after** removing old ones. |
| `pipeline.zadd(key, now, \`${now}-${Math.random()}\`)` | **Records current request**: adds the current request with the current timestamp as score. `Math.random()` makes the member name unique (sorted set members must be unique; same-millisecond requests could collide). |
| `pipeline.expire(key, windowSeconds)` | Auto-deletes the key after the window expires, preventing stale keys from accumulating in Redis. |
| `const results = await pipeline.exec()` | Executes all four commands atomically in one round-trip. Returns `[[err, result], [err, result], ...]`. |
| `const currentCount = results[1][1]` | Index `[1]` = second command (zcard); `[1]` again for the result value (not the error). This count reflects the state **after** old entries were removed but **before** the current request was added. |
| `allowed: currentCount < limit` | If the count before adding this request is already at the limit, deny it. |
| `remaining: Math.max(0, limit - currentCount - 1)` | Remaining capacity: subtracts 1 for the current request. `Math.max(0, ...)` prevents negative values. |
| `resetAt: new Date(now + windowSeconds * 1000)` | An approximation of when the window resets (when the oldest request in the window drops off). Used for `Retry-After` headers. |

**Purpose:** Use a sliding window rate limiter for strict API limits where burst tolerance must be consistent (auth endpoints, payment APIs, AI endpoints). Fixed-window is simpler but allows temporary burst at boundary points.

```
Upload → S3 → SQS Event → Lambda/Worker → Process → Store Results → Notify
```

```javascript
// Webhook handler: S3 triggers this when file is uploaded
router.post('/webhooks/s3', async (req, res) => {
  const { Records } = req.body;

  for (const record of Records) {
    const key = record.s3.object.key;      // e.g., "uploads/user123/data.csv"
    const bucket = record.s3.bucket.name;

    // Queue processing job
    await processQueue.add('process-file', {
      bucket, key,
      userId: key.split('/')[1],           // Extract userId from path
      uploadedAt: record.eventTime
    }, {
      jobId: key,       // Deduplicate: same key = same job
      attempts: 3
    });
  }

  res.sendStatus(200);
});
```

**What this code does:** Handles an S3 event notification webhook — when a file is uploaded to S3, S3 calls this endpoint, and the handler queues an asynchronous processing job with deduplication.

**Why this matters:** Processing uploads synchronously inside the webhook handler would time out for large files. The queue decouples the upload event from the work, giving the processing job its own retry logic, concurrency control, and timeout budget.

**How it works:**

| Line | Explanation |
|---|---|
| `router.post('/webhooks/s3', ...)` | S3 is configured to send HTTP POST notifications (via SNS or S3 Event Notifications) to this URL when objects are created in the bucket. |
| `const { Records } = req.body` | S3 sends a JSON body with a `Records` array — one record per uploaded file. A single S3 `PUT` can trigger one record, but batch operations may send multiple. |
| `record.s3.object.key` | The S3 object key (path), e.g., `uploads/user123/report.csv`. This is the primary identifier of the uploaded file. |
| `record.s3.bucket.name` | The S3 bucket name. Useful if this webhook handles multiple buckets. |
| `key.split('/')[1]` | Extracts the `userId` from the path convention `uploads/<userId>/filename.csv`. This is a convention-over-configuration pattern for routing work to the right user's context. |
| `processQueue.add('process-file', data, { jobId: key, attempts: 3 })` | Adds a processing job to the Bull queue. `jobId: key` is the critical part — if S3 sends the same event twice (S3 has at-least-once delivery), the second `add` with the same `jobId` is a **no-op** (idempotency). `attempts: 3` adds automatic retry logic. |
| `res.sendStatus(200)` | Responds immediately with HTTP 200. S3/SNS requires a 200 response within ~5 seconds or it marks the delivery as failed and retries. The actual processing happens asynchronously in the queue. |

**Purpose:** Event-driven file processing is the standard pattern for handling uploads in cloud architectures. S3 → queue → worker ensures reliable processing with retry logic, even if the worker service temporarily goes down.

### Circuit Breaker Pattern

```javascript
// Prevents cascading failures when a dependency is down
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5; // Open after 5 failures
    this.recoveryTimeout = options.recoveryTimeout || 60000; // Try again after 60s
    this.state = 'CLOSED';    // CLOSED = working normally
    this.failures = 0;
    this.nextAttempt = null;
  }

  async call(fn) {
    if (this.state === 'OPEN') {
      // Check if recovery timeout has passed
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN - service unavailable');
      }
      this.state = 'HALF-OPEN'; // Try one request to test if service recovered
    }

    try {
      const result = await fn();
      this.#onSuccess();
      return result;
    } catch (err) {
      this.#onFailure();
      throw err;
    }
  }

  #onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED'; // Service healthy, reset
  }

  #onFailure() {
    this.failures++;
    if (this.failures >= this.failureThreshold || this.state === 'HALF-OPEN') {
      this.state = 'OPEN'; // Too many failures, stop calling the service
      this.nextAttempt = Date.now() + this.recoveryTimeout;
      logger.warn('Circuit breaker opened', { failures: this.failures });
    }
  }
}

// Usage:
const paymentBreaker = new CircuitBreaker({ failureThreshold: 3 });
const result = await paymentBreaker.call(() => paymentService.charge(amount));
```

**What this code does:** Implements the Circuit Breaker pattern — a proxy that monitors failures to a dependency (e.g., payment API) and temporarily stops calling it when it's failing, preventing cascading failures across the system.

**Why this matters:** Without a circuit breaker, if the payment service is down, every request to your API hangs for 30 seconds (timeout), exhausting the event loop and connection pool. The circuit breaker "opens" after repeated failures and instantly returns an error, keeping your service responsive.

**How it works:** The circuit has three states:
- **CLOSED** (normal): all requests pass through
- **OPEN** (failing): all requests immediately fail without calling the dependency
- **HALF-OPEN** (recovery probe): one request is allowed through to test if the dependency recovered

| Line | Explanation |
|---|---|
| `failureThreshold: 5` | How many consecutive failures are needed to open the circuit. Lower = more sensitive but more false positives. |
| `recoveryTimeout: 60000` | How long (ms) the circuit stays OPEN before transitioning to HALF-OPEN. Gives the failing service time to recover. |
| `this.state = 'CLOSED'` | Initial state — circuit is "closed" meaning current flows through (analogous to a physical circuit breaker). All calls go to the dependency. |
| `if (this.state === 'OPEN')` | When OPEN, check if the `recoveryTimeout` has elapsed. If not, throw immediately without calling the dependency. |
| `this.state = 'HALF-OPEN'` | After the timeout, allow exactly one request through as a probe. If it succeeds, the circuit closes; if it fails, the circuit reopens. |
| `async call(fn)` | `fn` is the operation to wrap (e.g., `() => paymentService.charge(...)`). Using a callback makes the CircuitBreaker reusable for any dependency. |
| `this.#onSuccess()` | Resets `failures` to 0 and sets state back to CLOSED. A successful HALF-OPEN request indicates the dependency has recovered. |
| `this.#onFailure()` | Increments failure count. Opens the circuit if threshold reached or if the HALF-OPEN probe failed. Records `nextAttempt` timestamp. |
| `this.failures >= this.failureThreshold \|\| this.state === 'HALF-OPEN'` | Opens for either too many failures (CLOSED→OPEN) or a HALF-OPEN probe failure (HALF-OPEN→OPEN). |

**Purpose:** Use circuit breakers around all external dependencies (payment gateways, third-party APIs, microservices). Without them, one failing downstream service can take down your entire application.

```javascript
// Critical for zero-downtime deployments (Kubernetes, PM2)
async function gracefulShutdown(signal) {
  logger.info(`${signal} received - starting graceful shutdown`);

  // Stop accepting new connections
  server.close(async () => {
    try {
      // Close in reverse dependency order
      await redis.quit();          // Close Redis connections
      await pool.end();            // Close DB connection pool
      await emailQueue.close();    // Finish/close Bull queues
      logger.info('All connections closed, exiting');
      process.exit(0);
    } catch (err) {
      logger.error('Error during shutdown', err);
      process.exit(1);
    }
  });

  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    logger.error('Graceful shutdown timed out, forcing exit');
    process.exit(1);
  }, 30000); // 30 second timeout
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); // Kubernetes
process.on('SIGINT', () => gracefulShutdown('SIGINT'));   // Ctrl+C
```

**What this code does:** Implements graceful shutdown — when the process receives a termination signal, it stops accepting new connections, finishes in-flight requests, closes all external connections in the correct order, then exits cleanly.

**Why this matters:** In Kubernetes and PM2, deployments send `SIGTERM` to your process before killing it. Without graceful shutdown: (1) in-flight requests get cut off mid-response (502 errors for users), (2) database connections are dropped abruptly (may corrupt transactions), (3) Bull queue workers may drop jobs mid-processing.

**How it works:**

| Line | Explanation |
|---|---|
| `process.on('SIGTERM', ...)` | `SIGTERM` is sent by Kubernetes before killing the pod during a rolling deploy, scale-down, or pod eviction. It's the polite "please shut down" signal. |
| `process.on('SIGINT', ...)` | `SIGINT` is sent when you press `Ctrl+C` in the terminal. Important to handle during local development. |
| `server.close(async () => { ... })` | `server.close()` stops the HTTP server from accepting **new** connections. Existing connections (long-lived keep-alive or in-flight requests) are allowed to finish. The callback fires once all existing connections are closed. |
| `await redis.quit()` | Gracefully closes the Redis connection — sends the `QUIT` command and waits for acknowledgement. |
| `await pool.end()` | Waits for all active PostgreSQL queries to complete, then closes all pool connections. Running transactions are rolled back by the DB. |
| `await emailQueue.close()` | Tells Bull to finish any currently-processing jobs, then close the queue's Redis connections. Without this, a job could be interrupted mid-execution and left in the "active" state forever. |
| `process.exit(0)` | Exit code `0` = clean shutdown. Kubernetes marks the pod as successfully terminated. |
| `process.exit(1)` | Exit code `1` = error during shutdown. Kubernetes logs this and may alert, depending on configuration. |
| `setTimeout(() => process.exit(1), 30000)` | **Forced shutdown safety net**: if the graceful close takes more than 30 seconds (e.g., a stuck request, hung DB query), force exit. In Kubernetes, this must be less than `terminationGracePeriodSeconds` (default 30 s). |
| **Dependency order for closing** | Close resources in the correct order: Bull queues first (stops workers and closes Bull's internal Redis connections), then shared Redis connections, then the DB pool. **Important:** `emailQueue` and the `redis` client should use **separate** Redis connections — Bull creates its own connection pool from the config passed to `new Bull(...)`, so closing the queue doesn't affect your application's `redis` client. If they share a connection, close the queue first before any Redis disconnect. |

**Purpose:** Graceful shutdown is mandatory for zero-downtime deployments. Without it, every deploy causes user-visible errors. Match your timeout here to your Kubernetes `terminationGracePeriodSeconds` setting.

```javascript
// Common Node.js memory leaks and how to detect them

// 1. Event listener leak
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const emitter = new MyEmitter();

// BAD: adding listeners in a loop without removing = leak
for (let i = 0; i < 1000; i++) {
  emitter.on('data', (data) => console.log(data)); // 1000 listeners!
}

// GOOD: Remove listeners when done
const handler = (data) => console.log(data);
emitter.on('data', handler);
// Later:
emitter.off('data', handler);

// 2. Monitoring memory usage
const memUsage = process.memoryUsage();
// rss: total memory allocated to process
// heapUsed: JS objects currently alive
// heapTotal: total V8 heap allocated
// external: memory used by C++ objects (Buffers)

logger.info('Memory', {
  heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
  heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
  rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`
});

// Alert if heap usage > 500MB
if (memUsage.heapUsed > 500 * 1024 * 1024) {
  logger.warn('High memory usage detected!');
  metrics.increment('node.memory.high_usage');
}
```

**What this code does:** Demonstrates two common memory leak patterns in Node.js (event listener accumulation and unreleased references) and shows how to monitor memory usage with `process.memoryUsage()`.

**Why this matters:** Node.js does not have automatic memory leak protection. A single leaked event listener added in a hot path can accumulate thousands of handlers, consuming gigabytes of memory and eventually crashing the process with an out-of-memory (OOM) error.

**How it works:**

**Event listener leak example:**

| Line | Explanation |
|---|---|
| `class MyEmitter extends EventEmitter` | Custom class extending the built-in `EventEmitter`. Every `on(event, handler)` call adds a new listener to an internal array. |
| `for (let i = 0; i < 1000; i++) { emitter.on('data', ...) }` | **The leak**: adds 1000 listeners without ever removing them. If this loop is inside a request handler, a server handling 10,000 requests accumulates 10 million listeners. Node.js warns at 11 listeners (`MaxListenersExceededWarning`) as an early signal. |
| `const handler = (data) => console.log(data)` | Saving the handler reference in a variable is essential for later removal — anonymous functions cannot be deregistered. |
| `emitter.on('data', handler)` | Registers the named handler. |
| `emitter.off('data', handler)` | **The fix**: removes the exact same handler function reference from the `'data'` event. Uses `===` comparison, which is why you must keep the reference. |

**Memory monitoring:**

| Line | Explanation |
|---|---|
| `process.memoryUsage()` | Returns a snapshot of current memory consumption. Call this periodically (e.g., every 30 seconds via `setInterval`) to detect growing memory usage. |
| `rss` (Resident Set Size) | Total memory allocated to the Node.js process by the OS — includes heap, code segments, and C++ bindings. This is what `top` / `ps` reports. |
| `heapUsed` | Memory currently occupied by live JavaScript objects. The key metric for detecting JS-layer memory leaks. Steadily growing `heapUsed` over time indicates a leak. |
| `heapTotal` | Total heap memory V8 has reserved (it over-allocates for performance). `heapUsed / heapTotal` is the heap utilisation ratio. |
| `external` | Memory used by C++ objects bound to JavaScript (e.g., `Buffer`, native addons). A `Buffer` allocated with `Buffer.alloc(1e9)` would appear here. |
| `/ 1024 / 1024` | Converts bytes to megabytes for human-readable logging. |
| `memUsage.heapUsed > 500 * 1024 * 1024` | Threshold alert at 500 MB of heap. In production, emit a metric to Datadog/CloudWatch so alerts fire before the process crashes. |
| `metrics.increment('node.memory.high_usage')` | Sends a counter increment to your APM tool for alerting and trend tracking. |

**Other common leak causes (not shown but important):**
- Unbounded caches (Maps/objects that grow indefinitely without eviction)
- Storing large objects in closures that outlive their useful lifetime
- Timers (`setInterval`) that are never cleared
- HTTP/database connections that are not released back to their pools

**Purpose:** Add memory monitoring to your health check endpoint or a periodic logger. Combine with heap snapshot tools (`v8.writeHeapSnapshot()`, Chrome DevTools) to identify specific leak sources in production.

Use these prompts for your continued interview preparation:

### 🔵 Core Concepts

```
I'm a senior Node.js developer preparing for interviews. Explain the Node.js event loop 
in detail - cover all 6 phases, how microtasks (Promises, nextTick) interact with it, 
and give me tricky interview questions with surprising output order examples that 
interviewers commonly use.
```

```
Explain the difference between process.nextTick(), Promise.resolve().then(), 
setImmediate(), and setTimeout(0) in Node.js. Give code examples that show execution 
order in different scenarios including inside I/O callbacks.
```

### 🔵 Performance

```
I'm preparing for a senior Node.js interview. Give me 10 common performance bottlenecks 
in Node.js production applications, how to detect each one (tools, metrics), and how to 
fix them with code examples. Include memory leaks, event loop blocking, connection pool 
exhaustion, and N+1 query problems.
```

```
Explain how to profile a Node.js application that is slow in production. Cover: 
--inspect flag, Chrome DevTools, clinic.js, 0x flame graphs, and APM tools like 
Datadog or New Relic. Give me a step-by-step debugging workflow.
```

### 🔵 System Design

```
I need to design a scalable webhook delivery system in Node.js that: receives millions 
of events per day, retries failed deliveries with exponential backoff, guarantees 
at-least-once delivery, handles slow subscriber endpoints, and provides delivery 
dashboards. Give me the architecture and production Node.js code for key components.
```

```
Design a Node.js microservices system for an e-commerce platform. Include: API gateway, 
service discovery, inter-service communication (REST vs gRPC vs message queues), 
distributed tracing, and how to handle partial failures. Give me architecture diagrams 
(as text) and code examples.
```

### 🔵 Gen AI / LLM Integration

```
I'm building a production RAG system in Node.js. Give me a complete implementation 
covering: document chunking strategies, embedding generation, vector store integration 
(Pinecone), semantic search, prompt construction, streaming responses to the client 
via SSE, handling context window limits, and measuring retrieval quality.
```

```
What are the security concerns when integrating LLMs into a Node.js backend? Cover: 
prompt injection, data leakage, rate limiting, PII handling, model output validation, 
and how to audit AI responses. Give code examples for each protection.
```

### 🔵 Security

```
Give me a comprehensive security checklist for a production Node.js REST API. Cover: 
input validation, SQL injection, XSS, CSRF, rate limiting, JWT security, secrets 
management, dependency vulnerabilities, and security headers. Include code examples 
for each item.
```

### 🔵 Testing

```
Explain testing strategies for Node.js: unit, integration, and e2e tests. Cover: 
mocking strategies (jest.mock, sinon, nock), testing Express middleware, testing 
async code, database testing with real DB vs in-memory, and code coverage. 
Give production-grade examples using Jest and Supertest.
```

### 🔵 AWS Lambda + Node.js

```
I use AWS Lambda with Node.js. Explain: cold start optimization, Lambda execution 
context reuse, connecting to RDS/Redis from Lambda, handling concurrency limits, 
Lambda Layers, environment variable security, and how to structure a Lambda monorepo 
with shared utilities. Give production code examples.
```

### 🔵 High-Level Concepts

```
Explain these advanced Node.js patterns with production code examples: Circuit Breaker, 
Bulkhead, Retry with exponential backoff, Saga pattern for distributed transactions, 
Outbox pattern for reliable event publishing, and CQRS. When would you use each?
```

```
I'm interviewing at a company that runs Node.js at scale (millions of req/day). 
What questions should I expect about: observability (logging, metrics, tracing), 
deployment (blue/green, canary, rolling), Kubernetes integration with Node.js, 
and incident response? Give me answers with examples.
```

-----

## 📝 Quick Reference: Common Interview Questions

|Question                     |Key Points                                             |
|-----------------------------|-------------------------------------------------------|
|What is the event loop?      |6 phases, non-blocking I/O, microtask queue            |
|CommonJS vs ESM?             |Sync vs async loading, tree-shaking, top-level await   |
|How handle memory leaks?     |Event listeners, circular refs, profiling tools        |
|Clustering vs Worker Threads?|Cluster = multi-process networking; Workers = CPU tasks|
|How scale Node.js?           |Cluster, PM2, load balancer, Redis for state           |
|What is backpressure?        |Streams flowing faster than consumer can handle        |
|Promise.all vs allSettled?   |Fail-fast vs collect-all-results                       |
|How prevent SQL injection?   |Parameterized queries, never string concatenation      |
|JWT vs Sessions?             |JWT = stateless; Sessions = server state; tradeoffs    |
|How implement rate limiting? |Redis sliding window, token bucket                     |

-----

*Last updated: March 2026 | Prepared for 5-year senior full-stack developer interviews*