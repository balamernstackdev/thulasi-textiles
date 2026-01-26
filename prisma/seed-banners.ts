
import { PrismaClient, BannerType, BannerAlignment } from '@prisma/client';

const prisma = new PrismaClient();

async function seedBanners() {
    console.log('Cleaning up existing banners...');
    try {
        // Optional: clear existing if you want a fresh start, 
        // or just update them. For now, let's just add the new ones 
        // or ensure they exist.
        // await prisma.banner.deleteMany({}); 
    } catch (e) {
        console.log('Error cleaning up (ignored):', e);
    }

    console.log('Seeding new banners...');

    const banners = [
        {
            title: "Saree Splendor Sale!",
            subtitle: "Unlock Your Radiance | Flat 60% Off",
            imageUrl: "/banners/banner-saree.png",
            videoUrl: null,
            link: "/category/sarees",
            buttonText: "Shop Now",
            type: BannerType.HOME_MAIN,
            isActive: true,
            order: 1,
            alignment: BannerAlignment.LEFT,
            backgroundColor: "#0F172A",
            textColor: "#FFFFFF"
        },
        {
            title: "Heritage Collection",
            subtitle: "Authentic Handlooms from Master Weavers",
            imageUrl: "/banners/banner-home.png",
            videoUrl: null,
            link: "/collections/heritage",
            buttonText: "Discover More",
            type: BannerType.HOME_MAIN,
            isActive: true,
            order: 2,
            alignment: BannerAlignment.RIGHT,
            backgroundColor: "#450a0a",
            textColor: "#FFFFFF"
        }
    ];

    for (const banner of banners) {
        // logical upsert or just create
        // Simplest to just create, or maybe standard seed logic?
        // Let's use create because unique constraints aren't strict on these fields
        // but to avoid duplicates on re-runs, maybe check first?

        // For the fix, let's match the structure that works.
        // The previous error was a Type error on 'alignment'.
        // By importing BannerAlignment, we fix it.

        // We'll clean up old HOME_MAINs first to be safe and avoid clutter
        await prisma.banner.updateMany({
            where: { type: 'HOME_MAIN', isActive: true },
            data: { isActive: false }
        });

        await prisma.banner.create({
            data: banner
        });
    }

    console.log('Banners seeded successfully.');
}

seedBanners()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
