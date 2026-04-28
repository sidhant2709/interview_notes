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
1. [Database Patterns (SQL & NoSQL)](#8-database-patterns-sql--nosql)
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

- `Worker` = spawns a new OS thread for CPU tasks
- `isMainThread` = checks if code runs in main or worker
- `workerData` = data passed safely between threads
- `parentPort.postMessage` = sends result back to main thread

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

-----

## 3. Streams & Buffers

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

-----

## 4. Modules & CommonJS vs ESM

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

**Key Differences:**

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

-----

## 6. Express.js & Middleware

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

-----

## 7. Authentication & Security

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

-----

## 8. Database Patterns (SQL & NoSQL)

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

-----

## 9. Caching Strategies

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

-----

## 10. Message Queues & Event-Driven Architecture

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

-----

## 11. Performance & Clustering

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

-----

## 12. Testing in Node.js

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

-----

## 13. Gen AI Integration in Node.js

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

### RAG System (Retrieval-Augmented Generation)

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

### AI Rate Limiting & Cost Control

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

-----

## 14. System Design Questions for Node.js

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

### Q2: Design an API Rate Limiter

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

### Q3: Design a File Processing Pipeline

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

### Q4: Design a Job Queue / Background Processing System

**Architecture:**

```
API Server → Bull Queue (Redis) → Worker Processes → Results DB → Webhook/SSE notify client
```

```javascript
const Bull = require('bull');
const { Worker } = require('worker_threads');

// Producer: API adds jobs to queue
const emailQueue = new Bull('email', {
  redis: { host: process.env.REDIS_HOST, port: 6379 },
  defaultJobOptions: {
    attempts: 3,                              // Retry up to 3 times on failure
    backoff: { type: 'exponential', delay: 5000 }, // 5s, 10s, 20s between retries
    removeOnComplete: 100,                    // Keep last 100 completed jobs
    removeOnFail: 500,                        // Keep last 500 failed jobs for debugging
  }
});

// Add job with priority
await emailQueue.add('welcome-email', {
  userId: user.id,
  email: user.email,
  templateId: 'welcome-v2'
}, {
  priority: 1,    // Lower number = higher priority
  delay: 0,       // Start immediately
  jobId: `welcome:${user.id}` // Prevent duplicate jobs for same user
});

// Consumer: Worker process pulls and processes jobs
emailQueue.process('welcome-email', 5, async (job) => {
  // 5 = concurrency: process 5 jobs simultaneously per worker
  const { userId, email, templateId } = job.data;

  // Update progress (visible in Bull dashboard)
  await job.progress(10);

  const template = await templateService.render(templateId, { userId });
  await job.progress(50);

  await emailProvider.send({ to: email, ...template });
  await job.progress(100);

  // Return value is stored with job result
  return { sent: true, timestamp: new Date() };
});

// Monitor queue health
emailQueue.on('failed', (job, err) => {
  logger.error('Email job failed', {
    jobId: job.id,
    data: job.data,
    attemptsMade: job.attemptsMade,
    error: err.message
  });

  // Alert on-call if a job exhausts all retries
  if (job.attemptsMade >= job.opts.attempts) {
    alerting.notify(`Email job ${job.id} exhausted retries`);
  }
});

emailQueue.on('stalled', (job) => {
  // Job was picked up by worker but never completed (worker crashed)
  logger.warn('Stalled job detected', { jobId: job.id });
});
```

**Key design decisions:**
- **Idempotency:** Use `jobId` to prevent duplicate processing
- **Dead Letter Queue:** Failed jobs after max retries go to a DLQ for manual review
- **Backpressure:** Bull pauses producers when queue depth exceeds threshold
- **Observability:** Bull Board UI for real-time queue monitoring

-----

## 15. High-Level / Advanced Concepts

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

### Graceful Shutdown

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

### Memory Leak Detection

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

-----

## 16. Deep-Dive Prompts for Claude

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

*Last updated: April 2026 | Prepared for 5-year senior full-stack developer interviews*