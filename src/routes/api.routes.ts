import { Router } from 'express';
import { shortenUrl, getUrls, removeUrl } from '../controllers/url.controller';
import { shortenLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';

const router = Router();
router.post('/shorten', shortenLimiter, authenticate, shortenUrl);
router.get('/urls', authenticate, getUrls);
router.delete('/urls/:code', authenticate, removeUrl);

export default router;