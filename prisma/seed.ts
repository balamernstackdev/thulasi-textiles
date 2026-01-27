
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
            image: '/images/categories/category_kids.jpg', // Better kids traditional/festive image
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
        const parent = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {
                image: cat.image // Ensure updating works if it exists
            },
            create: {
                name: cat.name,
                slug: cat.slug,
                description: `All products for ${cat.name}`,
                image: cat.image
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

                let mainImageUrl = 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?auto=format&fit=crop&w=800&q=80';
                // Subcategory-specific image selection
                if (sub === 'Shirts') mainImageUrl = '/images/products/product_men.jpg';
                else if (sub === 'T-Shirts') mainImageUrl = '/images/products/product_men.jpg';
                else if (sub === 'Jeans') mainImageUrl = '/images/products/product_men.jpg';
                else if (sub === 'Trousers') mainImageUrl = '/images/products/product_men.jpg';
                else if (sub === 'Ethnic Wear' && cat.name === 'Men') mainImageUrl = '/images/categories/category_men.jpg';
                else if (sub === 'Innerwear') mainImageUrl = '/images/products/product_men.jpg';
                else if (sub === 'Sarees') mainImageUrl = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Kurtas & Kurtis') mainImageUrl = 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Lehengas') mainImageUrl = 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Jeans & Jeggings') mainImageUrl = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Tops & Tees') mainImageUrl = 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Lingerie') mainImageUrl = 'https://images.unsplash.com/photo-1596483569428-2e0617300705?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Boys Clothing') mainImageUrl = 'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Girls Clothing') mainImageUrl = 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Infants') mainImageUrl = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'School Uniforms') mainImageUrl = 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Bedsheets') mainImageUrl = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Curtains') mainImageUrl = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Towels') mainImageUrl = 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Blankets') mainImageUrl = 'https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&w=800&q=80';
                else if (sub === 'Cushion Covers') mainImageUrl = 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80';
                else {
                    // Category-level fallback
                    if (cat.name === 'Men') mainImageUrl = '/images/categories/category_men.jpg';
                    else if (cat.name === 'Women') mainImageUrl = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
                    else if (cat.name === 'Kids') mainImageUrl = 'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=800&q=80';
                    else if (cat.name === 'Home Linen') mainImageUrl = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
                }

                // Secondary image selection logic
                let secondImageUrl = 'https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=800&q=80';
                if (cat.name === 'Men') secondImageUrl = '/images/products/product_men.jpg';
                else if (cat.name === 'Women') secondImageUrl = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
                else if (cat.name === 'Home Linen') secondImageUrl = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';

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
                                    url: secondImageUrl,
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


    // Seed Banners
    console.log('Seeding banners...');
    await prisma.banner.deleteMany({});

    // Main Hero Banners
    await prisma.banner.create({
        data: {
            title: 'FESTIVE COLLECTION',
            subtitle: 'Celebrate Tradition | Flat 40% Off on Silk Sarees',
            imageUrl: '/images/banners/banner_festive.jpg',
            type: 'HOME_MAIN',
            isActive: true,
            order: 1,
            buttonText: 'SHOP NOW',
            link: '/category/women-sarees',
            alignment: 'LEFT',
            textColor: '#ffffff',
            backgroundColor: '#000000'
        }
    });

    await prisma.banner.create({
        data: {
            title: 'PREMIUM HANDLOOMS',
            subtitle: 'Direct from Master Weavers of Tamil Nadu',
            imageUrl: '/images/banners/banner_handloom.jpg',
            type: 'HOME_MAIN',
            isActive: true,
            order: 2,
            buttonText: 'Explore Collection',
            link: '/category/women',
            alignment: 'CENTER',
            textColor: '#ffffff',
            backgroundColor: '#000000'
        }
    });

    await prisma.banner.create({
        data: {
            title: 'MEN\'S ETHNIC WEAR',
            subtitle: 'Kurtas & Sherwanis for Every Occasion',
            imageUrl: '/images/banners/banner_men.jpg',
            type: 'HOME_MAIN',
            isActive: true,
            order: 3,
            buttonText: 'Shop Men',
            link: '/category/men',
            alignment: 'RIGHT',
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
        console.error('Seed Error:', JSON.stringify(e, null, 2));
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
