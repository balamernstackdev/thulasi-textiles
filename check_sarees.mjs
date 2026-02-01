import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({
        where: { category: { slug: 'women-sarees' } },
        include: { images: true, category: true }
    });

    products.forEach(p => {
        console.log(`Product: ${p.name}`);
        console.log(`Category: ${p.category.name}`);
        console.log(`Image: ${p.images[0]?.url}`);
        console.log('---');
    });
}

main().finally(() => prisma.$disconnect());
