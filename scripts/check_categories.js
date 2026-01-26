
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.category.count();
        console.log(`Total categories: ${count}`);

        const rootCategories = await prisma.category.findMany({
            where: { parentId: null },
            include: { children: true }
        });
        console.log(`Root categories: ${rootCategories.length}`);
        console.log(JSON.stringify(rootCategories, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
