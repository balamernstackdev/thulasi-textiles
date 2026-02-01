import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const cs = await prisma.category.findMany({ where: { name: { contains: 'Saree' } } });
    console.log(cs.map(c => ({ name: c.name, slug: c.slug, id: c.id, parentId: c.parentId })));
}
main().finally(() => prisma.$disconnect());
