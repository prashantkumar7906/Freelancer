import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { title, description, budget, category, buyerId } = await req.json();

        if (!title || !description || !budget || !category || !buyerId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const project = await prisma.project.create({
            data: {
                title,
                description,
                budget: parseFloat(budget),
                category,
                buyerId,
                status: "PENDING",
            },
        });

        return NextResponse.json({ message: "Project created successfully", project });
    } catch (error) {
        console.error("Project creation error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const buyerId = searchParams.get("buyerId");
        const status = searchParams.get("status") as any;

        const where: any = {};
        if (buyerId) where.buyerId = buyerId;
        if (status) where.status = status;

        const projects = await prisma.project.findMany({
            where,
            include: {
                _count: {
                    select: { bids: true }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
