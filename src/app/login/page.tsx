"use client";

import { useTransition, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Header } from "../../components/header";
import { checkUserExists, login, signup } from "@/lib/actions/auth";

export default function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	const handleSubmit = async (formData: FormData) => {
		startTransition(async () => {
			try {
				const username = formData.get("username") as string;
				const userExists = await checkUserExists(username);

				if (userExists) {
					await login(formData);
				} else {
					await signup(formData);
				}
				router.push("/");
			} catch (err) {
				if (err instanceof Error) {
					alert(err.message);
				} else {
					alert("An unknown error occurred. Please try again.");
				}
				console.error(err);
			}
		});
	};

	// Character limit constants
	const usernameLimit = 32;
	const passwordLimit = 255;

	// Character counters
	const usernameLength = username.length;
	const passwordLength = password.length;

	return (
		<>
			<Header />
			<main className="max-w-xl mx-auto mt-8 px-4">
				<h1 className="text-3xl font-bold mb-4">log in</h1>

				<form action={handleSubmit} className="space-y-4">
					<div>
						<Input
							name="username"
							placeholder="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							maxLength={usernameLimit}
						/>
						<p className="text-sm text-muted-foreground">
							{usernameLength}/{usernameLimit}
						</p>
					</div>
					<div>
						<Input
							name="password"
							type="password"
							placeholder="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							maxLength={passwordLimit}
						/>
						<p className="text-sm text-muted-foreground">
							{passwordLength}/{passwordLimit}
						</p>
					</div>
					<Button
						type="submit"
						className="w-full"
						disabled={
							pending ||
							usernameLength === 0 ||
							passwordLength === 0
						}
					>
						{pending ? "submitting..." : "log in / sign up"}
					</Button>
				</form>
			</main>
		</>
	);
}
