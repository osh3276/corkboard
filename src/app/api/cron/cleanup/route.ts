import { PrismaClient } from "@/generated/client"; // or relative path
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h ago

  const deleted = await prisma.post.deleteMany({
    where: {
      createdAt: { lt: cutoff },
    },
  });

  return NextResponse.json({ deletedCount: deleted.count });
}
