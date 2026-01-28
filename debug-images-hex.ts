
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const images = await prisma.productImage.findMany({
        take: 10,
        select: { url: true, product: { select: { name: true } } }
    });

    console.log("RAW IMAGE DATA:");
    images.forEach(img => {
        console.log(`Product: "${img.product.name}" | URL: "${img.url}" | Hex: ${Buffer.from(img.url).toString('hex')}`);
    });
}

check().then(() => prisma.$disconnect());
