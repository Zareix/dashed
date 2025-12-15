import { EllipsisVerticalIcon } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { AlternativeUrl } from "~/lib/db/schema";

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
				className="ml-auto cursor-pointer"
			>
				<EllipsisVerticalIcon />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{alternativeUrls.map((url) => (
					<DropdownMenuItem key={url.url} asChild>
						<a
							href={url.url}
							className="flex w-full cursor-pointer items-center gap-2"
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
