
import prismadb from './src/lib/prisma';

async function test() {
    const products = await prismadb.product.findMany({
        take: 5,
        include: { images: true }
    });

    console.log("PRODUCTS FROM prismadb:");
    console.log(JSON.stringify(products, null, 2));
}

test().then(() => prismadb.$disconnect());
