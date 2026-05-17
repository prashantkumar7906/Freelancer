import prisma from "./lib/prisma";
import bcrypt from "bcrypt";

async function main() {
    try {
        const passwordHash = await bcrypt.hash("password123", 10);
        const users = [
            {
                email: "admin@pro.com",
                passwordHash,
                role: "ADMIN",
                emailVerified: true,
                phoneVerified: true,
                status: "APPROVED",
                phoneNumber: "0000000001",
            },
            {
                email: "buyer@pro.com",
                passwordHash,
                role: "BUYER",
                emailVerified: true,
                phoneVerified: true,
                status: "APPROVED",
                phoneNumber: "0000000002",
            },
            {
                email: "freelancer@pro.com",
                passwordHash,
                role: "FREELANCER",
                emailVerified: true,
                phoneVerified: true,
                status: "APPROVED",
                phoneNumber: "0000000003",
            },
        ];

        for (const user of users) {
            await (prisma.user as any).upsert({
                where: { email: user.email },
                update: {},
                create: user,
            });
            console.log(`Created/Verified user: ${user.email}`);
        }
    } catch (e) {
        console.error("Error during seeding:", e);
    } finally {
        await (prisma as any).$disconnect();
    }
}

main();
