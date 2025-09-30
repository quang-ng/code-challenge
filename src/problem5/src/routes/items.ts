import { Request, Response, Router } from 'express';
import { z } from 'zod';
import type { AppContainer } from '../app/container.js';

export const itemsRouter = Router();
let container: AppContainer | null = null;
export function initItemsRouter(c: AppContainer) {
  container = c;
  return itemsRouter;
}

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().max(10_000).nullable().optional(),
  tags: z.array(z.string()).max(50).optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().max(10_000).nullable().optional(),
  tags: z.array(z.string()).max(50).optional(),
});

// Types for request bodies, params, and queries
export type CreateItemBody = z.infer<typeof createSchema>;
export type UpdateItemBody = z.infer<typeof updateSchema>;
export type IdParam = { id: string };
export type ListItemsQuery = {
  q?: string;
  createdBefore?: string;
  createdAfter?: string;
  limit?: string;
  offset?: string;
  tag?: string;
};

// Create
itemsRouter.post('/', async (req: Request<unknown, unknown, CreateItemBody>, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const item = await container!.usecases.createItem.execute(parsed.data);
  res.status(201).json(item);
});

// List with filters
itemsRouter.get('/', async (req: Request<unknown, unknown, unknown, ListItemsQuery>, res: Response) => {
  const { q, createdBefore, createdAfter, limit, offset, tag } = req.query;
  const result = await container!.usecases.listItems.execute({
    q: typeof q === 'string' ? q : undefined,
    createdBefore: typeof createdBefore === 'string' ? createdBefore : undefined,
    createdAfter: typeof createdAfter === 'string' ? createdAfter : undefined,
    limit: typeof limit === 'string' ? Number(limit) : undefined,
    offset: typeof offset === 'string' ? Number(offset) : undefined,
    tag: typeof tag === 'string' ? tag : undefined,
  });
  res.json(result);
});

// Get by id
itemsRouter.get('/:id', async (req: Request<IdParam>, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  const item = await container!.usecases.getItem.execute(id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// Update
itemsRouter.put('/:id', async (req: Request<IdParam, unknown, UpdateItemBody>, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const item = await container!.usecases.updateItem.execute(id, parsed.data);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// Delete
itemsRouter.delete('/:id', async (req: Request<IdParam>, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  const ok = await container!.usecases.deleteItem.execute(id);
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});


