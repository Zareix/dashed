import { defineAction } from "astro:actions";
import {
	beszelSchema,
	controldSchema,
	cupSchema,
	gatusSchema,
	karakeepSchema,
	kavitaSchema,
	komodoSchema,
	nextdnsSchema,
	prowlarrSchema,
	qbittorrentSchema,
	radarrSchema,
	sonarrSchema,
	subtrackerSchema,
	uptimeKumaSchema,
	vinceSchema,
} from "~/lib/widgets";

import * as beszel from "../lib/widgets/beszel";
import * as controld from "../lib/widgets/controld";
import * as cup from "../lib/widgets/cup";
import * as gatus from "../lib/widgets/gatus";
import * as karakeep from "../lib/widgets/karakeep";
import * as kavita from "../lib/widgets/kavita";
import * as komodo from "../lib/widgets/komodo";
import * as nextdns from "../lib/widgets/nextdns";
import * as prowlarr from "../lib/widgets/prowlarr";
import * as qbittorrent from "../lib/widgets/qbittorrent";
import * as radarr from "../lib/widgets/radarr";
import * as sonarr from "../lib/widgets/sonarr";
import * as subtracker from "../lib/widgets/subtracker";
import * as uptimeKuma from "../lib/widgets/uptime-kuma";
import * as vince from "../lib/widgets/vince";

export const widget = {
	beszel: defineAction({
		input: beszelSchema.shape.config,
		handler: beszel.getWidgetData,
	}),
	controld: defineAction({
		input: controldSchema.shape.config,
		handler: controld.getWidgetData,
	}),
	cup: defineAction({
		input: cupSchema.shape.config,
		handler: cup.getWidgetData,
	}),
	gatus: defineAction({
		input: gatusSchema.shape.config,
		handler: gatus.getWidgetData,
	}),
	karakeep: defineAction({
		input: karakeepSchema.shape.config,
		handler: karakeep.getWidgetData,
	}),
	kavita: defineAction({
		input: kavitaSchema.shape.config,
		handler: kavita.getWidgetData,
	}),
	komodo: defineAction({
		input: komodoSchema.shape.config,
		handler: komodo.getWidgetData,
	}),
	nextdns: defineAction({
		input: nextdnsSchema.shape.config,
		handler: nextdns.getWidgetData,
	}),
	prowlarr: defineAction({
		input: prowlarrSchema.shape.config,
		handler: prowlarr.getWidgetData,
	}),
	qbittorrent: defineAction({
		input: qbittorrentSchema.shape.config,
		handler: qbittorrent.getWidgetData,
	}),
	radarr: defineAction({
		input: radarrSchema.shape.config,
		handler: radarr.getWidgetData,
	}),
	sonarr: defineAction({
		input: sonarrSchema.shape.config,
		handler: sonarr.getWidgetData,
	}),
	subtracker: defineAction({
		input: subtrackerSchema.shape.config,
		handler: subtracker.getWidgetData,
	}),
	"uptime-kuma": defineAction({
		input: uptimeKumaSchema.shape.config,
		handler: uptimeKuma.getWidgetData,
	}),
	vince: defineAction({
		input: vinceSchema.shape.config,
		handler: vince.getWidgetData,
	}),
};
