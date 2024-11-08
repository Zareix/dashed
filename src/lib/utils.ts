import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AUTHORIZED_DOMAINS } from "~/utils/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isAuthorizedDomain = (url: string) => {
  return AUTHORIZED_DOMAINS.includes(new URL(url).hostname);
};
