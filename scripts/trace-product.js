
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const product = await prisma.product.findFirst({
        where: { name: { contains: 'Kids School Uniforms' } },
        include: { category: true }
    });

    if (product) {
        console.log('Product Found: ' + product.name);
        console.log('Category Name: ' + product.category.name);
        console.log('Category ID: ' + product.category.id);
    } else {
        console.log('Product not found');
    }
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
