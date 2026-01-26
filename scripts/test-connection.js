
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
    console.log('--- Database Connection Test ---');
    console.log('Target Host:', process.env.DB_HOST);
    console.log('Target Port:', process.env.DB_PORT);
    console.log('Full URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')); // Hide password
    console.log('\nAttempting to connect...');

    try {
        // Simple query to test the connection
        const result = await prisma.$queryRaw`SELECT 1 as connected`;
        console.log('\n✅ SUCCESS: Successfully reached the database!');
        console.log('Result:', result);

        // Check if any categories exist
        const count = await prisma.category.count();
        console.log(`\nFound ${count} categories in the database.`);

    } catch (error) {
        console.error('\n❌ FAILURE: Could not connect to the database.');
        console.error('\n--- Error Details ---');
        console.error('Message:', error.message);
        if (error.code) console.error('Error Code:', error.code);

        console.log('\n--- Troubleshooting Tips ---');
        console.log('1. IP Allowlist: Go to Aiven Console > MySQL > Overview > IP Filter and add your current public IP.');
        console.log('2. Service Status: Ensure your Aiven MySQL service is in "RUNNING" state.');
        console.log('3. Firewall: If you are at an office/managed network, port 26800 might be blocked locally.');
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
