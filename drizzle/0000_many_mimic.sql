CREATE TABLE `category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256) NOT NULL,
	`max_cols` integer DEFAULT 5 NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `service` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256) NOT NULL,
	`url` text(256) NOT NULL,
	`alternative_urls` text DEFAULT [] NOT NULL,
	`icon` text(256) NOT NULL,
	`icon_dark` text(256),
	`order` integer DEFAULT 0 NOT NULL,
	`widget` text DEFAULT '{"type":"none","config":{}}' NOT NULL,
	`open_in_new_tab` integer DEFAULT 0 NOT NULL,
	`category_id` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `service_name_idx` ON `service` (`name`);