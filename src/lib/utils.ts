import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { OPTIMIZED_IMAGES_DOMAINS } from "~/utils/constants";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const isAuthorizedDomain = (url: string) => {
	try {
		return OPTIMIZED_IMAGES_DOMAINS.includes(new URL(url).hostname);
	} catch {
		return false;
	}
};
