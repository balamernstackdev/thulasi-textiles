import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const total = await prisma.product.count();
    const active = await prisma.product.count({ where: { isActive: true } });
    const sarees = await prisma.product.count({ where: { category: { slug: 'women-sarees' } } });
    const activeSarees = await prisma.product.count({ where: { category: { slug: 'women-sarees' }, isActive: true } });
    console.log({ total, active, sarees, activeSarees });
}
main().finally(() => prisma.$disconnect());
