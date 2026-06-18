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


 export async function createShortUrl(longUrl: string, userId: number): Promise<string> {
  const nextValResult = await pool.query("SELECT nextval('urls_id_seq') AS id");
  const id = parseInt(nextValResult.rows[0].id, 10);
  const shortCode = encodeBase62(id);

  await pool.query(
    'INSERT INTO urls (id, short_code, long_url, user_id) VALUES ($1, $2, $3, $4)',
    [id, shortCode, longUrl, userId]
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

  export async function incrementClickCount(shortCode: string): Promise<void> {
  await pool.query(
    'UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1',
    [shortCode]
  );
}
export async function getUserUrls(userId: number) {
  const result = await pool.query(
    'SELECT short_code, long_url, click_count, created_at FROM urls WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

export async function deleteUrl(shortCode: string, userId: number): Promise<boolean> {
  const result = await pool.query(
    'DELETE FROM urls WHERE short_code = $1 AND user_id = $2',
    [shortCode, userId]
  );
  // Also remove from Redis cache
  await redisClient.del(shortCode);
  return result.rowCount! > 0;
}