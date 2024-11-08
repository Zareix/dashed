CREATE TABLE `category` (
	`name` text(256) PRIMARY KEY NOT NULL,
	`max_cols` integer DEFAULT 5 NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `category_name_idx` ON `category` (`name`);--> statement-breakpoint
CREATE TABLE `service` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256) NOT NULL,
	`url` text(256) NOT NULL,
	`icon` text(256) NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`category_name` text(256) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `service_name_idx` ON `service` (`name`);