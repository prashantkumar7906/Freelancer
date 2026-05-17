import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const [totalUsers, activeProjects, transactions] = await Promise.all([
            prisma.user.count(),
            prisma.project.count({ where: { status: "OPEN" } }),
            prisma.transaction.findMany({
                orderBy: { createdAt: "desc" },
            }),
        ]);

        const totalRevenue = transactions
            .filter((t: any) => t.status === "COMPLETED" && (t.type === "DEPOSIT" || t.type === "UPFRONT" || t.type === "RELEASE"))
            .reduce((acc: number, curr: any) => acc + curr.amount, 0);

        // Recent Activity (merging users and projects for logs)
        const [recentUsers, recentProjects] = await Promise.all([
            prisma.user.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
            prisma.project.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
        ]);

        const activity = [
            ...recentUsers.map((u: any) => ({ type: "USER", detail: `New Identity: ${u.email}`, time: u.createdAt })),
            ...recentProjects.map((p: any) => ({ type: "PROJECT", detail: `New Mission: ${p.title}`, time: p.createdAt })),
        ].sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());

        return NextResponse.json({
            totalRevenue,
            activeProjects,
            totalUsers,
            transactionVolume: totalRevenue * 1.5, // estimate for now
            activity: activity.slice(0, 10),
            transactions: transactions,
        });
    } catch (error) {
        console.error("Stats fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
