import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { userId, otpCode } = await req.json();

        if (!userId || !otpCode) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const verification = await prisma.phoneVerification.findFirst({
            where: {
                userId,
                verifiedAt: null,
            },
            orderBy: {
                expiresAt: "desc",
            },
        });

        if (!verification) {
            return NextResponse.json({ error: "Verification session not found" }, { status: 404 });
        }

        if (verification.expiresAt < new Date()) {
            return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
        }

        // In production, compare hashed codes
        if (verification.otpCode !== otpCode) {
            await prisma.phoneVerification.update({
                where: { id: verification.id },
                data: { attempts: { increment: 1 } },
            });
            return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
        }

        await prisma.$transaction([
            prisma.phoneVerification.update({
                where: { id: verification.id },
                data: { verifiedAt: new Date() },
            }),
            prisma.user.update({
                where: { id: userId },
                data: {
                    phoneVerified: true,
                    phoneVerifiedAt: new Date(),
                },
            }),
        ]);

        return NextResponse.json({ message: "Phone verified successfully" });
    } catch (error) {
        console.error("Phone verification error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
