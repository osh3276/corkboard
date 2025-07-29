import { db } from "@/db";
import { usersTable } from "@/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const { username, password } = await req.json();

	const user = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.username, username))
		.then((rows) => rows[0]);

	if (!user) {
		return NextResponse.json(
			{ error: "Invalid username or password" },
			{ status: 401 },
		);
	}

	const passwordMatch = await bcrypt.compare(password, user.password);

	if (!passwordMatch) {
		return NextResponse.json(
			{ error: "Invalid username or password" },
			{ status: 401 },
		);
	}

	// Auth successful
	return NextResponse.json({ message: "Login successful" });
}
