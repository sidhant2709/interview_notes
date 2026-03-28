// index.js
import { logUrgent, logNormal, logDelayed } from './logger.js';

console.log('--- Logging System Started ---');

// Step 1: Log a critical error
logUrgent('Critical system failure!');

// Step 2: Log a user action
logNormal('User clicked on dashboard.');

// Step 3: Log scheduled analytics data
logDelayed('Analytics log: Page views = 1283');

// Simulate an I/O operation
setTimeout(() => {
  console.log('[IO Operation] Database query finished.');
}, 100);
