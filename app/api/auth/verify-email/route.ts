import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: "Token is required" }, { status: 400 });
        }

        const verification = await prisma.emailVerification.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!verification) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }

        if (verification.expiresAt < new Date()) {
            return NextResponse.json({ error: "Token has expired" }, { status: 400 });
        }

        if (verification.verifiedAt) {
            return NextResponse.json({ message: "Email already verified" });
        }

        await prisma.$transaction([
            prisma.emailVerification.update({
                where: { id: verification.id },
                data: { verifiedAt: new Date() },
            }),
            prisma.user.update({
                where: { id: verification.userId },
                data: {
                    emailVerified: true,
                    emailVerifiedAt: new Date(),
                },
            }),
        ]);

        return NextResponse.json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Email verification error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
