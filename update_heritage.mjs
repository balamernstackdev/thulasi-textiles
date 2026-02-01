import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const fabrics = ['Kanchipuram Silk', 'Chanderi Cotton', 'Maheshwari Silk', 'Organza', 'Cotton Silk', 'Linen', 'Pure Cotton', 'Georgette'];
const origins = ['Tamil Nadu', 'Madhya Pradesh', 'West Bengal', 'Uttar Pradesh', 'Rajasthan', 'Gujarat'];
const weaves = ['Hand-Woven', 'Jacquard', 'Embroidery', 'Block Print', 'Jamdani', 'Banarasi'];

async function main() {
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { fabric: null },
                { origin: null },
                { weave: null }
            ]
        }
    });

    console.log(`Updating ${products.length} products...`);

    for (const product of products) {
        const productFabric = fabrics[Math.floor(Math.random() * fabrics.length)];
        const productOrigin = origins[Math.floor(Math.random() * origins.length)];
        const productWeave = weaves[Math.floor(Math.random() * weaves.length)];

        await prisma.product.update({
            where: { id: product.id },
            data: {
                fabric: productFabric,
                origin: productOrigin,
                weave: productWeave,
                occasion: 'Festive & Occasion Wear',
                artisanStory: `A masterpiece from ${productOrigin}, meticulously handcrafted using traditional techniques.`,
                careInstructions: "Professional Dry Clean Only",
                loomType: "Traditional Handloom",
                weavingHours: 72
            }
        });
    }

    console.log('Update complete!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
