import bcrypt from "bcrypt";
import { usersTable } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Handles sign up
 * @param req
 * @param res
 * @returns
 */
export async function POST(req: Request) {
	const { username, password } = await req.json();

	if (
		!username ||
		!password ||
		typeof username !== "string" ||
		typeof password !== "string"
	) {
		return NextResponse.json({ error: "Invalid input" }, { status: 400 });
	}

	const existing = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.username, username));
	if (existing.length > 0) {
		return NextResponse.json(
			{ error: "Username already taken" },
			{ status: 409 },
		);
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	await db.insert(usersTable).values({ username, password: hashedPassword });

	return NextResponse.json({
		message: "User created successfully",
		success: true,
	});
}
