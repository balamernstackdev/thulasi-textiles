
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const banner = await prisma.banner.create({
        data: {
            title: 'CUSTOMER FAVORITES',
            subtitle: 'Most loved weaves of the season',
            imageUrl: '/banners/customer-favourite.png',
            type: 'HOME_MAIN',
            isActive: true,
            order: 0,
            alignment: 'CENTER',
            buttonText: 'Shop Best Sellers',
            link: '/collections/best-sellers'
        }
    });
    console.log('Banner created:', banner.id);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
