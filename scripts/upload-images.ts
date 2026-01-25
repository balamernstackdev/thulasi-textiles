import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

const IMAGE_MAPPING: Record<string, string> = {
    // Men's Collection
    'Shirts': 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=800&q=80',
    'T-Shirts': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    'Jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
    'Trousers': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
    'Ethnic Wear': 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=800&q=80',
    'Innerwear': 'https://images.unsplash.com/photo-1588615419957-ed6999f69742?auto=format&fit=crop&w=800&q=80',

    // Women's Collection
    'Sarees': 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=800&q=80',
    'Kurtas & Kurtis': 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&w=800&q=80',
    'Lehengas': 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80',
    'Jeans & Jeggings': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    'Tops & Tees': 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&w=800&q=80',
    'Lingerie': 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80',

    // Kids' Collection
    'Boys Clothing': 'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=800&q=80',
    'Girls Clothing': 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=800&q=80',
    'Infants': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    'School Uniforms': 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80',

    // Home Linen
    'Bedsheets': 'https://images.unsplash.com/photo-1628592102751-ba83b0314276?auto=format&fit=crop&w=800&q=80',
    'Curtains': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    'Towels': 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
    'Blankets': 'https://images.unsplash.com/photo-1580302581600-244386541603?auto=format&fit=crop&w=800&q=80',
    'Cushion Covers': 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
};

async function uploadAndSeed() {
    console.log('Starting Cloudinary image upload...');

    const products = await prisma.product.findMany({
        include: { category: { include: { parent: true } } }
    });

    for (const product of products) {
        let sourceUrl = 'https://images.unsplash.com/photo-1523381235208-17b173399450?auto=format&fit=crop&w=800&q=80'; // fallback

        // Find best match based on category name
        const catName = product.category.name;
        const parentName = product.category.parent?.name;

        if (IMAGE_MAPPING[catName]) {
            sourceUrl = IMAGE_MAPPING[catName];
        } else if (parentName && IMAGE_MAPPING[parentName]) {
            sourceUrl = IMAGE_MAPPING[parentName];
        }

        try {
            console.log(`Uploading image for product: ${product.name}`);
            const result = await cloudinary.uploader.upload(sourceUrl, {
                folder: 'textiles/products',
                public_id: `${product.slug}_primary`,
                overwrite: true,
            });

            // Update ProductImage in DB
            await prisma.productImage.updateMany({
                where: { productId: product.id, isPrimary: true },
                data: { url: result.secure_url }
            });

            console.log(`Successfully updated ${product.name} with ${result.secure_url}`);
        } catch (error) {
            console.error(`Failed to upload for ${product.name}:`, error);
        }
    }

    console.log('Finished uploading and seeding images.');
}

uploadAndSeed()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
