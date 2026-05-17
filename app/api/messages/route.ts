import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Create a message
export async function POST(req: Request) {
    try {
        const { senderId, receiverId, projectId, content } = await req.json();

        if (!senderId || !receiverId || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const message = await prisma.message.create({
            data: {
                senderId,
                receiverId,
                projectId, // Optional, can be null
                message: content,
            },
        });

        return NextResponse.json(message);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Get messages between two users (conversation thread)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const contactId = searchParams.get("contactId"); // The other person

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        let where: any = {};

        if (contactId) {
            // Fetch thread between userId and contactId
            where = {
                OR: [
                    { senderId: userId, receiverId: contactId },
                    { senderId: contactId, receiverId: userId },
                ]
            };
        } else {
            // Fallback: just get messages for this user (inbox/sent combined or just inbox)
            // For this MVP, let's just return all messages involving this user if no contact specified
            // But the UI logic is changing to specific threads. 
            // If no contactId, maybe returning list of recent contacts? 
            // For simplicity, let's keep it handled by frontend requesting with contactId.
            // If no contactId is provided, we might return empty or all.
            where = {
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            };
        }

        const messages = await prisma.message.findMany({
            where,
            orderBy: { createdAt: "asc" }, // Chat usually ascending
        });

        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
