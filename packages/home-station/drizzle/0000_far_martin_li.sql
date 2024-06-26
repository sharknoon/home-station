CREATE TABLE `domains` (
	`domain` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `marketplace_apps` (
	`id` text PRIMARY KEY NOT NULL,
	`marketplace_url` text NOT NULL,
	`latest_version` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`icon` text NOT NULL,
	`banner` text,
	`screenshots` text NOT NULL,
	`links` text NOT NULL,
	`published_at` text NOT NULL,
	`developer` text NOT NULL,
	`category` text NOT NULL,
	`license` text,
	`config` text,
	`messages` text,
	FOREIGN KEY (`marketplace_url`) REFERENCES `marketplaces`(`git_remote_url`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `marketplaces` (
	`git_remote_url` text PRIMARY KEY NOT NULL,
	`git_username` text,
	`git_password` text
);
--> statement-breakpoint
CREATE TABLE `user_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`hashed_password` text NOT NULL,
	`language` text DEFAULT 'en' NOT NULL,
	`theme` text DEFAULT 'skeleton' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);