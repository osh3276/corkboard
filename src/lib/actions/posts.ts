"use server";

import { PrismaClient } from "@/generated/client";

const prisma = new PrismaClient();

export async function getPostById(id: number) {
  if (isNaN(id)) {
    throw new Error("Invalid post ID");
  }

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
}

export async function getAllPosts() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return posts;
}

export async function createPost(formData: FormData) {
  const username = formData.get("username")?.toString() || null;
  const title = formData.get("title")?.toString() || "";
  const content = formData.get("content")?.toString() || "";

  if (!title || !content) {
    throw new Error("Missing title or content");
  }

  const post = await prisma.post.create({
    data: {
      author: username,
      title,
      content,
      createdAt: new Date(),
    },
  });

  return post;
}
