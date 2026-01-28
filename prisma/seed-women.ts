
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding 10 new women products...');

    // Find subcategories for Women
    const sareeCategory = await prisma.category.findUnique({ where: { slug: 'women-sarees' } });
    const kurtaCategory = await prisma.category.findUnique({ where: { slug: 'women-kurtas-and-kurtis' } });
    const lehengaCategory = await prisma.category.findUnique({ where: { slug: 'women-lehengas' } });
    const jeansCategory = await prisma.category.findUnique({ where: { slug: 'women-jeans-and-jeggings' } });
    const topsCategory = await prisma.category.findUnique({ where: { slug: 'women-tops-and-tees' } });
    const lingerieCategory = await prisma.category.findUnique({ where: { slug: 'women-lingerie' } });

    if (!sareeCategory || !kurtaCategory || !lehengaCategory) {
        throw new Error('Women subcategories (Sarees/Kurtas/Lehengas) not found. Please run the main seed script first.');
    }

    const products = [
        // 1. Kanjivaram Saree (Using Gold Border/Cushion Image)
        {
            name: 'Royal Kanjivaram Silk Saree',
            description: 'Exquisite Kanjivaram silk saree in rich gold and red. Features intricate zari work borders and a traditional pallu. Perfect for weddings.',
            basePrice: 12999,
            categoryId: sareeCategory.id,
            image: '/images/products/women/saree-gold-border.png',
            slugPrefix: 'saree-kanjivaram-royal',
            variants: [
                { size: 'Free Size', stock: 10 }
            ]
        },
        // 2. Georgette Floral Kurta (Using Floral Dress Image)
        {
            name: 'Floral Print Georgette Kurta',
            description: 'Elegant georgette kurta with vibrant floral prints. Lightweight and breezy, ideal for everyday wear or casual outings.',
            basePrice: 1499,
            categoryId: kurtaCategory.id,
            image: '/images/products/women/kurta-floral.png',
            slugPrefix: 'kurta-floral-georgette',
            variants: [
                { size: 'S', stock: 15 },
                { size: 'M', stock: 20 },
                { size: 'L', stock: 15 },
                { size: 'XL', stock: 10 }
            ]
        },
        // 3. Bridal Lehenga (Using Lehenga Image)
        {
            name: 'Crimson Bridal Lehenga Choli',
            description: 'Stunning crimson red lehenga choli with heavy golden embroidery. Crafted from premium velvet for a royal look.',
            basePrice: 24999,
            categoryId: lehengaCategory.id,
            image: '/images/products/women/lehenga-red-gold.png',
            slugPrefix: 'lehenga-bridal-crimson',
            variants: [
                { size: 'S', stock: 5 },
                { size: 'M', stock: 8 },
                { size: 'L', stock: 5 }
            ]
        },
        // 4. Banarasi Silk Saree (Using Gold Border Image)
        {
            name: 'Vintage Banarasi Silk Saree',
            description: 'Timeless Banarasi silk saree with detailed brocade work. specific gold and beige tones suited for any festive occasion.',
            basePrice: 8999,
            categoryId: sareeCategory.id,
            image: '/images/products/women/saree-gold-border.png',
            slugPrefix: 'saree-banarasi-vintage',
            variants: [
                { size: 'Free Size', stock: 12 }
            ]
        },
        // 5. Cotton Anarkali Kurta (Using Floral Image)
        {
            name: 'Summer Breeze Cotton Anarkali',
            description: 'A comfortable and stylish cotton anarkali suit in pastel floral prints. Keeps you cool and chic during warm days.',
            basePrice: 1899,
            categoryId: kurtaCategory.id,
            image: '/images/products/women/kurta-floral.png',
            slugPrefix: 'kurta-anarkali-cotton',
            variants: [
                { size: 'M', stock: 18 },
                { size: 'L', stock: 22 },
                { size: 'XXL', stock: 12 }
            ]
        },
        // 6. Party Wear Lehenga (Using Lehenga Image)
        {
            name: 'Designer Party Wear Lehenga',
            description: 'Contemporary lehenga design with mirror work and modern silhouette. Stand out at any party or reception.',
            basePrice: 15999,
            categoryId: lehengaCategory.id,
            image: '/images/products/women/lehenga-red-gold.png',
            slugPrefix: 'lehenga-party-designer',
            variants: [
                { size: 'S', stock: 10 },
                { size: 'M', stock: 15 }
            ]
        },
        // 7. Chiffon Saree (Using Floral - adapted)
        {
            name: 'Lightweight Chiffon Saree',
            description: 'Graceful chiffon saree with subtle floral motifs. Easy to drape and carry, perfect for office wear or evening gatherings.',
            basePrice: 2299,
            categoryId: sareeCategory.id,
            image: '/images/products/women/kurta-floral.png',
            slugPrefix: 'saree-chiffon-floral',
            variants: [
                { size: 'Free Size', stock: 25 }
            ]
        },
        // 8. Embroidered Silk Blouse (Using Gold Image)
        {
            name: 'Gold Embroidered Silk Blouse',
            description: 'Readymade silk blouse with golden sequin work. Pairs perfectly with any traditional saree or lehenga skirt.',
            basePrice: 1299,
            categoryId: topsCategory ? topsCategory.id : kurtaCategory.id,
            image: '/images/products/women/saree-gold-border.png',
            slugPrefix: 'blouse-silk-gold',
            variants: [
                { size: '34', stock: 10 },
                { size: '36', stock: 15 },
                { size: '38', stock: 12 }
            ]
        },
        // 9. Festive Kurti Set (Using Lehenga Image - adapted context)
        {
            name: 'Festive Maroon Kurti Set',
            description: 'Rich maroon kurti with palazzos. Features traditional embroidery similar to our bridal collection but lighter for semi-formal events.',
            basePrice: 2999,
            categoryId: kurtaCategory.id,
            image: '/images/products/women/lehenga-red-gold.png',
            slugPrefix: 'kurti-set-maroon',
            variants: [
                { size: 'M', stock: 20 },
                { size: 'L', stock: 20 },
                { size: 'XL', stock: 15 }
            ]
        },
        // 10. Daily Wear Printed Saree (Using Floral)
        {
            name: 'Soft Silk Printed Saree',
            description: 'Soft silk saree with digital floral prints. combines the sheen of silk with the comfort of specialized weaving.',
            basePrice: 1899,
            categoryId: sareeCategory.id,
            image: '/images/products/women/kurta-floral.png',
            slugPrefix: 'saree-soft-silk-printed',
            variants: [
                { size: 'Free Size', stock: 30 }
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
