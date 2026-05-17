import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { bidAmount, proposal } = body;

        const updatedBid = await prisma.bid.update({
            where: { id },
            data: {
                bidAmount: bidAmount ? parseFloat(bidAmount) : undefined,
                proposal: proposal,
            },
        });

        if (!updatedBid) {
            return NextResponse.json({ error: "Bid not found" }, { status: 404 });
        }

        return NextResponse.json(updatedBid);
    } catch (error) {
        console.error("Bid update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
