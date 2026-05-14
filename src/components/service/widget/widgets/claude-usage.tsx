import type { WIDGETS } from "~/lib/widgets";

type Props = {
	config: Extract<WIDGETS, { type: "claude-usage" }>["config"];
};
export const ClaudeUsageWidget = ({ config }: Props) => {
	return (
		<div className="fullscreen h-60 w-sm overflow-hidden rounded-md border">
			<iframe
				src={config.url}
				title="Claude Usage"
				className="h-full w-full border-0"
				loading="lazy"
			/>
		</div>
	);
};
