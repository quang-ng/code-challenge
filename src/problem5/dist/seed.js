"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.item.deleteMany();
    await prisma.item.createMany({
        data: [
            { name: 'Sample Item 1', description: 'First seed item', tags: JSON.stringify(['demo', 'test']) },
            { name: 'Sample Item 2', description: 'Second seed item', tags: JSON.stringify(['demo']) },
            { name: 'Another Thing', description: null, tags: JSON.stringify(['other']) },
        ],
    });
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
