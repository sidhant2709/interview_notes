// src/db.js
import { log } from '../utils/logger.js';

export function save(message) {
  return new Promise((resolve) => {
    setTimeout(() => {
      log(`✅ DB: Message "${message}" saved.`);
      resolve();
    }, 100);
  });
}
