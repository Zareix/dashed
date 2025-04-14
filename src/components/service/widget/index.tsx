import type { z } from "zod";
import CupWidget from "~/components/service/widget/widgets/cup";
import RadarrWidget from "~/components/service/widget/widgets/radarr";
import SonarrWidget from "~/components/service/widget/widgets/sonarr";
import UptimeKumaWidget from "~/components/service/widget/widgets/uptime-kuma";
import type { WIDGETS } from "~/lib/widgets";

type Props = {
	widget: WIDGETS;
};

const Widget = ({ widget }: Props) => {
	switch (widget.type) {
		case "cup":
			return <CupWidget config={widget.config} />;
		case "sonarr":
			return <SonarrWidget config={widget.config} />;
		case "radarr":
			return <RadarrWidget config={widget.config} />;
		case "uptime-kuma":
			return <UptimeKumaWidget config={widget.config} />;
		default:
			return <></>;
	}
};

export default Widget;

export type WidgetProps = {
	config: WIDGETS;
};
