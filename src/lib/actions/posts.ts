"use server";

import { postsTable } from "@/db/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { lt } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { subHours } from "date-fns";

const db = drizzle(process.env.DATABASE_URL!);

export async function getPostById(id: number) {
  if (isNaN(id)) {
    throw new Error("Invalid post ID");
  }

  const post = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.id, id))
    .limit(1);

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
}

export async function getAllPosts() {
  console.log("Getting all posts");
  const posts = await db.select().from(postsTable);

  return posts;
}

export async function createPost(formData: FormData) {
  const username = formData.get("username")?.toString() || null;
  const title = formData.get("title")?.toString() || "";
  const content = formData.get("content")?.toString() || "";

  if (!title || !content) {
    throw new Error("Missing title or content");
  }

  const post: typeof postsTable.$inferInsert = {
    username: username,
    title: title,
    content: content,
    createdAt: new Date(),
  };

  await db.insert(postsTable).values(post);
  console.log("Post created");

  return post;
}

export async function deleteExpiredPosts() {
  const threshold = subHours(new Date(), 24);

  const deleted = await db
    .delete(postsTable)
    .where(lt(postsTable.createdAt, threshold));

  console.log("deleted old posts:", deleted);
}
