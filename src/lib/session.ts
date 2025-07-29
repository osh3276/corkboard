import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

/**
 * Define the shape of the session data.
 */
export interface SessionData {
	username?: string;
	isLoggedIn?: boolean;
}

/**
 * Configuration options for iron-session.
 *
 * It's crucial that the SECRET_COOKIE_PASSWORD is set in your environment variables
 * and is a private string of at least 32 characters.
 */
export const sessionOptions: SessionOptions = {
	password: process.env.SECRET_COOKIE_PASSWORD as string,
	cookieName: "corkboard/session", // A unique name for your cookie
	cookieOptions: {
		// set secure to true in production for HTTPS.
		// localhost is treated as secure even with http, so it's safe to use in development.
		secure: true,
	},
};

/**
 * A server-side utility to get the current user session.
 * Can be used in Server Components, Server Actions, and Route Handlers.
 */
export async function getSession(): Promise<IronSession<SessionData>> {
	if (
		!process.env.SECRET_COOKIE_PASSWORD ||
		process.env.SECRET_COOKIE_PASSWORD.length < 32
	) {
		throw new Error(
			"SECRET_COOKIE_PASSWORD environment variable must be set and be at least 32 characters long.",
		);
	}
	return getIronSession<SessionData>(await cookies(), sessionOptions);
}
