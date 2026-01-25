
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.category.findMany({
        where: { name: 'Kids' },
        select: { id: true, name: true, _count: { select: { products: true } } }
    });
    console.log(JSON.stringify(categories, null, 2));
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
