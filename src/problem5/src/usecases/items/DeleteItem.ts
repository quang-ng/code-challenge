import type { DataGateway } from '../../domain/gateways/DataGateway.js';

export class DeleteItemUseCase {
  constructor(private readonly dataGateway: DataGateway) {}

  async execute(id: number): Promise<boolean> {
    return this.dataGateway.deleteItem(id);
  }
}

