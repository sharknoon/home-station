CREATE TABLE `apps` (
	`app_id` text NOT NULL,
	`marketplace_id` text NOT NULL,
	`container_engine_id` integer NOT NULL,
	`installed_at` integer NOT NULL,
	PRIMARY KEY(`app_id`, `marketplace_id`),
	FOREIGN KEY (`container_engine_id`) REFERENCES `container_engines`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`app_id`,`marketplace_id`) REFERENCES `marketplace_apps`(`app_id`,`marketplace_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `container_engines` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`socket_path` text,
	`host` text,
	`ca` text,
	`cert` text,
	`key` text
);
--> statement-breakpoint
CREATE TABLE `hostnames` (
	`host` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `marketplace_apps` (
	`app_id` text NOT NULL,
	`marketplace_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`icon` text NOT NULL,
	`banner` text,
	`links` text NOT NULL,
	`published_at` text NOT NULL,
	`developer` text NOT NULL,
	`category` text NOT NULL,
	`config` text,
	`http` text NOT NULL,
	`messages` text,
	PRIMARY KEY(`app_id`, `marketplace_id`),
	FOREIGN KEY (`marketplace_id`) REFERENCES `marketplaces`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `marketplaces` (
	`id` text PRIMARY KEY NOT NULL,
	`git_remote_url` text NOT NULL,
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
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`hashed_password` text NOT NULL,
	`language` text DEFAULT 'en' NOT NULL,
	`theme` text DEFAULT 'skeleton' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `container_engines_name_unique` ON `container_engines` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `marketplaces_git_remote_url_unique` ON `marketplaces` (`git_remote_url`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);