
const { revalidateCategories } = require('../src/lib/actions/category');

async function main() {
    console.log('Revalidating categories...');
    const result = await revalidateCategories();
    console.log('Result:', result);
}

main()
    .catch((e) => { console.error(e); process.exit(1); });
