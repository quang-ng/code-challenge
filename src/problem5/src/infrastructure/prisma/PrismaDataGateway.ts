import { PrismaClient } from '@prisma/client';
import { CreateItemInput, Item, ListItemsFilters, UpdateItemInput } from '../../domain/entities/Item.js';
import type { DataGateway } from '../../domain/gateways/DataGateway.js';

export class PrismaDataGateway implements DataGateway {
  constructor(private readonly prisma: PrismaClient) {}

  async insertItem(data: CreateItemInput): Promise<Item> {
    const created = await this.prisma.item.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        tags: JSON.stringify(data.tags ?? []),
      },
    });
    return mapRowToItem(created);
  }

  async getItemById(id: number): Promise<Item | null> {
    const row = await this.prisma.item.findUnique({ where: { id } });
    return row ? mapRowToItem(row) : null;
  }

  async updateItem(id: number, data: UpdateItemInput): Promise<Item | null> {
    const existing = await this.prisma.item.findUnique({ where: { id } });
    if (!existing) return null;
    const updated = await this.prisma.item.update({
      where: { id },
      data: {
        name: data.name ?? (existing as any).name,
        description: data.description === undefined ? (existing as any).description : data.description,
        tags: data.tags === undefined ? (existing as any).tags : JSON.stringify(data.tags),
      },
    });
    return mapRowToItem(updated);
  }

  async deleteItem(id: number): Promise<boolean> {
    try {
      await this.prisma.item.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async listItems(filters: ListItemsFilters): Promise<{ total: number; items: Item[] }> {
    const where: any = {};
    if (filters.q) {
      where.name = { contains: filters.q, mode: 'insensitive' };
    }
    if (filters.createdAfter || filters.createdBefore) {
      where.createdAt = {} as any;
      if (filters.createdAfter) (where.createdAt as any).gt = new Date(filters.createdAfter);
      if (filters.createdBefore) (where.createdAt as any).lt = new Date(filters.createdBefore);
    }
    if (filters.tag) {
      where.tags = { contains: `"${filters.tag}"` };
    }
    const limit = Math.min(Math.max(filters.limit ?? 20, 1), 100);
    const offset = Math.max(filters.offset ?? 0, 0);
    const [total, rows] = await Promise.all([
      this.prisma.item.count({ where }),
      this.prisma.item.findMany({ where, orderBy: { createdAt: 'desc' }, take: limit, skip: offset }),
    ]);
    return { total, items: rows.map(mapRowToItem) };
  }
}

function mapRowToItem(row: any): Item {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? null,
    tags: JSON.parse(row.tags ?? '[]'),
    createdAt: new Date(row.createdAt).toISOString(),
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}

