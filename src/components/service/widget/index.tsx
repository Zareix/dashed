import { BeszelWidget } from "~/components/service/widget/widgets/beszel";
import { ControlDWidget } from "~/components/service/widget/widgets/controld";
import { CupWidget } from "~/components/service/widget/widgets/cup";
import { GatusWidget } from "~/components/service/widget/widgets/gatus";
import { KarakeepWidget } from "~/components/service/widget/widgets/karakeep";
import { KomodoWidget } from "~/components/service/widget/widgets/komodo";
import { NextDNSWidget } from "~/components/service/widget/widgets/nextdns";
import { RadarrWidget } from "~/components/service/widget/widgets/radarr";
import SonarrWidget from "~/components/service/widget/widgets/sonarr";
import { SubtrackerWidget } from "~/components/service/widget/widgets/subtracker";
import UptimeKumaWidget from "~/components/service/widget/widgets/uptime-kuma";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "~/components/ui/hover-card";
import type { WIDGETS } from "~/lib/widgets";

export const ServiceWrapper = ({
	widget,
	children,
}: {
	children: React.ReactNode;
	widget: WIDGETS;
}) => {
	if (!widget || widget.type === "none") {
		return <div>{children}</div>;
	}

	return (
		<HoverCard openDelay={0} closeDelay={100}>
			<HoverCardTrigger asChild>
				<div>{children}</div>
			</HoverCardTrigger>
			<HoverCardContent className="w-fit">
				<Widget widget={widget} />
			</HoverCardContent>
		</HoverCard>
	);
};

export const Widget = ({ widget }: { widget: WIDGETS }) => {
	switch (widget.type) {
		case "cup":
			return <CupWidget config={widget.config} />;
		case "sonarr":
			return <SonarrWidget config={widget.config} />;
		case "radarr":
			return <RadarrWidget config={widget.config} />;
		case "uptime-kuma":
			return <UptimeKumaWidget config={widget.config} />;
		case "beszel":
			return <BeszelWidget config={widget.config} />;
		case "komodo":
			return <KomodoWidget config={widget.config} />;
		case "nextdns":
			return <NextDNSWidget config={widget.config} />;
		case "controld":
			return <ControlDWidget config={widget.config} />;
		case "gatus":
			return <GatusWidget config={widget.config} />;
		case "subtracker":
			return <SubtrackerWidget config={widget.config} />;
		case "karakeep":
			return <KarakeepWidget config={widget.config} />;
		default:
			return null;
	}
};

export type WidgetProps = {
	config: WIDGETS;
};
