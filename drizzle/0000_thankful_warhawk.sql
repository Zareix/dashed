CREATE TABLE `service` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256) NOT NULL,
	`url` text(256) NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`category` text(256) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `name_idx` ON `service` (`name`);