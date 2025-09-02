"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Service } from "~/server/db/schema";

type Props = {
	service: Pick<Service, "icon" | "name">;
	className?: string;
};

export const ServiceIcon = ({ service, className }: Props) => {
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		if (service.icon) {
			setIsError(false);
		}
	}, [service.icon]);

	if (isError) return <p className="w-8 h-8 bg-gray-300" />;

	return (
		<Image
			src={service.icon}
			alt={`${service.name} icon`}
			width={32}
			height={32}
			className={className}
			onError={() => setIsError(true)}
		/>
	);
};
