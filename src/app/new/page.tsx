// app/new/page.tsx

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Header } from "../header";

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

  return (
    <>
      <Header />
      <main className="max-w-xl mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-4">New Post</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Username (optional)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Post
          </Button>
        </form>
      </main>
    </>
  );
}
