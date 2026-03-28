// src/routes.js
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { save } from './db.js';
import { log } from '../utils/logger.js';
import { validateMessage } from './middleware/validateMessage.js';
import e from 'express';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sampleFilePath = path.join(__dirname, '../data/sample.txt');

router.post(
  '/save',
  async (req, res, next) => {
    const { message } = req.body;
    const useFallback = req.query.useFallback === 'true';

    if (!message && useFallback) {
      try {
        const fileData = await fs.readFile(sampleFilePath, 'utf8');
        req.body.message = fileData.slice(0, 30) + '...';
      } catch (err) {
        return res.status(500).json({ error: 'Error reading fallback file' });
      }
    }

    next(); // go to validation middleware
  },
  validateMessage,
  async (req, res) => {
    const { message } = req.body;

    log('📄 Received request to save message.');

    process.nextTick(() => {
      log('📝 process.nextTick: Analytics for message save request.');
    });

    try {
      await save(message);

      setImmediate(() => {
        log('📮 setImmediate: Acknowledge DB save.');
      });

      setTimeout(() => {
        log('⏱️ setTimeout: Cleanup after message save.');
      }, 0);

      res
        .status(200)
        .json({ status: 'success', message: 'Saved successfully.' });
    } catch (err) {
      log(`❌ Error saving message: ${err.message}`);
      res.status(500).json({ status: 'error', error: err.message });
    }
  }
);

export default router;
