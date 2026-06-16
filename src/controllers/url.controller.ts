import { Request, Response } from 'express';
import { createShortUrl , getLongUrl} from '../services/url.service';

export async function shortenUrl(req: Request, res: Response) {
  console.log('REQUEST RECEIVED', req.body);
  const { longUrl } = req.body;

  if (!longUrl) {
    res.status(400).json({ error: 'longUrl is required' });
    return;
  }

  try {
    const shortCode = await createShortUrl(longUrl);
    res.status(201).json({
      shortUrl: `http://localhost:3000/${shortCode}`
    });
  }  catch (err) {
  console.error('FULL ERROR:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
  res.status(500).json({ error: 'Internal server error' });
}
}

export async function redirectUrl(req: Request, res: Response) {
const { code } = req.params as { code: string };
  try {
    const longUrl = await getLongUrl(code);

    if (!longUrl) {
      res.status(404).json({ error: 'Short URL not found' });
      return;
    }

    res.redirect(302, longUrl);
  } catch (err) {
    console.error('REDIRECT ERROR:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(500).json({ error: 'Internal server error' });
  }
}