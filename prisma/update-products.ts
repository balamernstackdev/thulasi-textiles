
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Updating 5 premium products...');

    const premiumProducts = [
        {
            name: "Emerald Green Banarasi Silk Saree",
            slug: "premium-banarasi-silk-saree",
            description: "A luxurious deep emerald green Banarasi silk saree with intricate gold zari work. Perfectly handwoven by master artisans for your special occasions.",
            basePrice: 15999,
            categorySlug: "women-sarees",
            imageUrl: "/products/saree-banarasi.png",
            isBestSeller: true,
            isFeatured: true
        },
        {
            name: "Artisan White Linen Kurta",
            slug: "premium-linen-kurta",
            description: "A high-quality white linen kurta with exquisite hand-stitched detailing on the collar. Breathable, elegant, and perfect for summer festivities.",
            basePrice: 3499,
            categorySlug: "men-ethnic-wear",
            imageUrl: "/products/kurta-linen.png",
            isBestSeller: false,
            isFeatured: true
        },
        {
            name: "Hand-Blocked Indigo Cotton Bedsheet",
            slug: "premium-indigo-bedsheet",
            description: "Premium hand-blocked cotton bedsheet featuring sophisticated indigo blue floral motifs. Adds a touch of heritage and serenity to your bedroom.",
            basePrice: 2499,
            categorySlug: "home-linen-bedsheets",
            imageUrl: "/products/bedsheet-artisan.png",
            isBestSeller: true,
            isFeatured: false
        },
        {
            name: "Ultra-Plush Sage Green Spa Towels",
            slug: "premium-spa-towels",
            description: "Thick, ultra-plush cotton towels in a calming sage green. Designed for superior absorption and a soft, spa-like feel in your bathroom.",
            basePrice: 1299,
            categorySlug: "home-linen-towels",
            imageUrl: "/products/towels-plush.png",
            isBestSeller: false,
            isFeatured: false
        },
        {
            name: "Hand-Embroidered Luxury Linen Curtains",
            slug: "premium-linen-curtains",
            description: "Heavy linen curtains in warm beige with delicate hand-embroidered borders. Elevates your living space with a sophisticated lifestyle aesthetic.",
            basePrice: 4999,
            categorySlug: "home-linen-curtains",
            imageUrl: "/products/curtains-luxury.png",
            isBestSeller: true,
            isFeatured: true
        }
    ];

    for (const p of premiumProducts) {
        const category = await prisma.category.findUnique({
            where: { slug: p.categorySlug }
        });

        if (!category) {
            console.warn(`Category not found: ${p.categorySlug}. Skipping product ${p.name}`);
            continue;
        }

        const product = await prisma.product.upsert({
            where: { slug: p.slug },
            update: {
                name: p.name,
                description: p.description,
                basePrice: p.basePrice,
                categoryId: category.id,
                isBestSeller: p.isBestSeller,
                isFeatured: p.isFeatured,
                isActive: true,
                images: {
                    deleteMany: {},
                    create: [{ url: p.imageUrl, isPrimary: true, altText: p.name }]
                }
            },
            create: {
                name: p.name,
                slug: p.slug,
                description: p.description,
                basePrice: p.basePrice,
                categoryId: category.id,
                isBestSeller: p.isBestSeller,
                isFeatured: p.isFeatured,
                isActive: true,
                images: {
                    create: [{ url: p.imageUrl, isPrimary: true, altText: p.name }]
                },
                variants: {
                    create: [
                        { sku: `${p.slug.toUpperCase()}-FREE`, size: 'Free Size', stock: 50, price: p.basePrice }
                    ]
                }
            } as any
        });
        console.log(`Updated product: ${product.name}`);
    }

    console.log('Premium products updated successfully!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
