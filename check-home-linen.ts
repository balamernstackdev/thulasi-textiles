
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const products = await prisma.product.findMany({
        where: {
            category: {
                name: "Cushion Covers"
            }
        },
        include: { images: true, category: true }
    });

    console.log(JSON.stringify(products, null, 2));
}

check().then(() => prisma.$disconnect());
