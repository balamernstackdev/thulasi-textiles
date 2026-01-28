
import prismadb from './src/lib/prisma';
import * as fs from 'fs';

async function test() {
    const products = await prismadb.product.findMany({
        take: 5,
        include: { images: true, category: true }
    });

    fs.writeFileSync('debug-prismadb.json', JSON.stringify(products, null, 2));
}

test().then(() => prismadb.$disconnect());
