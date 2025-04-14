"use client";

import Masonry from "react-masonry-css";
import { DateTime } from "luxon";
import Link from "next/link";
import Post from "@/components/ui/Post"; // Adjust path if needed
import { Header } from "./header";
import { useEffect, useState } from "react";

type PostData = {
  id: number;
  title: string;
  content: string;
  author?: string | null;
  createdAt: string;
};

const breakpointColumnsObj = {
  default: 6,
  1640: 5,
  1310: 4,
  980: 3,
  650: 2,
  320: 1,
};

function getShortRelativeTime(isoString: string): string {
  const now = DateTime.now();
  const then = DateTime.fromISO(isoString, { zone: "utc" }).setZone(
    now.zoneName,
  );
  const diff = now
    .diff(then, ["years", "months", "days", "hours", "minutes", "seconds"])
    .toObject();

  if (diff.years && diff.years >= 1) return `${Math.floor(diff.years)}y ago`;
  if (diff.months && diff.months >= 1)
    return `${Math.floor(diff.months)}mo ago`;
  if (diff.days && diff.days >= 1) return `${Math.floor(diff.days)}d ago`;
  if (diff.hours && diff.hours >= 1) return `${Math.floor(diff.hours)}h ago`;
  if (diff.minutes && diff.minutes >= 1)
    return `${Math.floor(diff.minutes)}m ago`;
  return `just now`;
}

export default function HomePage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => {
        if (!res.ok) throw new Error("failed to fetch posts");
        return res.json();
      })
      .then(setPosts)
      .catch((err) => {
        console.error(err);
        setError("couldn't load posts.");
      });
  }, []);

  if (error)
    return (
      <>
        <Header />
        <p className="posts-container">{error}</p>
      </>
    );

  if (posts.length === 0) {
    return (
      <>
        <Header />
        <p className="posts-container">no posts in the last 24 hours.</p>
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
              postID={post.id}
              author={post.author || "anonymous"}
              date={getShortRelativeTime(post.createdAt)}
              content={post.title}
            />
          </Link>
        ))}
      </Masonry>
    </>
  );
}
