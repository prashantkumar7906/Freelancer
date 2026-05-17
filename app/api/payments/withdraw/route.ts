import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, amount, method, details } = body;

        if (!userId || !amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid withdrawal request" }, { status: 400 });
        }

        const wallet = await prisma.wallet.findUnique({ where: { userId } });
        if (!wallet || wallet.balance < amount) {
            return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
        }

        // 1. Deduct from wallet
        await prisma.wallet.update({
            where: { userId },
            data: { balance: { decrement: parseFloat(amount) } }
        });

        // 2. Create transaction record
        const transaction = await prisma.transaction.create({
            data: {
                userId,
                amount: -parseFloat(amount),
                type: "WITHDRAWAL",
                description: `Withdrawal to ${method} (${details})`,
                status: "IN_PROGRESS",
                createdAt: new Date()
            }
        });

        return NextResponse.json({ message: "Withdrawal request submitted", transaction });
    } catch (error) {
        console.error("Withdrawal error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
