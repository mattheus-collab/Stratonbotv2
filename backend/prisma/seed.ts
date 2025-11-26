import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'stratonpay@gmail.com';
    const password = 'M100710$s';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    const config = await prisma.systemConfig.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            salesFeePercent: 5.0,
        },
    });

    console.log({ user, config });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
