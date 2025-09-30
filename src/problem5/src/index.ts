import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import { buildContainer } from './app/container.js';
import { initItemsRouter } from './routes/items.js';

const app: express.Express = express();
const container = buildContainer();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req: express.Request, res: express.Response) => {
  res.json({ status: 'ok' });
});

app.use('/items', initItemsRouter(container));

// Not found handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = err instanceof Error ? err.message : 'Unknown error';
  res.status(500).json({ error: message });
});

export const server = app;

const PORT = Number(process.env.PORT || 3000);
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}


