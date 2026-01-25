import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function seedBanners() {
    console.log('Cleaning up existing banners...');
    await prisma.banner.deleteMany({});

    const banners = [
        {
            imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80',
            link: '/category/women',
            isActive: true,
            order: 1
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=1920&q=80',
            link: '/category/men',
            isActive: true,
            order: 2
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1920&q=80',
            link: '/category/home-linen',
            isActive: true,
            order: 3
        }
    ];

    console.log('Seeding new banners...');
    for (const b of banners) {
        await prisma.banner.create({ data: b });
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
