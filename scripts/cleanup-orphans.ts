
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting cleanup of orphaned product variants...");

    // Get all variant IDs that point to non-existent products
    const variants = await prisma.productVariant.findMany({
        select: {
            id: true,
            productId: true,
        }
    });

    const products = await prisma.product.findMany({
        select: { id: true }
    });
    const productIds = new Set(products.map(p => p.id));

    const orphanedIds = variants
        .filter(v => !productIds.has(v.productId))
        .map(v => v.id);

    if (orphanedIds.length === 0) {
        console.log("No orphaned variants found. Database is clean.");
        return;
    }

    console.log(`Found ${orphanedIds.length} orphaned variants. Deleting...`);

    const deleteResult = await prisma.productVariant.deleteMany({
        where: {
            id: { in: orphanedIds }
        }
    });

    console.log(`Successfully deleted ${deleteResult.count} orphaned variants.`);
}

main()
    .catch(e => {
        console.error("Cleanup failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
