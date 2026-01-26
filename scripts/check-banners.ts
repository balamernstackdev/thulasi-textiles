import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- DIAGNOSTIC START ---');
    try {
        const banners = await prisma.banner.findMany({
            where: { isActive: true }
        });
        console.log(`Found ${banners.length} active banners.`);
        banners.forEach((b, i) => {
            console.log(`Banner ${i + 1}: ID=${b.id}, Type=${b.type}, Title=${b.title}`);
        });

        const bannerTypes = await prisma.$queryRaw`SELECT DISTINCT type FROM Banner`;
        console.log('Available Banner Types in DB:', bannerTypes);

    } catch (error: any) {
        console.error('Prisma Error:', error.message);
        if (error.message.includes('Inconsistent column data')) {
            console.error('CRITICAL: Prisma Client is out of sync with Database Enum values!');
        }
    } finally {
        await prisma.$disconnect();
    }
    console.log('--- DIAGNOSTIC END ---');
}

main();
