import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  const postId = parseInt(id, 10);

  if (isNaN(postId)) {
    return new Response("Invalid post id", { status: 400 });
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return new Response("Post not found", { status: 404 });
  }

  return new Response(JSON.stringify(post), {
    headers: { "Content-Type": "application/json" },
  });
}
