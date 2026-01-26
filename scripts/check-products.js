
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({
        include: {
            category: true
        }
    });
    fs.writeFileSync('scripts/products_check.json', JSON.stringify(products, null, 2), 'utf-8');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
