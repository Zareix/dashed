import type { WIDGETS } from "~/lib/widgets";

type Props = {
	config: Extract<WIDGETS, { type: "home-assistant" }>["config"];
};

export const HomeAssistantWidget = ({ config }: Props) => {
	return (
		<div className="fullscreen h-100 w-125 overflow-hidden rounded-md border">
			<iframe
				src={config.url}
				title="Home Assistant Dashboard"
				className="h-full w-full border-0"
				loading="lazy"
				sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
			/>
		</div>
	);
};
