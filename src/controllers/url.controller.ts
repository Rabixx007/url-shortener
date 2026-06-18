import { Request, Response } from 'express';
import { createShortUrl, getLongUrl, incrementClickCount, getUserUrls, deleteUrl } from '../services/url.service'; import { AuthRequest } from '../middleware/auth';
import validator from 'validator';

export async function shortenUrl(req: AuthRequest, res: Response) {
  const { longUrl } = req.body;
  const userId = req.userId!;

  if (!longUrl) {
    res.status(400).json({ error: 'longUrl is required' });
    return;
  }
  if (!validator.isURL(longUrl, { require_protocol: true })) {
    res.status(400).json({ error: 'Invalid URL. Must include http:// or https://' });
    return;
  }

  try {
    const shortCode = await createShortUrl(longUrl, userId);
    res.status(201).json({
      shortUrl: `http://localhost:3000/${shortCode}`
    });
  } catch (err) {
    console.error('FULL ERROR:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(500).json({ error: 'Internal server error' });
  }
}

// export async function redirectUrl(req: Request, res: Response) {
// const { code } = req.params as { code: string };
//   try {
//     const longUrl = await getLongUrl(code);

//     if (!longUrl) {
//       res.status(404).json({ error: 'Short URL not found' });
//       return;
//     }

//     res.redirect(302, longUrl);
//   } catch (err) {
//     console.error('REDIRECT ERROR:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }
export async function redirectUrl(req: Request, res: Response) {
  const { code } = req.params as { code: string };
  try {
    const longUrl = await getLongUrl(code);

    if (!longUrl) {
      res.status(404).json({ error: 'Short URL not found' });
      return;
    }

    await incrementClickCount(code);
    res.redirect(302, longUrl);
  } catch (err) {
    console.error('REDIRECT ERROR:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(500).json({ error: 'Internal server error' });
  }
}
export async function getUrls(req: AuthRequest, res: Response) {
  try {
    const urls = await getUserUrls(req.userId!);
    res.json({ urls });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function removeUrl(req: AuthRequest, res: Response) {
  const { code } = req.params as { code: string };

  try {
    const deleted = await deleteUrl(code, req.userId!);
    if (!deleted) {
      res.status(404).json({ error: 'URL not found or not yours' });
      return;
    }
    res.json({ message: 'URL deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}