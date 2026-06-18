import rateLimit from 'express-rate-limit';

export const shortenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: { error: 'Too many requests, slow down.' }
});