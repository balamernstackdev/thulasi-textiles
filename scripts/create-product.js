
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const category = await prisma.category.findFirst({
        where: { name: 'Kids' }
    });

    if (!category) {
        console.error('Category Kids not found');
        return;
    }
    const categoryId = category.id;

    // Create "Kids Party Wear Set"
    const product = await prisma.product.create({
        data: {
            name: 'Kids Party Wear Set',
            slug: 'kids-party-wear-set-' + Date.now(),
            description: 'Elegant and comfortable party wear set for kids. Perfect for special occasions.',
            basePrice: 1599.00,
            categoryId: categoryId,
            isFeatured: true,
            isActive: true,
            isBestSeller: true, // Mark as bestseller so it might appear in other sections too
            images: {
                create: [
                    {
                        url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=1000&auto=format&fit=crop', // Kids clothing placeholder
                        isPrimary: true,
                        altText: 'Kids Party Wear Set'
                    }
                ]
            },
            variants: {
                create: [
                    { sku: 'KIDS-PW-S', size: 'S', price: 1599, stock: 10 },
                    { sku: 'KIDS-PW-M', size: 'M', price: 1699, stock: 15 },
                    { sku: 'KIDS-PW-L', size: 'L', price: 1799, stock: 5 }
                ]
            }
        }
    });

    console.log('Created Product:', product.name);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
