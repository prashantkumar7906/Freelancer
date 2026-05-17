import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { action, reason } = await req.json(); // action: "APPROVE" or "REJECT"
        const { id } = await params;

        const status = action === "APPROVE" ? "APPROVED" : "REJECTED";

        const user = await prisma.user.update({
            where: { id },
            data: { status },
        });

        // In a real app, send email notification here
        console.log(`User ${user.email} status updated to ${status}. Reason: ${reason || "N/A"}`);

        return NextResponse.json({ message: `User ${status.toLowerCase()} successfully` });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
