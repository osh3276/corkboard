"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSessionData, logout } from "@/lib/actions/auth";
import { type SessionData } from "@/lib/session";

export function Header() {
	const [session, setSession] = useState<SessionData>({ isLoggedIn: false });
	const router = useRouter();

	useEffect(() => {
		getSessionData().then(setSession);
	}, []);

	const handleLogout = async () => {
		await logout();
		setSession({ isLoggedIn: false });
		router.refresh();
	};

	return (
		<div className="header p-2 m-0 flex items-center justify-between text-left bg-muted">
			<Link href="/" className="text-5xl font-bold">
				the corkboard.
			</Link>
			<div className="flex items-end space-x-3">
				<ThemeToggle />
				<Link href="/new">
					<Button>new post</Button>
				</Link>
				{session.isLoggedIn ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button>logged in as: {session.username}</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onSelect={handleLogout}>
								Log Out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<Link href="/login">
						<Button>login</Button>
					</Link>
				)}
			</div>
		</div>
	);
}
