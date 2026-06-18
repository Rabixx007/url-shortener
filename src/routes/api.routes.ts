import { Router } from 'express';
import { shortenUrl } from '../controllers/url.controller';
import { shortenLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';

const router = Router();
router.post('/shorten', shortenLimiter, authenticate, shortenUrl);

export default router;