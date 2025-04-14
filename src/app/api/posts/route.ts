import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const { username, content, title } = await req.json();

  if (!content || !title) {
    return NextResponse.json(
      { error: "Missing content or title" },
      { status: 400 },
    );
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        author: username || null,
        title,
        content,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (err) {
    console.error("Error creating post:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
