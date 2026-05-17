const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash("password123", 10);

    const users = [
        {
            email: "admin@pro.com",
            passwordHash,
            role: "ADMIN",
            emailVerified: true,
            phoneVerified: true,
            status: "APPROVED",
            phoneNumber: "1234567890",
        },
        {
            email: "buyer@pro.com",
            passwordHash,
            role: "BUYER",
            emailVerified: true,
            phoneVerified: true,
            status: "APPROVED",
            phoneNumber: "1234567891",
        },
        {
            email: "freelancer@pro.com",
            passwordHash,
            role: "FREELANCER",
            emailVerified: true,
            phoneVerified: true,
            status: "APPROVED",
            phoneNumber: "1234567892",
        },
    ];

    for (const user of users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: user,
        });
    }

    console.log("Seeding complete. Use password: password123");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
