import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const settings = await prisma.platformSettings.findUnique({
            where: { settingName: "commission_rate" },
        });

        return NextResponse.json({
            commissionRate: settings ? parseFloat(settings.value) : 10, // Default 10%
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { commissionRate, updatedBy } = await req.json();

        if (commissionRate === undefined) {
            return NextResponse.json({ error: "Commission rate is required" }, { status: 400 });
        }

        const settings = await prisma.platformSettings.upsert({
            where: { settingName: "commission_rate" },
            update: {
                value: commissionRate.toString(),
            },
            create: {
                settingName: "commission_rate",
                value: commissionRate.toString(),
            },
        });

        return NextResponse.json({ message: "Commission rate updated successfully", value: settings.value });
    } catch (error) {
        console.error("Settings update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
