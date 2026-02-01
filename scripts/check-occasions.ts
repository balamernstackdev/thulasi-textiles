import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({
        select: { occasion: true },
        distinct: ['occasion']
    });
    console.log('Unique Occasions:', products.map(p => p.occasion).filter(Boolean));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
