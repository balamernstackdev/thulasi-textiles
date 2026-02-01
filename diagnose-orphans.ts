
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const variants = await prisma.productVariant.findMany({
        select: {
            id: true,
            sku: true,
            productId: true,
        }
    });

    const productIds = await prisma.product.findMany({
        select: { id: true }
    }).then(ps => new Set(ps.map(p => p.id)));

    const orphaned = variants.filter(v => !productIds.has(v.productId));

    if (orphaned.length === 0) {
        console.log("No orphaned variants found.");
    } else {
        console.log(`Found ${orphaned.length} orphaned variants:`);
        console.table(orphaned);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
