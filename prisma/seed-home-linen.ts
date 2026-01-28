
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding 10 new home linen products...');

    // Find subcategories for Home Linen
    const bedsheetsCategory = await prisma.category.findUnique({ where: { slug: 'home-linen-bedsheets' } });
    const curtainsCategory = await prisma.category.findUnique({ where: { slug: 'home-linen-curtains' } });
    const cushionsCategory = await prisma.category.findUnique({ where: { slug: 'home-linen-cushion-covers' } });
    const towelsCategory = await prisma.category.findUnique({ where: { slug: 'home-linen-towels' } }); // Fallback for variety

    if (!bedsheetsCategory || !curtainsCategory || !cushionsCategory) {
        throw new Error('Home Linen subcategories not found. Please run the main seed script first.');
    }

    const products = [
        // 1. Floral Bedsheet
        {
            name: 'Premium Cotton Floral Double Bedsheet',
            description: 'Experience luxury with our premium cotton double bedsheet featuring an elegant floral print. Soft, breathable, and durable.',
            basePrice: 2499,
            categoryId: bedsheetsCategory.id,
            image: '/images/products/home-linen/bedsheet-floral.png',
            slugPrefix: 'bedsheet-floral',
            variants: [
                { size: 'Queen', stock: 10 },
                { size: 'King', stock: 8 }
            ]
        },
        // 2. Geometric Bedsheet
        {
            name: 'Modern Geometric Blue Bedsheet',
            description: 'Add a touch of modern style to your bedroom with this crisp blue and white geometric print bedsheet. 100% cotton for comfort.',
            basePrice: 2199,
            categoryId: bedsheetsCategory.id,
            image: '/images/products/home-linen/bedsheet-geometric.png',
            slugPrefix: 'bedsheet-geometric',
            variants: [
                { size: 'Queen', stock: 15 },
                { size: 'King', stock: 12 }
            ]
        },
        // 3. Gold Cushion Cover
        {
            name: 'Luxury Silk Gold Cushion Cover',
            description: 'Elevate your living space with this exquisite gold silk cushion cover featuring intricate embroidery. Perfect for festive decor.',
            basePrice: 899,
            categoryId: cushionsCategory.id,
            image: '/images/products/home-linen/cushion-gold.png',
            slugPrefix: 'cushion-gold',
            variants: [
                { size: '16x16', stock: 20 },
                { size: '18x18', stock: 15 }
            ]
        },
        // 4. Floral Bedsheet Var 2 (Reuse Img 1)
        {
            name: 'Vintage Rose Cotton Bedsheet Set',
            description: 'Classical vintage rose patterns on refined cotton. This set brings a timeless elegance to any bedroom.',
            basePrice: 2699,
            categoryId: bedsheetsCategory.id,
            image: '/images/products/home-linen/bedsheet-floral.png',
            slugPrefix: 'bedsheet-vintage-rose',
            variants: [
                { size: 'Queen', stock: 5 },
                { size: 'King', stock: 5 }
            ]
        },
        // 5. Geometric Bedsheet Var 2 (Reuse Img 2)
        {
            name: 'Azure Mosaic Bedsheet Collection',
            description: 'Inspired by mosaic art, this azure blue bedsheet offers a bold statement piece for your home.',
            basePrice: 2299,
            categoryId: bedsheetsCategory.id,
            image: '/images/products/home-linen/bedsheet-geometric.png',
            slugPrefix: 'bedsheet-azure-mosaic',
            variants: [
                { size: 'Queen', stock: 12 },
                { size: 'King', stock: 10 }
            ]
        },
        // 6. Gold Cushion Var 2 (Reuse Img 3)
        {
            name: 'Royal Heritage Silk Cushion',
            description: 'Handcrafted with precision, this royal heritage silk cushion cover adds a golden glow to your sofa.',
            basePrice: 999,
            categoryId: cushionsCategory.id,
            image: '/images/products/home-linen/cushion-gold.png',
            slugPrefix: 'cushion-royal-heritage',
            variants: [
                { size: '16x16', stock: 10 },
                { size: '18x18', stock: 8 }
            ]
        },
        // 7. Pseudo Curtain (Reuse Geometric for pattern)
        {
            name: 'Geometric Print Cotton Curtains',
            description: 'Stylish cotton curtains with a modern geometric pattern. Filters light beautifully while maintaining privacy.',
            basePrice: 1599,
            categoryId: curtainsCategory.id,
            image: '/images/products/home-linen/bedsheet-geometric.png', // Reusing geometric pattern image
            slugPrefix: 'curtains-geometric',
            variants: [
                { size: '5ft', stock: 20 },
                { size: '7ft', stock: 15 },
                { size: '9ft', stock: 10 }
            ]
        },
        // 8. Pseudo Cushion Floral (Reuse Floral for pattern)
        {
            name: 'Floral Print Accent Cushion',
            description: 'Soft floral print cushion cover to match your bedding. Made from high-quality canvas cotton.',
            basePrice: 499,
            categoryId: cushionsCategory.id,
            image: '/images/products/home-linen/bedsheet-floral.png', // Reusing floral pattern image
            slugPrefix: 'cushion-floral-accent',
            variants: [
                { size: '16x16', stock: 25 },
                { size: '18x18', stock: 20 }
            ]
        },
        // 9. Towel Set (Reuse Geometric/Solid logic placeholder - reuse Blue Geometric as abstract towel)
        {
            name: 'Abstract Blue Bath Towel',
            description: 'Super absorbent bath towel with a unique abstract blue pattern. Quick-drying and soft on skin.',
            basePrice: 799,
            categoryId: towelsCategory ? towelsCategory.id : bedsheetsCategory.id,
            image: '/images/products/home-linen/bedsheet-geometric.png',
            slugPrefix: 'towel-abstract-blue',
            variants: [
                { size: 'Hand Towel', stock: 30 },
                { size: 'Bath Towel', stock: 20 }
            ]
        },
        // 10. Gold Festive Runner (Reuse Gold Cushion)
        {
            name: 'Festive Gold Table Runner',
            description: 'A stunning gold table runner to complement your special dinners. Matches perfectly with our gold cushion covers.',
            basePrice: 1299,
            categoryId: bedsheetsCategory.id, // Using bedsheets/linen generalized category
            image: '/images/products/home-linen/cushion-gold.png',
            slugPrefix: 'runner-festive-gold',
            variants: [
                { size: '4 Seater', stock: 8 },
                { size: '6 Seater', stock: 6 }
            ]
        }
    ];

    for (const p of products) {
        const slug = `${p.slugPrefix}-${Date.now()}`;
        console.log(`Creating product: ${p.name}...`);

        await prisma.product.create({
            data: {
                name: p.name,
                slug: slug,
                description: p.description,
                basePrice: p.basePrice,
                categoryId: p.categoryId,
                isActive: true,
                isNew: true,
                images: {
                    create: [
                        {
                            url: p.image,
                            altText: p.name,
                            isPrimary: true
                        }
                    ]
                },
                variants: {
                    create: p.variants.map(v => ({
                        sku: `${p.slugPrefix.toUpperCase()}-${v.size}-${Date.now()}`.replace(/\s+/g, '-'),
                        size: v.size,
                        stock: v.stock,
                        price: p.basePrice
                    }))
                }
            }
        });
    }

    console.log('Seeding completed successfully!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('Seed Error:', e.message);
        await prisma.$disconnect();
        process.exit(1);
    });
