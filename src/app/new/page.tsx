"use client";

import { useMemo, useTransition, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Header } from "../header";
import { createPost } from "@/lib/actions/posts";

export default function NewPostPage() {
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await createPost(formData);
        router.push("/");
      } catch (err) {
        alert("post failed. try again?");
        console.error(err);
      }
    });
  };

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

  // Character limit constants
  const usernameLimit = 20;
  const titleLimit = 200;
  const contentLimit = 500;

  // Character counters
  const usernameLength = username.length;
  const titleLength = title.length;
  const contentLength = content.length;

  // Handle input changes
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= usernameLimit) setUsername(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= titleLimit) setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= contentLimit) setContent(e.target.value);
  };

  return (
    <>
      <Header />
      <main className="max-w-xl mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-4">{label}</h1>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="username"
              placeholder="username"
              value={username}
              onChange={handleUsernameChange}
            />
            <p className="text-sm text-muted-foreground">
              {usernameLength}/{usernameLimit}
            </p>
          </div>
          <div>
            <Input
              name="title"
              placeholder="title"
              value={title}
              onChange={handleTitleChange}
            />
            <p className="text-sm text-muted-foreground">
              {titleLength}/{titleLimit}
            </p>
          </div>
          <div>
            <Textarea
              name="content"
              placeholder={content_placeholder}
              value={content}
              onChange={handleContentChange}
            />
            <p className="text-sm text-muted-foreground">
              {contentLength}/{contentLimit}
            </p>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={
              pending ||
              usernameLength === 0 ||
              titleLength === 0 ||
              contentLength === 0
            }
          >
            {pending ? "posting..." : "post"}
          </Button>
        </form>
      </main>
    </>
  );
}
