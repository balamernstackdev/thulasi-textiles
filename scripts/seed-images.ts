import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- SEEDING PREMIUM CATEGORY IMAGES START ---');

    const updates = [
        { slug: 'home-linen', image: '/categories/home-linen.png' },
        { slug: 'kids', image: '/categories/kids.png' },
        { slug: 'men', image: '/categories/men.png' },
        { slug: 'women', image: '/categories/women.png' },
    ];

    for (const item of updates) {
        try {
            const category = await prisma.category.update({
                where: { slug: item.slug },
                data: { image: item.image }
            });
            console.log(`Updated category "${category.name}" with image: ${item.image}`);
        } catch (error: any) {
            console.error(`Failed to update category ${item.slug}:`, error.message);
        }
    }

    console.log('--- SEEDING END ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
