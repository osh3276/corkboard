// app/posts/[id]/page.tsx
import { Header } from "@/components/header";
import { DateTime } from "luxon";
import { getPostById } from "@/lib/actions/posts";

export default async function PostPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const idInt = parseInt(id, 10);

	let post;
	try {
		post = await getPostById(idInt);
	} catch (err) {
		return (
			<>
				<Header />
				<main className="max-w-3xl mx-auto mt-10 mb-10 px-4">
					<p>{(err as Error).message}</p>
				</main>
			</>
		);
	}

	const { username, title, content, createdAt } = post;
	const displayDate =
		DateTime.fromISO(createdAt.toISOString(), { zone: "utc" })
			.setZone(DateTime.now().zoneName)
			.toRelative({ base: DateTime.now() }) || "just now";

	return (
		<>
			<Header />
			<main className="max-w-3xl mx-auto mt-10 mb-10 px-4">
				<h1 className="text-4xl font-bold mb-2 break-words">{title}</h1>

				<div className="text-sm text-muted-foreground mb-6">
					<p className="text-sm">by {username || "anonymous"}</p>
					<p className="text-sm">{displayDate}</p>
				</div>
				<p className="whitespace-pre-wrap break-words">{content}</p>
			</main>
		</>
	);
}
