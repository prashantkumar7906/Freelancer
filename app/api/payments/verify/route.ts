import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
            amount,
            type, // 'DEPOSIT' or 'PROJECT_PAYMENT'
            projectId
        } = await req.json();

        const secret = process.env.RAZORPAY_KEY_SECRET || "fallback_secret";
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
        }

        // Process success
        if (type === 'DEPOSIT') {
            await prisma.$transaction([
                prisma.wallet.update({
                    where: { userId },
                    data: { balance: { increment: parseFloat(amount) } },
                }),
                prisma.transaction.create({
                    data: {
                        userId,
                        amount: parseFloat(amount),
                        type: "DEPOSIT",
                        status: "COMPLETED",
                        razorpayPaymentId: razorpay_payment_id,
                    }
                })
            ]);
        } else if (type === 'PROJECT_PAYMENT') {
            // Logic for project payments (30% upfront etc)
            await prisma.transaction.create({
                data: {
                    userId,
                    projectId,
                    amount: parseFloat(amount),
                    type: "UPFRONT",
                    status: "COMPLETED",
                    razorpayPaymentId: razorpay_payment_id,
                }
            });
            // Further status updates for project/bid would happen here
        }

        return NextResponse.json({ message: "Payment verified and processed successfully" });
    } catch (error) {
        console.error("Payment verification error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
