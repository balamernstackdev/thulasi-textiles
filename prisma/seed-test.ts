
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting test seed...');

    // 1. Create Main Product (Saree)
    const saree = await prisma.product.create({
        data: {
            name: 'Test Kanchipuram Saree',
            slug: 'test-kanchipuram-saree-' + Date.now(),
            description: 'A beautiful test saree.',
            basePrice: 15000,
            categoryId: (await prisma.category.findFirst())?.id || '', // Fallback or strict fail
            isActive: true,
            fabric: 'Silk',
            weave: 'Kanchipuram',
            images: {
                create: {
                    url: 'https://res.cloudinary.com/dtqetmk1c/image/upload/v1706614136/t9_xhxj8e.jpg',
                    isPrimary: true
                }
            }
        },
    });

    console.log(`✅ Created Saree: ${saree.name} (${saree.id})`);

    // 2. Create Complementary Product (Blouse)
    const blouse = await prisma.product.create({
        data: {
            name: 'Test Matching Blouse',
            slug: 'test-matching-blouse-' + Date.now(),
            description: 'Perfect match for the saree.',
            basePrice: 2000,
            categoryId: (await prisma.category.findFirst())?.id || '',
            isActive: true,
            fabric: 'Silk',
            images: {
                create: {
                    url: 'https://res.cloudinary.com/dtqetmk1c/image/upload/v1706614136/t9_xhxj8e.jpg',
                    isPrimary: true
                }
            }
        },
    });

    console.log(`✅ Created Blouse: ${blouse.name} (${blouse.id})`);

    // 3. Link them
    // Note: We use 'update' because we're testing the relationship capability
    await prisma.product.update({
        where: { id: saree.id },
        data: {
            complementaryProducts: {
                connect: { id: blouse.id }
            }
        }
    });

    console.log(`🔗 Successfully linked Blouse to Saree as complementary!`);
}

main()
    .catch((e) => {
        console.error('❌ Error in seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
