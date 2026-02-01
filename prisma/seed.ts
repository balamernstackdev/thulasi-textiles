
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@textiles.com';
    const password = 'adminpassword123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Clean up existing data to prevent unique constraint violations
    console.log('Cleaning up database...');
    await prisma.review.deleteMany({});
    await prisma.wishlist.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.productVariant.deleteMany({});
    await prisma.productImage.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.banner.deleteMany({}); // Delete banners too for a fresh start

    const admin = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: 'Super Admin',
            password: hashedPassword,
            role: Role.ADMIN,
        },
    });


    console.log({ admin });

    // Distinct images for subcategories
    const imageMap: Record<string, Array<{ main: string, sec: string }>> = {
        'Men-Shirts': [
            { main: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1589310243388-15ee3317db67?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1603252109303-2751440ee693?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1621072118054-e6aa7b6f0b54?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80' },
        ],
        'Men-Trousers': [
            { main: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1506629082955-511b1aa00272?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1517445312882-b413010b9156?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1506629082955-511b1aa00272?auto=format&fit=crop&w=800&q=80' },
        ],
        'Men-Jeans': [
            { main: 'https://images.unsplash.com/photo-1542272617-08f08632047d?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1604176354204-9268737828c4?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1542272617-08f08632047d?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1604176354204-9268737828c4?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1555689502-c1b20349458e?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80' },
        ],
        'Men-Ethnic Wear': [
            { main: 'https://images.unsplash.com/photo-1629814596359-2172778647bc?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1630327341506-613d94183884?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1589873041930-b5d259c0c16b?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1597983073493-88cd357a28e0?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1566952726756-3c07802875b1?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1563283344-93c0bc133c94?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1598555986884-69796e100366?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1629814596359-2172778647bc?auto=format&fit=crop&w=800&q=80' },
        ],
        'Men-T-Shirts': [
            { main: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80' },
        ],
        'Men-Innerwear': [
            { main: 'https://images.unsplash.com/photo-1517445312882-b413010b9156?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1517445312882-b413010b9156?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1588616335123-b6d3b9e4a3b7?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1588616335123-b6d3b9e4a3b7?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80' },
        ],
        'Women-Sarees': [
            { main: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1629470937849-c0ae2f0aa7bb?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1583391726247-157d60591b7d?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1627885746761-9c8449c2560b?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1583391726247-157d60591b7d?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1610030469668-356c92d52366?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1627885746761-9c8449c2560b?auto=format&fit=crop&w=800&q=80' },
        ],
        'Women-Kurtas & Kurtis': [
            { main: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1522851493011-8073a558557d?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1522851493011-8073a558557d?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1550614000-4b9519e49c27?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80' },
        ],
        'Women-Lehengas': [
            { main: 'https://images.unsplash.com/photo-1594963384734-d07eb024072f?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1610189012906-4c9102434027?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1594963384734-d07eb024072f?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1585966373809-5a4ea8290f65?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1610189012906-4c9102434027?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1585966373809-5a4ea8290f65?auto=format&fit=crop&w=800&q=80' },
        ],
        'Women-Jeans & Jeggings': [
            { main: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1542272617-08f08632047d?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1584370848010-d7ccb2843de3?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1584370848010-d7ccb2843de3?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1605763240004-7e93b172d754?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80' },
        ],
        'Women-Tops & Tees': [
            { main: 'https://images.unsplash.com/photo-1621335829175-95f437384d7c?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1503341455253-b2e72333dbdb?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1508609349935-18c475fe6eb5?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1621335829175-95f437384d7c?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1503341455253-b2e72333dbdb?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1503341455253-b2e72333dbdb?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=800&q=80' },
        ],
        'Women-Lingerie': [
            { main: 'https://images.unsplash.com/photo-1596489379963-3ec9f1f00994?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1596489379963-3ec9f1f00994?auto=format&fit=crop&w=800&q=80' },
        ],
        'Kids-Boys Clothing': [
            { main: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1519238263496-61437a8ac686?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80' },
        ],
        'Kids-Girls Clothing': [
            { main: 'https://images.unsplash.com/photo-1621452773781-0f992fd03d9d?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1526857846592-8877bc3db52a?auto=format&fit=crop&w=800&q=80' },
            { main: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1526857846592-8877bc3db52a?auto=format&fit=crop&w=800&q=80' },
        ],
        'Kids-Infants': [
            { main: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80' },
        ],
        'Kids-School Uniforms': [
            { main: 'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1627552245715-77d79b199d91?auto=format&fit=crop&w=800&q=80' },
        ],
        'Home Linen-Bedsheets': [
            { main: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=800&q=80' },
        ],
        'Home Linen-Curtains': [
            { main: 'https://images.unsplash.com/photo-1514894780063-580edbb32997?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1514894780063-580edbb32997?auto=format&fit=crop&w=800&q=80' },
        ],
        'Home Linen-Towels': [
            { main: 'https://images.unsplash.com/photo-1583947581924-86ca00388902?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1583947581924-86ca00388902?auto=format&fit=crop&w=800&q=80' },
        ],
        'Home Linen-Blankets': [
            { main: 'https://images.unsplash.com/photo-1580302200322-2244ae266859?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1580302200322-2244ae266859?auto=format&fit=crop&w=800&q=80' },
        ],
        'Home Linen-Cushion Covers': [
            { main: 'https://images.unsplash.com/photo-1584100936595-c065db20db70?auto=format&fit=crop&w=800&q=80', sec: 'https://images.unsplash.com/photo-1584100936595-c065db20db70?auto=format&fit=crop&w=800&q=80' },
        ]
    };

    const categories = [
        {
            name: 'Men',
            slug: 'men',
            image: '/images/categories/category_men.jpg',
            subcategories: ['Shirts', 'T-Shirts', 'Jeans', 'Trousers', 'Ethnic Wear', 'Innerwear']
        },
        {
            name: 'Women',
            slug: 'women',
            image: '/images/categories/category_women.jpg',
            subcategories: ['Sarees', 'Kurtas & Kurtis', 'Lehengas', 'Jeans & Jeggings', 'Tops & Tees', 'Lingerie']
        },
        {
            name: 'Kids',
            slug: 'kids',
            image: '/images/categories/category_kids.jpg',
            subcategories: ['Boys Clothing', 'Girls Clothing', 'Infants', 'School Uniforms']
        },
        {
            name: 'Home Linen',
            slug: 'home-linen',
            image: '/images/categories/category_homelinen.jpg',
            subcategories: ['Bedsheets', 'Curtains', 'Towels', 'Blankets', 'Cushion Covers']
        }
    ];

    for (const cat of categories) {
        const parent = await prisma.category.create({
            data: {
                name: cat.name,
                slug: cat.slug,
                description: `All products for ${cat.name}`,
                image: cat.image
            }
        });

        for (const sub of cat.subcategories) {
            const subSlug = `${cat.slug}-${sub.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and')}`;
            const subCategory = await prisma.category.create({
                data: {
                    name: sub,
                    slug: subSlug,
                    parentId: parent.id,
                    description: `${sub} for ${cat.name}`
                }
            });

            // Create 4 dummy products for each subcategory
            console.log(`  Seeding ${sub}...`);
            for (let i = 1; i <= 4; i++) {
                const productName = `${cat.name} ${sub} Product ${i}`;
                process.stdout.write(`    - ${productName}... `);
                const productSlug = `${subSlug}-product-${i}`;
                const price = Math.floor(Math.random() * 2000) + 500;

                // Get images
                const key = `${cat.name}-${sub}`.trim();
                let images = imageMap[key];

                // Fallback if not mapped
                if (!images) {
                    if (cat.name === 'Men') images = imageMap['Men-Shirts'];
                    else if (cat.name === 'Women') images = imageMap['Women-Sarees'];
                    else if (cat.name === 'Kids') images = imageMap['Kids-Boys Clothing'];
                    else if (cat.name === 'Home Linen') images = imageMap['Home Linen-Bedsheets'];
                }

                // If STILL not found, use a safe default
                if (!images) images = imageMap['Men-Shirts'];

                // Cycle through images
                const imgSet = images[(i - 1) % images.length] || images[0];

                const isSaree = sub.includes('Saree');
                const isKurtas = sub.includes('Kurtas');
                const isHomeLinen = cat.name === 'Home Linen';

                const fabrics = isSaree ? ['Kanchipuram Silk', 'Chanderi Cotton', 'Maheshwari Silk', 'Organza'] : isKurtas ? ['Cotton Silk', 'Linen', 'Pure Cotton', 'Georgette'] : ['Premium Cotton', 'Pure Linen'];
                const origins = ['Tamil Nadu', 'Madhya Pradesh', 'West Bengal', 'Uttar Pradesh'];
                const weaves = ['Hand-Woven', 'Jacquard', 'Embroidery', 'Block Print'];

                const productFabric = fabrics[Math.floor(Math.random() * fabrics.length)];
                const productOrigin = origins[Math.floor(Math.random() * origins.length)];
                const productWeave = weaves[Math.floor(Math.random() * weaves.length)];

                const product = await prisma.product.create({
                    data: {
                        name: productName.trim(),
                        slug: productSlug.trim(),
                        description: `Experience the finest ${productName}, crafted with precision and care. Made from premium quality ${productFabric} that ensures comfort and durability. Perfect for modern lifestyles.`.trim(),
                        basePrice: price,
                        categoryId: subCategory.id,
                        isActive: true,
                        isBestSeller: i === 1,
                        isNew: i === 2,
                        fabric: productFabric,
                        origin: productOrigin,
                        weave: productWeave,
                        occasion: isSaree ? 'Wedding & Festive' : 'Casual Elegance',
                        artisanStory: `Each piece of ${productName} is a testament to the skill of our master artisans in ${productOrigin}. Weaving this masterpiece takes approximately 48 hours of dedicated hand-work on a traditional loom.`,
                        careInstructions: "Professional Dry Clean Recommended\nStore in a soft cotton bag\nIron on low heat",
                        loomType: "Traditional Pit Loom",
                        weavingHours: 48 + (i * 12),
                        images: {
                            create: [
                                {
                                    url: imgSet.main.replace(/\s+/g, ''),
                                    altText: productName.trim(),
                                    isPrimary: true
                                },
                                {
                                    url: imgSet.sec.replace(/\s+/g, ''),
                                    altText: `${productName} Secondary View`.trim(),
                                    isPrimary: false
                                }
                            ]
                        },
                        variants: {
                            create: [
                                { sku: `${productSlug.toUpperCase()}-S`.trim(), size: 'S', stock: 10, price: price },
                                { sku: `${productSlug.toUpperCase()}-M`.trim(), size: 'M', stock: 15, price: price },
                                { sku: `${productSlug.toUpperCase()}-L`.trim(), size: 'L', stock: 5, price: price + 100 },
                                { sku: `${productSlug.toUpperCase()}-XL`.trim(), size: 'XL', stock: 8, price: price + 150 }
                            ]
                        }
                    }
                });
                console.log('Done');
            }
        }
    }


    // Seed Banners
    console.log('Seeding banners...');
    await prisma.banner.deleteMany({});

    // Main Hero Banners
    await prisma.banner.create({
        data: {
            title: 'Great Indian Festival',
            subtitle: 'Up to 80% Off on Silk Sarees | Limited Time Deal',
            imageUrl: '/images/banners/banner_festive.jpg',
            type: 'HOME_MAIN',
            isActive: true,
            order: 1,
            buttonText: 'Shop Now',
            link: '/category/women-sarees',
            alignment: 'LEFT',
            textColor: '#000000',
            backgroundColor: '#ffffff'
        }
    });

    await prisma.banner.create({
        data: {
            title: 'Mega Blockbuster Sale',
            subtitle: 'Men\'s Ethnic Wear starting ₹499 | Free Shipping',
            imageUrl: '/images/banners/banner_men.jpg',
            type: 'HOME_MAIN',
            isActive: true,
            order: 2,
            buttonText: 'View Offers',
            link: '/category/men',
            alignment: 'LEFT',
            textColor: '#ffffff',
            backgroundColor: '#000000'
        }
    });

    await prisma.banner.create({
        data: {
            title: 'Home Makeover Days',
            subtitle: 'Premium Bedsheets & Curtains | Buy 1 Get 1 Free',
            imageUrl: '/images/banners/banner_handloom.jpg',
            type: 'HOME_MAIN',
            isActive: true,
            order: 3,
            buttonText: 'Explore',
            link: '/category/home-linen',
            alignment: 'LEFT',
            textColor: '#ffffff',
            backgroundColor: '#000000'
        }
    });

    /*
    // ============================================
    // Seed Related Products (Complementary Relationships)
    // ============================================
    console.log('Seeding related product relationships...');

    // Strategy: Link products within categories and across complementary categories
    // Sarees → Other Sarees, Blouses (if exists)
    // Kurtas → Other Kurtas, Tops
    // Men's Ethnic → Other Men's Ethnic
    // Home Linen → Matching sets within same category

    // Get all products to create relationships
    const allProducts = await prisma.product.findMany({
        include: {
            category: true
        }
    });

    // Helper function to find products by category slug pattern
    const findProductsByCategory = (slugPattern: string) => {
        return allProducts.filter(p => p.category.slug.includes(slugPattern));
    };

    // Women's Sarees - Link to other sarees and blouses
    const sarees = findProductsByCategory('sarees');
    const blouses = findProductsByCategory('kurtas'); // Using kurtas as blouse alternative

    for (let i = 0; i < sarees.length; i++) {
        const relatedIds: string[] = [];

        // Add 2 other sarees
        const otherSarees = sarees.filter((_, idx) => idx !== i).slice(0, 2);
        relatedIds.push(...otherSarees.map(p => p.id));

        // Add 1-2 blouses/kurtas
        relatedIds.push(...blouses.slice(0, 2).map(p => p.id));

        if (relatedIds.length > 0) {
            await prisma.product.update({
                where: { id: sarees[i].id },
                data: {
                    complementaryProducts: {
                        connect: relatedIds.map(id => ({ id }))
                    }
                }
            });
        }
    }

    // Women's Kurtas - Link to other kurtas, tops, and lehengas
    const kurtas = findProductsByCategory('kurtas');
    const tops = findProductsByCategory('tops');
    const lehengas = findProductsByCategory('lehengas');

    for (let i = 0; i < kurtas.length; i++) {
        const relatedIds: string[] = [];

        // Add 1-2 other kurtas
        const otherKurtas = kurtas.filter((_, idx) => idx !== i).slice(0, 2);
        relatedIds.push(...otherKurtas.map(p => p.id));

        // Add tops
        relatedIds.push(...tops.slice(0, 1).map(p => p.id));

        // Add lehengas
        relatedIds.push(...lehengas.slice(0, 1).map(p => p.id));

        if (relatedIds.length > 0) {
            await prisma.product.update({
                where: { id: kurtas[i].id },
                data: {
                    complementaryProducts: {
                        connect: relatedIds.map(id => ({ id }))
                    }
                }
            });
        }
    }

    // Men's Shirts - Link to other shirts, trousers, and ethnic wear
    const menShirts = findProductsByCategory('men-shirts');
    const menTrousers = findProductsByCategory('men-trousers');
    const menEthnic = findProductsByCategory('men-ethnic');

    for (let i = 0; i < menShirts.length; i++) {
        const relatedIds: string[] = [];

        // Add other shirts
        const otherShirts = menShirts.filter((_, idx) => idx !== i).slice(0, 2);
        relatedIds.push(...otherShirts.map(p => p.id));

        // Add trousers
        relatedIds.push(...menTrousers.slice(0, 1).map(p => p.id));

        // Add ethnic wear
        relatedIds.push(...menEthnic.slice(0, 1).map(p => p.id));

        if (relatedIds.length > 0) {
            await prisma.product.update({
                where: { id: menShirts[i].id },
                data: {
                    complementaryProducts: {
                        connect: relatedIds.map(id => ({ id }))
                    }
                }
            });
        }
    }

    // Men's Ethnic Wear - Link to other ethnic pieces
    for (let i = 0; i < menEthnic.length; i++) {
        const relatedIds: string[] = [];

        // Add other ethnic wear
        const otherEthnic = menEthnic.filter((_, idx) => idx !== i).slice(0, 3);
        relatedIds.push(...otherEthnic.map(p => p.id));

        if (relatedIds.length > 0) {
            await prisma.product.update({
                where: { id: menEthnic[i].id },
                data: {
                    complementaryProducts: {
                        connect: relatedIds.map(id => ({ id }))
                    }
                }
            });
        }
    }

    // Home Linen - Link matching sets
    const bedsheets = findProductsByCategory('bedsheets');
    const curtains = findProductsByCategory('curtains');
    const towels = findProductsByCategory('towels');
    const cushions = findProductsByCategory('cushion');

    for (let i = 0; i < bedsheets.length; i++) {
        const relatedIds: string[] = [];

        // Add curtains (matching room decor)
        relatedIds.push(...curtains.slice(0, 1).map(p => p.id));

        // Add cushions
        relatedIds.push(...cushions.slice(0, 2).map(p => p.id));

        // Add towels
        relatedIds.push(...towels.slice(0, 1).map(p => p.id));

        if (relatedIds.length > 0) {
            await prisma.product.update({
                where: { id: bedsheets[i].id },
                data: {
                    complementaryProducts: {
                        connect: relatedIds.map(id => ({ id }))
                    }
                }
            });
        }
    }

    // Kids Clothing - Link within same gender and across
    const boysClothing = findProductsByCategory('boys-clothing');
    const girlsClothing = findProductsByCategory('girls-clothing');

    for (let i = 0; i < boysClothing.length; i++) {
        const relatedIds: string[] = [];

        // Add other boys clothing
        const otherBoys = boysClothing.filter((_, idx) => idx !== i).slice(0, 2);
        relatedIds.push(...otherBoys.map(p => p.id));

        // Add girls clothing (sibling sets)
        relatedIds.push(...girlsClothing.slice(0, 1).map(p => p.id));

        if (relatedIds.length > 0) {
            await prisma.product.update({
                where: { id: boysClothing[i].id },
                data: {
                    complementaryProducts: {
                        connect: relatedIds.map(id => ({ id }))
                    }
                }
            });
        }
    }
    */

    console.log('Categories, Banners, and Related Products seeded successfully');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('Seed Error:', e.message);
        console.error(e.stack);
        await prisma.$disconnect();
        process.exit(1);
    });
