
import prismadb from './src/lib/prisma';
import * as fs from 'fs';

async function test() {
    const products = await prismadb.product.findMany({
        where: {
            category: {
                name: "Cushion Covers"
            }
        },
        include: { images: true, category: true }
    });

    fs.writeFileSync('debug-home-linen.json', JSON.stringify(products, null, 2));
}

test().then(() => prismadb.$disconnect());
