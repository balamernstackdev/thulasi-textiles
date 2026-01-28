
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding 10 new kids products...');

    // Find subcategories for Kids
    const boysCategory = await prisma.category.findUnique({ where: { slug: 'kids-boys-clothing' } });
    const girlsCategory = await prisma.category.findUnique({ where: { slug: 'kids-girls-clothing' } });
    const infantsCategory = await prisma.category.findUnique({ where: { slug: 'kids-infants' } });
    const uniformsCategory = await prisma.category.findUnique({ where: { slug: 'kids-school-uniforms' } });

    if (!boysCategory || !girlsCategory || !infantsCategory || !uniformsCategory) {
        throw new Error('Kids subcategories not found. Please run the main seed script first.');
    }

    const kidsProducts = [
        {
            name: 'Little Gentleman Cotton Shirt',
            description: 'A premium cotton shirt for boys, featuring a modern abstract print and comfortable fit. Perfect for parties and special occasions.',
            basePrice: 1299,
            categoryId: boysCategory.id,
            image: '/images/products/kids/boys-cotton-shirt.png',
            slugPrefix: 'boys-cotton-shirt',
            variants: [
                { size: '2-3Y', stock: 15 },
                { size: '4-5Y', stock: 20 },
                { size: '6-7Y', stock: 10 }
            ]
        },
        {
            name: 'Classic Boys Denim Shorts',
            description: 'Durable and stylish denim shorts with adjustable waistband. Great for summer play and casual outings.',
            basePrice: 899,
            categoryId: boysCategory.id,
            image: '/images/products/kids/boys-denim-shorts.png',
            slugPrefix: 'boys-denim-shorts',
            variants: [
                { size: '3-4Y', stock: 12 },
                { size: '5-6Y', stock: 18 },
                { size: '7-8Y', stock: 15 }
            ]
        },
        {
            name: 'Traditional Boys Ethnic Kurta',
            description: 'Stunning festive kurta for boys with intricate peacock embroidery and vibrant colors. Made from premium silk-blend fabric.',
            basePrice: 1599,
            categoryId: boysCategory.id,
            image: '/images/products/kids/boys-ethnic-kurta.png',
            slugPrefix: 'boys-ethnic-kurta',
            variants: [
                { size: '4-5Y', stock: 8 },
                { size: '6-7Y', stock: 12 },
                { size: '8-9Y', stock: 5 }
            ]
        },
        {
            name: 'Floral Garden Summer Dress',
            description: 'A beautiful and airy summer dress for girls with delicate floral patterns. Smocked bodice for a perfect fit and flared skirt for twirling.',
            basePrice: 1499,
            categoryId: girlsCategory.id,
            image: '/images/products/kids/girls-floral-dress.png',
            slugPrefix: 'girls-floral-dress',
            variants: [
                { size: '3-4Y', stock: 20 },
                { size: '5-6Y', stock: 25 },
                { size: '7-8Y', stock: 15 }
            ]
        },
        {
            name: 'Watermelon Print Summer Skirt',
            description: 'Fun and colorful summer skirt with vibrant watermelon prints and cute pom-pom trim. Lightweight fabric for all-day comfort.',
            basePrice: 749,
            categoryId: girlsCategory.id,
            image: '/images/products/kids/girls-summer-skirt.png',
            slugPrefix: 'girls-summer-skirt',
            variants: [
                { size: '2-3Y', stock: 10 },
                { size: '4-5Y', stock: 15 },
                { size: '6-7Y', stock: 12 }
            ]
        },
        {
            name: 'Girls Ethnic Lehenga Choli Set',
            description: 'Elegant festive lehenga choli for girls in bright pink and navy blue. Detailed with traditional golden embroidery and a matching net dupatta.',
            basePrice: 2499,
            categoryId: girlsCategory.id,
            image: '/images/products/kids/girls-ethnic-lehenga.png',
            slugPrefix: 'girls-ethnic-lehenga',
            variants: [
                { size: '5-6Y', stock: 5 },
                { size: '7-8Y', stock: 8 },
                { size: '9-10Y', stock: 4 }
            ]
        },
        {
            name: 'Organic Cotton Infant Set',
            description: 'Ultra-soft 100% organic cotton 2-piece set for infants. Breathable, hypoallergenic fabric that is gentle on baby\'s skin.',
            basePrice: 999,
            categoryId: infantsCategory.id,
            image: '/images/products/kids/infants-organic-set.png',
            slugPrefix: 'infants-organic-set',
            variants: [
                { size: '0-3M', stock: 20 },
                { size: '3-6M', stock: 25 },
                { size: '6-12M', stock: 15 }
            ]
        },
        {
            name: 'Teddy Bear Soft Sleep Romper',
            description: 'Cozy waffle-knit romper for infants with a cute teddy bear pocket. Easy-access snaps for quick changes and ribbed cuffs for a snug fit.',
            basePrice: 1199,
            categoryId: infantsCategory.id,
            image: '/images/products/kids/infants-soft-romper.png',
            slugPrefix: 'infants-soft-romper',
            variants: [
                { size: '3-6M', stock: 18 },
                { size: '6-12M', stock: 22 },
                { size: '12-18M', stock: 14 }
            ]
        },
        {
            name: 'Smart School Uniform Shirt',
            description: 'High-quality, crisp white school uniform shirt. Easy-iron fabric that stays fresh all day. Reinforced seams for extra durability.',
            basePrice: 599,
            categoryId: uniformsCategory.id,
            image: '/images/products/kids/school-uniform-shirt.png',
            slugPrefix: 'school-uniform-shirt',
            variants: [
                { size: '6-7Y', stock: 30 },
                { size: '8-9Y', stock: 40 },
                { size: '10-11Y', stock: 25 }
            ]
        },
        {
            name: 'Durable School Uniform Trousers',
            description: 'Rugged navy blue school uniform trousers with adjustable waist and teflon coating for stain resistance. Built to last.',
            basePrice: 849,
            categoryId: uniformsCategory.id,
            image: '/images/products/kids/school-uniform-trousers.png',
            slugPrefix: 'school-uniform-trousers',
            variants: [
                { size: '7-8Y', stock: 25 },
                { size: '9-10Y', stock: 35 },
                { size: '11-12Y', stock: 20 }
            ]
        }
    ];

    for (const p of kidsProducts) {
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
                        sku: `${p.slugPrefix.toUpperCase()}-${v.size}-${Date.now()}`,
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
