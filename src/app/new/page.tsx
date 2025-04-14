// app/new/page.tsx

"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Header } from "../header";
import { neon } from "@neondatabase/serverless";

export default function NewPostPage() {
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ username, title, content }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/"); // redirect to homepage
    } else {
      alert("post failed. try again?");
    }
  }

  const labels = [
    "sing to the world.",
    "release your inner demons.",
    "shout into the void.",
    "whisper your secrets.",
    "confess your crimes (or hobbies).",
    "nobody will know it's you.",
    "stick it to the cork.",
  ];
  const content_placeholders = [
    "your song",
    "your demons",
    "your message",
    "your secrets",
    "your confession",
    "your true self",
    "your stickie",
  ];
  // generate random number for message
  const i = useMemo(
    () => Math.floor(Math.random() * labels.length),
    [labels.length],
  );
  const label = labels[i];
  const content_placeholder = content_placeholders[i];

  return (
    <>
      <Header />
      <main className="max-w-xl mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-4">{label}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="username (leave blank for anonymous)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder={content_placeholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button type="submit" className="w-full">
            post
          </Button>
        </form>
      </main>
    </>
  );
}
