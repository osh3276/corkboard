import { deleteExpiredPosts } from "@/lib/actions/posts";
import { NextResponse } from "next/server";

export async function GET() {
  await deleteExpiredPosts();
  return NextResponse.json({ ok: true });
}
