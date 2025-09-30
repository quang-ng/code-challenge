import { Item, UpdateItemInput } from '../../domain/entities/Item.js';
import type { DataGateway } from '../../domain/gateways/DataGateway.js';

export class UpdateItemUseCase {
  constructor(private readonly dataGateway: DataGateway) {}

  async execute(id: number, input: UpdateItemInput): Promise<Item | null> {
    return this.dataGateway.updateItem(id, input);
  }
}

