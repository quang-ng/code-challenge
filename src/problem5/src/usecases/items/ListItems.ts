import { Item, ListItemsFilters } from '../../domain/entities/Item.js';
import type { DataGateway } from '../../domain/gateways/DataGateway.js';

export class ListItemsUseCase {
  constructor(private readonly dataGateway: DataGateway) {}

  async execute(filters: ListItemsFilters): Promise<{ total: number; items: Item[] }> {
    return this.dataGateway.listItems(filters);
  }
}

