import express from 'express';
import dotenv from 'dotenv';
import { connectRedis } from './config/redis';
import apiRoutes from './routes/api.routes';
import redirectRoutes from './routes/redirect.routes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', apiRoutes);
app.use('/', redirectRoutes);


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
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

start();