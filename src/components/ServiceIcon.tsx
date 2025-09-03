import Image from "next/image";
import type { Service } from "~/server/db/schema";
import { OPTIMIZED_IMAGES_DOMAINS } from "~/utils/constants";

type Props = {
	service: Pick<Service, "icon" | "name">;
	className?: string;
};

export const ServiceIcon = ({ service, className }: Props) => {
	if (
		!OPTIMIZED_IMAGES_DOMAINS.some((pattern) =>
			service.icon.startsWith(pattern.replace(/\/\*\*?$/, "")),
		)
	) {
		return (
			// biome-ignore lint/performance/noImgElement: not optimize for security
			<img
				src={service.icon}
				alt={`${service.name} icon`}
				width={32}
				height={32}
				className={className}
			/>
		);
	}
	return (
		<Image
			src={service.icon}
			alt={`${service.name} icon optimized`}
			width={32}
			height={32}
			className={className}
		/>
	);
};
