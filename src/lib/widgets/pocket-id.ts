import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type PocketIdUser = {
	id: string;
	username: string;
	email: string;
	emailVerified: boolean;
	firstName: string;
	lastName: string;
	displayName: string;
	isAdmin: boolean;
	locale: string | null;
	customClaims: unknown[];
	userGroups: Array<{
		id: string;
		friendlyName: string;
		name: string;
		customClaims: unknown[];
		userCount: number;
		ldapId: string | null;
		createdAt: string;
	}>;
	ldapId: string | null;
	disabled: boolean;
};

type PocketIdOidcClient = {
	id: string;
	name: string;
	hasLogo: boolean;
	hasDarkLogo: boolean;
	launchURL: string;
	requiresReauthentication: boolean;
	callbackURLs: string[];
	logoutCallbackURLs: string[];
	isPublic: boolean;
	pkceEnabled: boolean;
	credentials: Record<string, unknown>;
	isGroupRestricted: boolean;
	allowedUserGroupsCount: number;
};

type PocketIdAuditLog = {
	id: string;
	createdAt: string;
	event: string;
	ipAddress: string;
	country: string;
	city: string;
	device: string;
	userID: string;
	username: string;
	data: Record<string, unknown>;
};

type PocketIdResponse<T> = {
	data: T[];
	pagination: {
		totalPages: number;
		totalItems: number;
		currentPage: number;
		itemsPerPage: number;
	};
};

export const getWidgetData = async (config: WidgetConfig<"pocket-id">) => {
	const [usersRes, oidcClientsRes, auditLogsRes] = await Promise.all([
		tryCatch(
			fetch(`${config.url}/api/users?pagination[limit]=1`, {
				headers: {
					"X-API-Key": config.apiKey,
				},
			}).then((res) => {
				if (!res.ok) {
					throw new Error(`Failed to fetch Pocket-ID users: ${res.statusText}`);
				}
				return res.json() as Promise<PocketIdResponse<PocketIdUser>>;
			}),
		),
		tryCatch(
			fetch(`${config.url}/api/oidc/clients?pagination[limit]=1`, {
				headers: {
					"X-API-Key": config.apiKey,
				},
			}).then((res) => {
				if (!res.ok) {
					throw new Error(
						`Failed to fetch Pocket-ID OIDC clients: ${res.statusText}`,
					);
				}
				return res.json() as Promise<PocketIdResponse<PocketIdOidcClient>>;
			}),
		),
		tryCatch(
			fetch(
				`${config.url}/api/audit-logs?sort[column]=createdAt&sort[direction]=desc`,
				{
					headers: {
						"X-API-Key": config.apiKey,
					},
				},
			).then((res) => {
				if (!res.ok) {
					throw new Error(
						`Failed to fetch Pocket-ID audit logs: ${res.statusText}`,
					);
				}
				return res.json() as Promise<PocketIdResponse<PocketIdAuditLog>>;
			}),
		),
	]);
	if (usersRes.error) {
		throw usersRes.error;
	}
	if (oidcClientsRes.error) {
		throw oidcClientsRes.error;
	}
	if (auditLogsRes.error) {
		throw auditLogsRes.error;
	}

	const lastSignIn = auditLogsRes.data.data.find(
		(x) => x.event === "SIGN_IN",
	)?.createdAt;

	return {
		oidcClients: oidcClientsRes.data.pagination.totalItems,
		users: usersRes.data.pagination.totalItems,
		lastSignIn,
	};
};
