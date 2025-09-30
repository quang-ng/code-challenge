import { CreateItemInput, Item, ListItemsFilters, UpdateItemInput } from '../entities/Item.js';

export interface DataGateway {
  insertItem(data: CreateItemInput): Promise<Item>;
  getItemById(id: number): Promise<Item | null>;
  updateItem(id: number, data: UpdateItemInput): Promise<Item | null>;
  deleteItem(id: number): Promise<boolean>;
  listItems(filters: ListItemsFilters): Promise<{ total: number; items: Item[] }>;
}

