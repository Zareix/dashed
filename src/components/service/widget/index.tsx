import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { BeszelWidget } from "~/components/service/widget/widgets/beszel";
import { ControlDWidget } from "~/components/service/widget/widgets/controld";
import { CupWidget } from "~/components/service/widget/widgets/cup";
import { GatusWidget } from "~/components/service/widget/widgets/gatus";
import { GodoxyWidget } from "~/components/service/widget/widgets/godoxy";
import { HomeAssistantWidget } from "~/components/service/widget/widgets/home-assistant";
import { KarakeepWidget } from "~/components/service/widget/widgets/karakeep";
import { KavitaWidget } from "~/components/service/widget/widgets/kavita";
import { KomodoWidget } from "~/components/service/widget/widgets/komodo";
import { NextDNSWidget } from "~/components/service/widget/widgets/nextdns";
import PocketIdWidget from "~/components/service/widget/widgets/pocket-id";
import { ProwlarrWidget } from "~/components/service/widget/widgets/prowlarr";
import { ProxmoxWidget } from "~/components/service/widget/widgets/proxmox";
import { QBittorrentWidget } from "~/components/service/widget/widgets/qbittorrent";
import { RadarrWidget } from "~/components/service/widget/widgets/radarr";
import SonarrWidget from "~/components/service/widget/widgets/sonarr";
import { SubtrackerWidget } from "~/components/service/widget/widgets/subtracker";
import { TraefikWidget } from "~/components/service/widget/widgets/traefik";
import UptimeKumaWidget from "~/components/service/widget/widgets/uptime-kuma";
import { VinceWidget } from "~/components/service/widget/widgets/vince";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "~/components/ui/hover-card";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

export const ServiceWrapper = ({
	widget,
	children,
}: {
	children: React.ReactNode;
	widget: WIDGETS;
}) => {
	useQuery(
		{
			queryKey: ["widget", widget.type, widget.config],
			queryFn: async () => {
				if (!widget || widget.type === "none") return null;
				return actions.widget[widget.type](
					// @ts-expect-error Can't infer type properly but checked with `actions.widget[widget.type]`
					widget.config,
				);
			},
			select: (res) => {
				if (!res || res.error)
					throw new Error(res?.error.message ?? "Unknown error");
				return res.data;
			},
			enabled: !!widget && widget.type !== "none" && window.innerWidth >= 640,
		},
		queryClient,
	);
	if (!widget || widget.type === "none" || window.innerWidth < 640) {
		return <div className="w-full">{children}</div>;
	}

	return (
		<HoverCard>
			<HoverCardTrigger
				delay={200}
				render={<div className="w-full">{children}</div>}
			/>
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
		case "kavita":
			return <KavitaWidget config={widget.config} />;
		case "prowlarr":
			return <ProwlarrWidget config={widget.config} />;
		case "proxmox":
			return <ProxmoxWidget config={widget.config} />;
		case "qbittorrent":
			return <QBittorrentWidget config={widget.config} />;
		case "vince":
			return <VinceWidget config={widget.config} />;
		case "traefik":
			return <TraefikWidget config={widget.config} />;
		case "pocket-id":
			return <PocketIdWidget config={widget.config} />;
		case "godoxy":
			return <GodoxyWidget config={widget.config} />;
		case "home-assistant":
			return <HomeAssistantWidget config={widget.config} />;
		default:
			return null;
	}
};

export type WidgetProps = {
	config: WIDGETS;
};
