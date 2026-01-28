
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
const prisma = new PrismaClient();

async function dump() {
    const products = await prisma.product.findMany({
        take: 5,
        include: { images: true }
    });

    fs.writeFileSync('product-dump.json', JSON.stringify(products, null, 2));
    console.log("Dumped to product-dump.json");
}

dump().then(() => prisma.$disconnect());
