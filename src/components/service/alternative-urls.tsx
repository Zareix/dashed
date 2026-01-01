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
			<DropdownMenuTrigger className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer p-1">
				<EllipsisVerticalIcon />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center">
				{alternativeUrls.map((url) => (
					<DropdownMenuItem
						key={url.url}
						render={
							<a
								href={url.url}
								className="flex w-full cursor-pointer items-center gap-2"
								target={openInNewTab ? "_blank" : undefined}
								rel={openInNewTab ? "noopener noreferrer" : undefined}
							>
								{url.name}
							</a>
						}
					/>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
