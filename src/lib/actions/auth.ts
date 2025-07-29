"use server";

import { db } from "@/db";
import { authTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { getSession, SessionData } from "../session";

/**
 * Checks if a user with the given username exists in the auth table.
 * @param username - The username to check.
 * @returns A promise that resolves to a boolean indicating user existence.
 */
export async function checkUserExists(username: string): Promise<boolean> {
	if (!username) {
		return false;
	}
	const user = await db
		.select({ id: authTable.id })
		.from(authTable)
		.where(eq(authTable.username, username));
	return user.length > 0;
}

/**
 * Logs a user in by verifying their credentials.
 * @param formData - The form data containing username and password.
 * @throws Will throw an error if login fails.
 */
export async function login(formData: FormData): Promise<void> {
	const username = formData.get("username") as string;
	const password = formData.get("password") as string;

	if (!username || !password) {
		throw new Error("Username and password are required.");
	}

	const user = await db
		.select()
		.from(authTable)
		.where(eq(authTable.username, username))
		.then((rows) => rows[0]);

	if (!user) {
		throw new Error("Invalid username or password.");
	}

	const passwordMatch = await bcrypt.compare(password, user.password);

	if (!passwordMatch) {
		throw new Error("Invalid username or password.");
	}

	// Create session
	const session = await getSession();
	session.username = user.username;
	session.isLoggedIn = true;
	await session.save();
}

/**
 * Signs a new user up by creating a new entry in the auth table.
 * @param formData - The form data containing username and password.
 * @throws Will throw an error if signup fails (e.g., user already exists).
 */
export async function signup(formData: FormData): Promise<void> {
	const username = formData.get("username") as string;
	const password = formData.get("password") as string;

	if (!username || !password) {
		throw new Error("Username and password are required.");
	}

	const existingUser = await db
		.select({ id: authTable.id })
		.from(authTable)
		.where(eq(authTable.username, username));

	if (existingUser.length > 0) {
		throw new Error("Username is already taken.");
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	await db.insert(authTable).values({ username, password: hashedPassword });

	// Create session
	const session = await getSession();
	session.username = username;
	session.isLoggedIn = true;
	await session.save();
}

/**
 * Logs the current user out by destroying their session.
 */
export async function logout(): Promise<void> {
	const session = await getSession();
	session.destroy();
}

/**
 * Retrieves the current session data.
 * @returns A promise that resolves to the session data.
 */
export async function getSessionData(): Promise<SessionData> {
	const session = await getSession();
	return {
		username: session.username,
		isLoggedIn: session.isLoggedIn,
	};
}
