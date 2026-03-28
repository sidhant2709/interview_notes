// src/db.test.js
import { describe, it, expect, vi } from 'vitest';
import { save } from './db.js';

vi.mock('../utils/logger.js', () => ({
  log: vi.fn(), // silence logs during test
}));

describe('db.save', () => {
  it('should resolve after saving the message', async () => {
    const message = 'Test message';
    const result = await save(message);
    expect(result).toBeUndefined(); // resolves with no value
  });
});
