"use client";

import { Header } from "@/app/header";
import { DateTime } from "luxon";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Post {
  title: string;
  content: string;
  author: string | null;
  createdAt: string;
}

export default function PostPage() {
  const params = useParams();
  const id = params?.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // Fetch post data from the API route
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
          throw new Error("Post not found");
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          console.error(err.message);
        } else {
          setError("something went wrong.");
          console.error("Unknown error", err);
        }
      }
    };

    fetchPost();
  }, [id]);

  if (error) {
    return (
      <>
        <Header />
        <main className="max-w-3xl mx-auto mt-10 mb-10 px-4">
          <p>{error}</p>
        </main>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className="max-w-3xl mx-auto mt-10 mb-10 px-4">
          <p>loading...</p>
        </main>
      </>
    );
  }

  const { title, content, author, createdAt } = post;
  const displayDate =
    DateTime.fromISO(createdAt, { zone: "utc" })
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
