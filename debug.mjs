import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const total = await prisma.product.count();
    const active = await prisma.product.count({ where: { isActive: true } });
    const categories = await prisma.category.findMany({
        include: { _count: { select: { products: true } } }
    });

    console.log('--- PRODUCT SUMMARY ---');
    console.log(`Total Products: ${total}`);
    console.log(`Active Products: ${active}`);
    console.log('\n--- CATEGORY SUMMARY ---');
    categories.forEach(c => {
        console.log(`${c.name} (${c.slug}): ${c._count.products} products`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
