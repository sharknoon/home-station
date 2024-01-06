import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Test connection to database
try {
	await prisma.$connect();
	console.info('Successfully connected to Database');
} catch (e) {
	console.error('Could not connect to Database: ' + e);
	process.exit(1);
}

// Initialize database
try {
    const systemExists = (await prisma.system.count()) > 0;
    if (!systemExists) {
        await prisma.system.create({});
    }
} catch (e) {
    console.error('Could not initialize Database: ' + e);
    process.exit(1);
}

export default prisma;
