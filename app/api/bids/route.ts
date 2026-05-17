import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { projectId, freelancerId, bidAmount, proposal } = await req.json();

        if (!projectId || !freelancerId || !bidAmount || !proposal) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if project is still open
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project || project.status !== "OPEN") {
            return NextResponse.json({ error: "Project is no longer open for bidding" }, { status: 400 });
        }

        // Check if freelancer already bid
        const existingBid = await prisma.bid.findFirst({
            where: { projectId, freelancerId },
        });

        if (existingBid) {
            return NextResponse.json({ error: "You have already submitted a bid for this project" }, { status: 400 });
        }

        const bid = await prisma.bid.create({
            data: {
                projectId,
                freelancerId,
                bidAmount: parseFloat(bidAmount),
                proposal,
            },
        });

        // Create history entry
        await prisma.bidStatusHistory.create({
            data: {
                bidId: bid.id,
                newStatus: "PENDING",
                changedBy: freelancerId,
            }
        });

        // In production, trigger "Bid Submitted" email to freelancer & "New Bid" to buyer
        console.log(`Bid submitted by ${freelancerId} for project ${projectId}`);

        return NextResponse.json({ message: "Bid submitted successfully", bid });
    } catch (error) {
        console.error("Bid submission error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const freelancerId = searchParams.get("freelancerId");
        const projectId = searchParams.get("projectId");

        const where: any = {};
        if (freelancerId) where.freelancerId = freelancerId;
        if (projectId) where.projectId = projectId;

        const bids = await prisma.bid.findMany({
            where,
            include: {
                project: true,
                freelancer: {
                    select: { email: true, phoneNumber: true }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(bids);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
