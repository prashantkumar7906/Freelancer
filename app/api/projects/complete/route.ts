import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { projectId, buyerId } = await req.json();

        if (!projectId || !buyerId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                bids: { where: { status: "ACCEPTED" }, include: { freelancer: true } },
            },
        });

        if (!project || project.buyerId !== buyerId) {
            return NextResponse.json({ error: "Unauthorized or invalid project" }, { status: 403 });
        }

        if (project.status !== "AWARDED") {
            return NextResponse.json({ error: "Project must be in AWARDED status to complete" }, { status: 400 });
        }

        const acceptedBid = project.bids[0];
        if (!acceptedBid) {
            return NextResponse.json({ error: "No accepted bid found for this project" }, { status: 400 });
        }

        const balanceAmount = acceptedBid.bidAmount * 0.7;

        // Check Buyer Wallet Balance
        const buyerWallet = await prisma.wallet.findUnique({
            where: { userId: buyerId },
        });

        if (!buyerWallet || buyerWallet.balance < balanceAmount) {
            return NextResponse.json({
                error: "Insufficient balance for 70% final payment",
                requiredAmount: balanceAmount,
                insufficientFunds: true
            }, { status: 402 });
        }

        // Get commission rate
        const settings = await prisma.platformSettings.findUnique({
            where: { settingName: "commission_rate" },
        });
        const commissionRate = settings ? parseFloat(settings.value) / 100 : 0.1;

        const totalBudget = acceptedBid.bidAmount;
        const commissionAmount = totalBudget * commissionRate;
        const freelancerPayout = totalBudget - commissionAmount;

        // Process Final Payment & Completion
        await prisma.$transaction([
            // 1. Update Project Status
            prisma.project.update({
                where: { id: projectId },
                data: { status: "COMPLETED" },
            }),
            // 2. Deduct 70% from Buyer Wallet
            prisma.wallet.update({
                where: { userId: buyerId },
                data: { balance: { decrement: balanceAmount } },
            }),
            // 3. Create Final Payment Transaction
            prisma.transaction.create({
                data: {
                    userId: buyerId,
                    projectId: projectId,
                    amount: balanceAmount,
                    type: "BALANCE",
                    status: "COMPLETED",
                }
            }),
            // 4. Record Commission Deduction
            prisma.transaction.create({
                data: {
                    userId: acceptedBid.freelancerId,
                    projectId: projectId,
                    amount: commissionAmount,
                    type: "COMMISSION",
                    status: "COMPLETED",
                }
            }),
            // 5. Transfer Payout to Freelancer Wallet
            prisma.wallet.update({
                where: { userId: acceptedBid.freelancerId },
                data: { balance: { increment: freelancerPayout } },
            }),
            // 6. Record Freelancer Income Transaction
            prisma.transaction.create({
                data: {
                    userId: acceptedBid.freelancerId,
                    projectId: projectId,
                    amount: freelancerPayout,
                    type: "DEPOSIT", // Using deposit type for payout receipt
                    status: "COMPLETED",
                }
            }),
        ]);

        console.log(`Project ${project.title} completed. Commission ₹${commissionAmount} deducted. Freelancer paid ₹${freelancerPayout}.`);

        return NextResponse.json({
            message: "Project completed successfully. Final payment processed and freelancer paid.",
            freelancerPayout,
            commissionAmount
        });
    } catch (error) {
        console.error("Project completion error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
