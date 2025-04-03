import type { z } from "zod";
import CupWidget from "~/components/service/widget/widgets/cup";
import type { WIDGETS } from "~/utils/constants";

type Props = {
	widget: z.infer<typeof WIDGETS>;
};

const Widget = ({ widget }: Props) => {
	switch (widget.type) {
		case "cup":
			return <CupWidget config={widget.config} />;
		default:
			return <></>;
	}
};

export default Widget;

export type WidgetProps = {
	config: z.infer<typeof WIDGETS>;
};
