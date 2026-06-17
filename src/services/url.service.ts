import { pool } from '../config/db';
import { redisClient } from '../config/redis';


const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function encodeBase62(num: number): string {
  let result = '';
  while (num > 0) {
    result = BASE62[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}


export async function createShortUrl(longUrl: string): Promise<string> {
  const nextValResult = await pool.query("SELECT nextval('urls_id_seq') AS id");
  const id = parseInt(nextValResult.rows[0].id, 10);
  const shortCode = encodeBase62(id);

  await pool.query(
    'INSERT INTO urls (id, short_code, long_url) VALUES ($1, $2, $3)',
    [id, shortCode, longUrl]
  );

  return shortCode;
}

export async function getLongUrl(shortCode: string): Promise<string | null> {
  // Check Redis first
  const cached = await redisClient.get(shortCode);
  if (cached) {
    console.log('Cache hit');
    return cached;
  }

  // Cache miss — query PostgreSQL
  const result = await pool.query(
    'SELECT long_url FROM urls WHERE short_code = $1',
    [shortCode]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const longUrl = result.rows[0].long_url;

  // Store in Redis for next time
  await redisClient.set(shortCode, longUrl, { EX: 3600 });

  console.log('Cache miss — stored in Redis');
  return longUrl;
}