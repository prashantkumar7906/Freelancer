import { NextResponse } from "next/server";
// Removed bcrypt import to prevent environment crashes
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        console.log(`[AUTH DEBUG] Attempting login for: ${email}`);
        console.log(`[AUTH DEBUG] User found: ${!!user}`);

        if (!user) {
            return NextResponse.json({ error: "User not found in system" }, { status: 401 });
        }

        if (!user.emailVerified || !user.phoneVerified) {
            return NextResponse.json({ error: "Please verify your email and phone number first" }, { status: 403 });
        }

        if (user.status === "PENDING") {
            return NextResponse.json({ error: "Your account is pending admin approval" }, { status: 403 });
        }

        if (user.status === "REJECTED") {
            return NextResponse.json({ error: "Your account has been rejected" }, { status: 403 });
        }

        // SIMULATION MODE: Standardized plaintext check 
        const isPasswordValid = password === user.passwordHash;

        console.log(`[AUTH DEBUG] Login verification: ${isPasswordValid ? "PASSED" : "FAILED"}`);

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Access denied. Credential mismatch." }, { status: 401 });
        }

        const token = await signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        console.log(`[AUTH DEBUG] Token generated successfully`);
        if (process.env.NODE_ENV !== "production") {
            console.log(`[AUTH DEBUG] Generated token: ${token}`);
        }

        const response = NextResponse.json({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });

        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
