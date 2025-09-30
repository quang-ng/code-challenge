import request from 'supertest';
import { prisma } from '../src/db';
import { server } from '../src/index';

beforeAll(async () => {
  await prisma.$connect();
  await prisma.item.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Items API', () => {
  let createdId: number;

  it('health returns ok', async () => {
    const res = await request(server).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('creates an item', async () => {
    const res = await request(server)
      .post('/items')
      .send({ name: 'Test', description: 'Desc', tags: ['a', 'b'] });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test');
    expect(res.body.tags).toEqual(['a', 'b']);
    createdId = res.body.id;
  });

  it('lists items', async () => {
    const res = await request(server).get('/items?limit=5');
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it('gets item by id', async () => {
    const res = await request(server).get(`/items/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdId);
  });

  it('updates an item', async () => {
    const res = await request(server)
      .put(`/items/${createdId}`)
      .send({ description: 'Updated', tags: ['x'] });
    expect(res.status).toBe(200);
    expect(res.body.description).toBe('Updated');
    expect(res.body.tags).toEqual(['x']);
  });

  it('deletes an item', async () => {
    const res = await request(server).delete(`/items/${createdId}`);
    expect(res.status).toBe(204);
  });
});


