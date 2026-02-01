
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Deactivate any potentially broken duplicates
    const duplicates = await prisma.banner.findMany({
        where: {
            title: {
                contains: 'Customer'
            }
        }
    });

    console.log(`Auditing ${duplicates.length} banners.`);

    for (const b of duplicates) {
        console.log(`Updating banner ${b.id} with new textile assets.`);
        await prisma.banner.update({
            where: { id: b.id },
            data: {
                title: 'CUSTOMER FAVORITES',
                subtitle: 'Most loved weaves of the season',
                imageUrl: '/banners/customer-favourite.png',
                type: 'HOME_MAIN', // Make it a main hero
                isActive: true,
                order: -1, // Ensure it's first
                alignment: 'CENTER'
            }
        });
    }

    console.log('Database synced with new "Weightless Luxury" assets.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
