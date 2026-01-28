const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Artisans...');

    const artisan1 = await prisma.artisan.create({
        data: {
            name: 'Master Arul Murugan',
            bio: 'A third-generation master weaver from Kanchipuram, Arul specializes in heavy Zari silk sarees. He has won multiple state awards for his intricate floral border designs.',
            experienceYears: 28,
            village: 'Kanchipuram, TN',
            imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
            specialty: 'Zari Work & Silk',
        }
    });

    const artisan2 = await prisma.artisan.create({
        data: {
            name: 'Lakshmi Devi',
            bio: 'Lakshmi is an expert in the "Kodali Karuppur" style of weaving. She works primarily on fine cotton muslins with vegetable dye hand-painting.',
            experienceYears: 15,
            village: 'Kumbakonam, TN',
            imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
            specialty: 'Hand-Painting & Muslin',
        }
    });

    // Link products to these artisans (assuming some products exist)
    const products = await prisma.product.findMany({ take: 10 });

    if (products.length > 0) {
        for (let i = 0; i < products.length; i++) {
            await prisma.product.update({
                where: { id: products[i].id },
                data: {
                    artisanId: i % 2 === 0 ? artisan1.id : artisan2.id,
                    loomType: i % 2 === 0 ? 'Pit Loom (Traditional)' : 'Frame Loom',
                    weavingHours: 72 + (i * 12)
                }
            });
        }
    }

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
