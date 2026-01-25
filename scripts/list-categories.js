
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.category.findMany({
        where: { name: { contains: 'Kid' } },
        include: {
            _count: {
                select: { products: true }
            }
        }
    });

    console.log('Categories found:', categories);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
