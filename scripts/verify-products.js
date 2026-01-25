
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const category = await prisma.category.findFirst({
        where: { name: 'Kids' },
        include: {
            products: true
        }
    });

    if (!category) {
        console.log('Category Kids not found');
        return;
    }

    console.log(`Category: ${category.name} (ID: ${category.id})`);
    console.log(`Product Count: ${category.products.length}`);
    console.log('Products:', category.products.map(p => p.name));
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
