import { CreateItemInput, Item } from '../../domain/entities/Item.js';
import type { DataGateway } from '../../domain/gateways/DataGateway.js';

export class CreateItemUseCase {
  constructor(private readonly dataGateway: DataGateway) {}

  async execute(input: CreateItemInput): Promise<Item> {
    return this.dataGateway.insertItem(input);
  }
}

