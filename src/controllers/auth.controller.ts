import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';

export async function register(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  try {
    await registerUser(username, password);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err: any) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'Username already taken' });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  try {
    const token = await loginUser(username, password);
    if (!token) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}