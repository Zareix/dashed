import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { ExternalLinkIcon } from "lucide-react";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

type Props = {
	config: Extract<WIDGETS, { type: "kavita" }>["config"];
};

const TypeIcon = ({ type }: { type: number }) => {
	switch (type) {
		case 0:
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
					width="16"
					height="16"
					fill="currentColor"
				>
					<title>Manga</title>
					<path d="M256 141.3l0 309.3 .5-.2C311.1 427.7 369.7 416 428.8 416l19.2 0 0-320-19.2 0c-42.2 0-84.1 8.4-123.1 24.6-16.8 7-33.4 13.9-49.7 20.7zM230.9 61.5L256 72 281.1 61.5C327.9 42 378.1 32 428.8 32L464 32c26.5 0 48 21.5 48 48l0 352c0 26.5-21.5 48-48 48l-35.2 0c-50.7 0-100.9 10-147.7 29.5l-12.8 5.3c-7.9 3.3-16.7 3.3-24.6 0l-12.8-5.3C184.1 490 133.9 480 83.2 480L48 480c-26.5 0-48-21.5-48-48L0 80C0 53.5 21.5 32 48 32l35.2 0c50.7 0 100.9 10 147.7 29.5z" />
				</svg>
			);
		default:
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 448 512"
					width="16"
					height="16"
					fill="currentColor"
				>
					<title>Books</title>
					<path d="M384 512L96 512c-53 0-96-43-96-96L0 96C0 43 43 0 96 0L400 0c26.5 0 48 21.5 48 48l0 288c0 20.9-13.4 38.7-32 45.3l0 66.7c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0zM96 384c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0 0-64-256 0zm32-232c0 13.3 10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0c-13.3 0-24 10.7-24 24zm24 72c-13.3 0-24 10.7-24 24s10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0z" />
				</svg>
			);
	}
};

export const KavitaWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = useQuery(
		{
			queryKey: ["widget", "kavita", config],
			queryFn: () => actions.widget.kavita(config),
			select: (res) => {
				if (res.error) throw new Error(res.error.message);
				return res.data;
			},
		},
		queryClient,
	);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !data) {
		return <div>Error</div>;
	}

	return (
		<div className="grid max-w-[300px] gap-1">
			{data.map((library) => (
				<a
					key={library.id}
					href={`${config.url}/library/${library.id}`}
					className="group flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors hover:bg-accent"
					target="_blank"
					rel="noreferrer"
				>
					<TypeIcon type={library.type} /> {library.name}
					<ExternalLinkIcon
						size={10}
						className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
					/>
				</a>
			))}
		</div>
	);
};
