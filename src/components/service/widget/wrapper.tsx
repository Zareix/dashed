import { Widget } from "~/components/service/widget";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "~/components/ui/hover-card";
import type { getData } from "~/server/data";
import { HydrateClient } from "~/trpc/server";

export const ServiceWrapper = ({
	widget,
	children,
}: {
	children: React.ReactNode;
	widget: Awaited<ReturnType<typeof getData>>[0]["services"][0]["widget"];
}) => {
	if (!widget || widget.type === "none") {
		return <div>{children}</div>;
	}

	// TODO This works but will be evaluated ONLY at first refresh
	// if (widget.type === "karakeep") {
	// 	void api.widget[widget.type].prefetch(widget.config);
	// }

	return (
		<HoverCard openDelay={0} closeDelay={100}>
			<HoverCardTrigger asChild>
				<div>{children}</div>
			</HoverCardTrigger>
			<HoverCardContent className="w-fit">
				<HydrateClient>
					<Widget widget={widget} />
				</HydrateClient>
			</HoverCardContent>
		</HoverCard>
	);
};
