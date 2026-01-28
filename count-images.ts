
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const count = await prisma.productImage.count();
    const productCount = await prisma.product.count();
    console.log(`Product Images: ${count}`);
    console.log(`Products: ${productCount}`);
}

check().then(() => prisma.$disconnect());
