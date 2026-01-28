
import prismadb from './src/lib/prisma';
import * as fs from 'fs';

async function test() {
    const products = await prismadb.product.findMany({
        where: {
            category: {
                name: "Boys Clothing"
            }
        },
        include: { images: true, category: true }
    });

    fs.writeFileSync('debug-kids.json', JSON.stringify(products, null, 2));
}

test().then(() => prismadb.$disconnect());
