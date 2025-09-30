import { Item } from '../../domain/entities/Item.js';
import type { DataGateway } from '../../domain/gateways/DataGateway.js';

export class GetItemUseCase {
  constructor(private readonly dataGateway: DataGateway) {}

  async execute(id: number): Promise<Item | null> {
    return this.dataGateway.getItemById(id);
  }
}

