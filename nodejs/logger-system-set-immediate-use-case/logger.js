// logger.js
export function logUrgent(message) {
  process.nextTick(() => {
    console.log(`[URGENT] ${message}`);
  });
}

export function logNormal(message) {
  setImmediate(() => {
    console.log(`[NORMAL] ${message}`);
  });
}

export function logDelayed(message, delay = 2000) {
  setTimeout(() => {
    console.log(`[DELAYED after ${delay}ms] ${message}`);
  }, delay);
}
