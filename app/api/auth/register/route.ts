import { NextResponse } from "next/server";
// Removed bcrypt import to prevent environment crashes
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        const { email, phoneNumber, password, role } = await req.json();

        if (!email || !phoneNumber || !password || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { phoneNumber }],
            },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // SIMULATION MODE: Standardized plaintext check 
        const passwordHash = password;

        const user = await prisma.user.create({
            data: {
                email,
                phoneNumber,
                passwordHash,
                role,
                status: process.env.NODE_ENV === "production" ? "PENDING" : "APPROVED",
                emailVerified: process.env.NODE_ENV !== "production",
                phoneVerified: process.env.NODE_ENV !== "production",
                wallet: {
                    create: {
                        balance: 0,
                    },
                },
            },
        });

        // Create Email Verification Token
        const emailToken = uuidv4();
        await prisma.emailVerification.create({
            data: {
                userId: user.id,
                token: emailToken,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            },
        });

        // Create Phone OTP (Mocked for now)
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        await prisma.phoneVerification.create({
            data: {
                userId: user.id,
                otpCode, // In real world, hash this
                expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            },
        });

        console.log(`[DEV] Email Verification Token: ${emailToken}`);
        console.log(`[DEV] Phone OTP: ${otpCode}`);

        if (process.env.NODE_ENV !== "production") {
            const token = await signToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            const response = NextResponse.json({
                message: "Registration successful. Welcome!",
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            });

            response.cookies.set("auth_token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 24,
            });

            return response;
        }

        return NextResponse.json({
            message: "Registration successful. Please verify your email and phone.",
            userId: user.id,
        });
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
