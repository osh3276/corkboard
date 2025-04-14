import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post) return new Response("Not found", { status: 404 });

  return Response.json(post);
}
