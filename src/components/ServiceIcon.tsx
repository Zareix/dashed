import Image from "next/image";
import { cn } from "~/lib/utils";
import type { Service } from "~/server/db/schema";
import { OPTIMIZED_IMAGES_DOMAINS } from "~/utils/constants";

type Props = {
	service: Pick<Service, "name" | "icon"> & {
		iconDark?: string | null;
	};
	className?: string;
};

export const ServiceIcon = ({ service, className }: Props) => {
	return (
		<>
			{!OPTIMIZED_IMAGES_DOMAINS.some((pattern) =>
				service.icon.startsWith(pattern.replace(/\/\*\*?$/, "")),
			) ? (
				// biome-ignore lint/performance/noImgElement: not optimize for security
				<img
					src={service.icon}
					alt={`${service.name} icon optimized`}
					width={32}
					height={32}
					className={cn(service.iconDark && "dark:hidden", className)}
				/>
			) : (
				<Image
					src={service.icon}
					alt={`${service.name} icon optimized`}
					width={32}
					height={32}
					className={cn(service.iconDark && "dark:hidden", className)}
				/>
			)}
			{service.iconDark &&
				(!OPTIMIZED_IMAGES_DOMAINS.some((pattern) =>
					service.iconDark?.startsWith(pattern.replace(/\/\*\*?$/, "")),
				) ? (
					// biome-ignore lint/performance/noImgElement: not optimize for security
					<img
						src={service.iconDark}
						alt={`${service.name} icon dark optimized`}
						width={32}
						height={32}
						className={cn("hidden dark:block", className)}
					/>
				) : (
					<Image
						src={service.iconDark}
						alt={`${service.name} icon dark optimized`}
						width={32}
						height={32}
						className={cn("hidden dark:block", className)}
					/>
				))}
		</>
	);
};
