
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning up orphan ProductImages...');
    // Initialize connection
    await prisma.$connect();

    const images = await prisma.productImage.findMany({
        select: { id: true, productId: true }
    });
    const products = await prisma.product.findMany({
        select: { id: true }
    });
    const productIds = new Set(products.map(p => p.id));

    const orphanIds = images.filter(img => !productIds.has(img.productId)).map(img => img.id);

    if (orphanIds.length > 0) {
        console.log(`Found ${orphanIds.length} orphan images. Deleting...`);
        await prisma.productImage.deleteMany({
            where: { id: { in: orphanIds } }
        });
        console.log('Deleted orphan images.');
    } else {
        console.log('No orphan images found.');
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
