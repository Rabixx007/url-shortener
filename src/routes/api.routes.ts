import { Router } from 'express';
import { shortenUrl } from '../controllers/url.controller';
import { shortenLimiter } from '../middleware/rateLimiter';

const router = Router();
router.post('/shorten', shortenLimiter, shortenUrl);

export default router;