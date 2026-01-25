
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding banners...');

    // 1. Clear existing Main Banners
    try {
        await prisma.banner.deleteMany({
            where: { type: 'HOME_MAIN' }
        });
        console.log('Deleted old main banners.');
    } catch (e) {
        console.log('No existing banners to delete or error clearing:', e);
    }

    // 2. Add New Amazon-Style Banners (Wide Aspect Ratio)
    const banners = [
        {
            imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1920&h=600&fit=crop', // Linen/Interior
            title: 'LUXURY HOME LINEN',
            subtitle: 'Transform your living space with our premium cotton & velvet collection.',
            buttonText: 'Explore Home Linen',
            link: '/category/home-linen',
            order: 1,
            type: 'HOME_MAIN'
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1920&h=600&fit=crop', // Silk Saree Texture
            title: 'THE SILK FESTIVAL',
            subtitle: 'Handwoven Kanchipuram and Banarasi silks at exclusive process.',
            buttonText: 'View Saree Collection',
            link: '/category/sarees',
            order: 2,
            type: 'HOME_MAIN'
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920&h=600&fit=crop', // Fashion/Model
            title: 'NEW SEASON ARRIVALS',
            subtitle: 'Discover the latest trends in mens & womens fashion.',
            buttonText: 'Shop New In',
            link: '/collections/new-arrivals',
            order: 3,
            type: 'HOME_MAIN'
        }
    ];

    for (const banner of banners) {
        await prisma.banner.create({
            data: {
                ...banner,
                isActive: true
            }
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
