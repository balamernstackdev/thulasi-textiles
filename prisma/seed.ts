
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
    await prisma.orderItem.deleteMany({});
    await prisma.productVariant.deleteMany({});
    await prisma.productImage.deleteMany({});
    await prisma.product.deleteMany({});
    // Optional: Delete categories if you want a fresh start, but upsert handles them well usually
    // await prisma.category.deleteMany({});

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

    const categories = [
        {
            name: 'Men',
            slug: 'men',
            subcategories: ['Shirts', 'T-Shirts', 'Jeans', 'Trousers', 'Ethnic Wear', 'Innerwear']
        },
        {
            name: 'Women',
            slug: 'women',
            subcategories: ['Sarees', 'Kurtas & Kurtis', 'Lehengas', 'Jeans & Jeggings', 'Tops & Tees', 'Lingerie']
        },
        {
            name: 'Kids',
            slug: 'kids',
            subcategories: ['Boys Clothing', 'Girls Clothing', 'Infants', 'School Uniforms']
        },
        {
            name: 'Home Linen',
            slug: 'home-linen',
            subcategories: ['Bedsheets', 'Curtains', 'Towels', 'Blankets', 'Cushion Covers']
        }
    ];

    for (const cat of categories) {
        const parent = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: {
                name: cat.name,
                slug: cat.slug,
                description: `All products for ${cat.name}`
            }
        });

        for (const sub of cat.subcategories) {
            const subSlug = `${cat.slug}-${sub.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and')}`;
            const subCategory = await prisma.category.upsert({
                where: { slug: subSlug },
                update: {},
                create: {
                    name: sub,
                    slug: subSlug,
                    parentId: parent.id,
                    description: `${sub} for ${cat.name}`
                }
            });

            // Create 1 dummy product for each subcategory
            for (let i = 1; i <= 1; i++) {
                const productName = `${cat.name} ${sub} Product ${i}`;
                const productSlug = `${subSlug}-product-${i}`;
                const price = Math.floor(Math.random() * 2000) + 500; // Random price between 500 and 2500

                let mainImageUrl = 'https://images.unsplash.com/photo-1523381235208-17b173399450?auto=format&fit=crop&w=800&q=80';
                // Subcategory-specific image selection
                if (sub === 'Shirts') mainImageUrl = 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'T-Shirts') mainImageUrl = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Jeans') mainImageUrl = 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Trousers') mainImageUrl = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Ethnic Wear' && cat.name === 'Men') mainImageUrl = 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Innerwear') mainImageUrl = 'https://images.unsplash.com/photo-1588615419957-ed6999f69742?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Sarees') mainImageUrl = 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Kurtas & Kurtis') mainImageUrl = 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Lehengas') mainImageUrl = 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Jeans & Jeggings') mainImageUrl = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Tops & Tees') mainImageUrl = 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Lingerie') mainImageUrl = 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Boys Clothing') mainImageUrl = 'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Girls Clothing') mainImageUrl = 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Infants') mainImageUrl = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'School Uniforms') mainImageUrl = 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Bedsheets') mainImageUrl = 'https://images.unsplash.com/photo-1628592102751-ba83b0314276?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Curtains') mainImageUrl = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Towels') mainImageUrl = 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Blankets') mainImageUrl = 'https://images.unsplash.com/photo-1543332164-6e82f3555182?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Cushion Covers') mainImageUrl = 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80';
                else {
                    // Category-level fallback
                    if (cat.name === 'Men') mainImageUrl = 'https://images.unsplash.com/photo-1597131628347-c769fc631754?auto=format&fit=crop&w=800&q=80';
                    else if (cat.name === 'Women') mainImageUrl = 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=800&q=80';
                    else if (cat.name === 'Kids') mainImageUrl = 'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=800&q=80';
                    else if (cat.name === 'Home Linen') mainImageUrl = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
                }

                const product = await prisma.product.upsert({
                    where: { slug: productSlug },
                    update: {},
                    create: {
                        name: productName,
                        slug: productSlug,
                        description: `This is a high-quality ${productName} made from premium materials. Perfect for any occasion.`,
                        basePrice: price,
                        categoryId: subCategory.id,
                        isActive: true,
                        isBestSeller: Math.random() > 0.5,
                        images: {
                            create: [
                                {
                                    url: mainImageUrl,
                                    altText: productName,
                                    isPrimary: true
                                },
                                {
                                    url: `https://images.unsplash.com/photo-1523381235208-17b173399450?auto=format&fit=crop&w=800&q=80`,
                                    altText: `${productName} Secondary View`,
                                    isPrimary: false
                                }
                            ]
                        },
                        variants: {
                            create: [
                                {
                                    sku: `${productSlug.toUpperCase()}-S`,
                                    size: 'S',
                                    stock: 10,
                                    price: price
                                },
                                {
                                    sku: `${productSlug.toUpperCase()}-M`,
                                    size: 'M',
                                    stock: 15,
                                    price: price
                                },
                                {
                                    sku: `${productSlug.toUpperCase()}-L`,
                                    size: 'L',
                                    stock: 5,
                                    price: price + 100
                                }
                            ]
                        }
                    }
                });
            }
        }
    }

    console.log('Categories seeded successfully');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('Seed Error:', JSON.stringify(e, null, 2));
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
