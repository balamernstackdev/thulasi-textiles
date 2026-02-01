
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const banners = await prisma.banner.findMany();
    console.log('Total Banners:', banners.length);
    banners.forEach((b, i) => {
        console.log(`Banner ${i + 1}:`, {
            id: b.id,
            type: b.type,
            isActive: b.isActive,
            title: b.title,
            imageUrl: b.imageUrl
        });
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
