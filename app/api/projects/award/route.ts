import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { bidId, buyerId } = await req.json();

        if (!bidId || !buyerId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const bid = await prisma.bid.findUnique({
            where: { id: bidId },
            include: { project: true, freelancer: true },
        });

        if (!bid || bid.project.buyerId !== buyerId) {
            return NextResponse.json({ error: "Unauthorized or invalid bid" }, { status: 403 });
        }

        if (bid.project.status !== "OPEN") {
            return NextResponse.json({ error: "Project is already awarded or closed" }, { status: 400 });
        }

        const upfrontAmount = bid.bidAmount * 0.3;

        // Check Buyer Wallet Balance
        const wallet = await prisma.wallet.findUnique({
            where: { userId: buyerId },
        });

        if (!wallet || wallet.balance < upfrontAmount) {
            return NextResponse.json({
                error: "Insufficient wallet balance for 30% upfront payment",
                requiredAmount: upfrontAmount,
                availableBalance: wallet?.balance || 0,
                insufficientFunds: true
            }, { status: 402 });
        }

        // Process Award & Upfront Payment
        await prisma.$transaction([
            // 1. Update Project Status
            prisma.project.update({
                where: { id: bid.projectId },
                data: { status: "AWARDED" },
            }),
            // 2. Update Bid Status
            prisma.bid.update({
                where: { id: bid.id },
                data: { status: "ACCEPTED" },
            }),
            // 3. Reject other bids
            prisma.bid.updateMany({
                where: {
                    projectId: bid.projectId,
                    id: { not: bid.id }
                },
                data: { status: "REJECTED" },
            }),
            // 4. Deduct from Buyer Wallet
            prisma.wallet.update({
                where: { userId: buyerId },
                data: { balance: { decrement: upfrontAmount } },
            }),
            // 5. Create Transaction Record (Escrow)
            prisma.transaction.create({
                data: {
                    userId: buyerId,
                    projectId: bid.projectId,
                    amount: upfrontAmount,
                    type: "UPFRONT",
                    status: "COMPLETED",
                }
            }),
            // 6. Record Status History for all bids (omitted for brevity in transaction but recommended)
        ]);

        // In production, trigger "Bid Accepted" email to freelancer & "Bid Rejected" to others
        console.log(`Project ${bid.project.title} awarded to ${bid.freelancer.email}. 30% upfront (₹${upfrontAmount}) deducted.`);

        return NextResponse.json({
            message: "Project awarded successfully. 30% upfront payment processed from wallet.",
            upfrontAmount
        });
    } catch (error) {
        console.error("Project award error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
