
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const banners = await prisma.banner.findMany({
        where: {
            title: {
                contains: 'Customer'
            }
        }
    });

    console.log(`Found ${banners.length} banners with "Customer" in title.`);

    for (const b of banners) {
        console.log(`ID: ${b.id}, Title: "${b.title}", Image: "${b.imageUrl}", Active: ${b.isActive}, Type: ${b.type}`);
        // If it's a blank one, we might want to deactivate it
        if (b.imageUrl === 'empty' || b.imageUrl === '' || !b.imageUrl.startsWith('/')) {
            console.log(`--- [!] This banner ${b.id} looks blank. Deactivating.`);
            await prisma.banner.update({
                where: { id: b.id },
                data: { isActive: false }
            });
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
