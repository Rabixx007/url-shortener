import { Router } from 'express';
import { shortenUrl } from '../controllers/url.controller';

const router = Router();
router.post('/shorten', shortenUrl);
export default router;