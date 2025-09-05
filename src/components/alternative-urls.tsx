"use client";
import { EllipsisVerticalIcon } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { AlternativeUrl } from "~/server/db/schema";

export const AlternativeUrls = ({
	alternativeUrls,
	openInNewTab,
}: {
	alternativeUrls?: Array<AlternativeUrl>;
	openInNewTab: boolean;
}) => {
	if (!alternativeUrls || alternativeUrls.length === 0) {
		return null;
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				onClick={(e) => e.stopPropagation}
				className="ml-auto"
			>
				<EllipsisVerticalIcon />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Alternative URLs</DropdownMenuLabel>
				{alternativeUrls.map((url) => (
					<DropdownMenuItem key={url.url} className="flex items-center gap-2">
						<a
							href={url.url}
							className="flex items-center gap-2 w-full"
							target={openInNewTab ? "_blank" : undefined}
							rel={openInNewTab ? "noopener noreferrer" : undefined}
						>
							{url.name}
						</a>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
