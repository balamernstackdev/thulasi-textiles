
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const kidCategory = await prisma.category.findFirst({
        where: {
            OR: [
                { name: { contains: 'Kid' } },
                { slug: { contains: 'kid' } }
            ]
        }
    });
    if (kidCategory) {
        console.log('ID:' + kidCategory.id);
    } else {
        console.log('Kids category not found');
    }
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
