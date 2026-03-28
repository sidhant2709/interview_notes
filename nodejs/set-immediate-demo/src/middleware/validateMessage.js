// src/middleware/validateMessage.js
export function validateMessage(req, res, next) {
  const { message } = req.body;

  if (typeof message !== 'string') {
    return res.status(400).json({ error: 'Message must be a string.' });
  }
  if (message.trim() === '') {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  if (message.length > 255) {
    return res
      .status(400)
      .json({ error: 'Message must be less than 256 characters.' });
  }

  next(); // validation passed
}
