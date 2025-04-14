import { Header } from "@/app/header";
import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";

const prisma = new PrismaClient();

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post) return <p>post not found.</p>;

  const { title, content, author, createdAt } = post;
  const displayDate =
    DateTime.fromISO(createdAt.toISOString(), { zone: "utc" })
      .setZone(DateTime.now().zoneName)
      .toRelative({ base: DateTime.now() }) || "just now";

  return (
    <div>
      <Header />
      <main className="max-w-3xl mx-auto mt-10 mb-10 px-4">
        <h1 className="text-4xl font-bold mb-2 break-words">{title}</h1>

        <div className="text-sm text-muted-foreground mb-6">
          <p className="text-sm">by {author || "anonymous"}</p>
          <p className="text-sm">{displayDate}</p>
        </div>
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </main>
    </div>
  );
}
