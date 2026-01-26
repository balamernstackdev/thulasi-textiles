
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Updating banners...');

    // Delete existing HOME_MAIN banners
    await prisma.banner.deleteMany({
        where: { type: 'HOME_MAIN' }
    });

    const newBanners = [
        {
            title: "EXQUISITE SAREE COLLECTION",
            subtitle: "Traditional Elegance, Modern Charm",
            buttonText: "Shop Sarees",
            imageUrl: "/banners/banner-saree.png",
            link: "/category/women-sarees",
            isActive: true,
            order: 1,
            type: 'HOME_MAIN'
        },
        {
            title: "PREMIUM MEN'S CASUALS",
            subtitle: "Comfort Meets Sophistication",
            buttonText: "Explore Collection",
            imageUrl: "/banners/banner-men.png",
            link: "/category/men-shirts",
            isActive: true,
            order: 2,
            type: 'HOME_MAIN'
        },
        {
            title: "LUXURY HOME LINEN",
            subtitle: "Transform Your Living Spaces",
            buttonText: "View Linens",
            imageUrl: "/banners/banner-home.png",
            link: "/category/home-linen",
            isActive: true,
            order: 3,
            type: 'HOME_MAIN'
        }
    ];

    for (const banner of newBanners) {
        await prisma.banner.create({
            data: banner as any
        });
    }

    console.log('Banners updated successfully!');
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
