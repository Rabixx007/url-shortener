import express from 'express';
import dotenv from 'dotenv';
import { connectRedis } from './config/redis';
import urlRoutes from './routes/url.routes';

dotenv.config();
console.log('SERVER STARTING');

const app = express();
app.use(express.json());

app.use('/api', urlRoutes);

app.post('/test', (req, res) => {
  console.log('TEST HIT', req.body);
  res.json({ ok: true });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectRedis();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();