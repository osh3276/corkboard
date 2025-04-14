"use client";

import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import { DateTime } from "luxon";
import Link from "next/link";
import Post from "@/components/ui/Post"; // Adjust path if needed
import { Header } from "./header";

type PostData = {
  id: string;
  title: string;
  content: string;
  author?: string | null;
  createdAt: string;
  expiresAt: string;
};

const breakpointColumnsObj = {
  default: 6,
  1640: 5,
  1310: 4,
  980: 3,
  650: 2,
  320: 1,
};

export default function HomePage() {
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data.reverse()))
      .catch((err) => console.error("Failed to fetch posts:", err));
  }, []);

  if (posts.length === 0) {
    return (
      <>
        <Header />
        <p className="posts-container">no new posts.</p>
      </>
    );
  }

  return (
    <>
      <Header />
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="posts-container"
      >
        {posts.map((post) => (
          <Link href={`/post/${post.id}`} key={post.id}>
            <Post
              key={post.id}
              author={post.author || "anonymous"}
              date={
                DateTime.fromISO(post.createdAt, { zone: "utc" })
                  .setZone(DateTime.now().zoneName)
                  .toRelative({ base: DateTime.now() }) || "just now"
              }
              content={post.title}
              postNumber={post.id}
            />
          </Link>
        ))}
      </Masonry>
    </>
  );
}
