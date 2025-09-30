import { PrismaClient } from '@prisma/client';
import { PrismaDataGateway } from '../infrastructure/prisma/PrismaDataGateway.js';
import { CreateItemUseCase } from '../usecases/items/CreateItem.js';
import { DeleteItemUseCase } from '../usecases/items/DeleteItem.js';
import { GetItemUseCase } from '../usecases/items/GetItem.js';
import { ListItemsUseCase } from '../usecases/items/ListItems.js';
import { UpdateItemUseCase } from '../usecases/items/UpdateItem.js';

export type AppContainer = ReturnType<typeof buildContainer>;

export function buildContainer() {
  const prisma = new PrismaClient();
  const dataGateway = new PrismaDataGateway(prisma);

  const usecases = {
    createItem: new CreateItemUseCase(dataGateway),
    listItems: new ListItemsUseCase(dataGateway),
    getItem: new GetItemUseCase(dataGateway),
    updateItem: new UpdateItemUseCase(dataGateway),
    deleteItem: new DeleteItemUseCase(dataGateway),
  } as const;

  return {
    prisma,
    gateways: { dataGateway },
    usecases,
  };
}

