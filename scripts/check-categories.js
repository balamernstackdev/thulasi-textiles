
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.category.findMany({
        where: { parentId: null },
        include: {
            _count: {
                select: { products: true }
            },
            children: {
                include: {
                    _count: {
                        select: { products: true }
                    }
                }
            }
        }
    });
    fs.writeFileSync('scripts/category_counts.json', JSON.stringify(categories, null, 2), 'utf-8');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
