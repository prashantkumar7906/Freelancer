import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-for-dev");

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
        if (request.nextUrl.pathname.startsWith("/admin") ||
            request.nextUrl.pathname.startsWith("/buyer") ||
            request.nextUrl.pathname.startsWith("/freelancer")) {
            return NextResponse.redirect(new URL("/auth", request.url));
        }
        return NextResponse.next();
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const role = payload.role as string;

        // Route protection based on role
        if (request.nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
            return NextResponse.redirect(new URL("/auth", request.url));
        }
        if (request.nextUrl.pathname.startsWith("/buyer") && role !== "BUYER") {
            return NextResponse.redirect(new URL("/auth", request.url));
        }
        if (request.nextUrl.pathname.startsWith("/freelancer") && role !== "FREELANCER") {
            return NextResponse.redirect(new URL("/auth", request.url));
        }

        // Redirect already logged in users from auth page
        if (request.nextUrl.pathname === "/auth") {
            if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
            if (role === "BUYER") return NextResponse.redirect(new URL("/buyer", request.url));
            return NextResponse.redirect(new URL("/freelancer", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL("/auth", request.url));
    }
}

export const config = {
    matcher: ["/admin/:path*", "/buyer/:path*", "/freelancer/:path*", "/auth"],
};
