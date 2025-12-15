import { defineAction } from "astro:actions";
import { category } from "~/actions/category";
import { command } from "~/actions/command";
import { importExport } from "~/actions/import-export";
import { service } from "~/actions/service";
import { widget } from "~/actions/widget";

export const server = {
	command,
	importExport,
	category,
	service,
	widget,
	health: defineAction({
		handler: () => {
			return {
				status: "ok",
			};
		},
	}),
};
