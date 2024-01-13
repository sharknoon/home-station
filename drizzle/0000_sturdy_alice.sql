CREATE TABLE `app_repositories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`username` text,
	`password` text
);
--> statement-breakpoint
CREATE TABLE `available_apps` (
	`app_id` text NOT NULL,
	`app_repository_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`icon` text NOT NULL,
	`banner` text,
	`links` text NOT NULL,
	`published_at` text NOT NULL,
	`developer` text NOT NULL,
	`category` text NOT NULL,
	PRIMARY KEY(`app_id`, `app_repository_id`),
	FOREIGN KEY (`app_repository_id`) REFERENCES `app_repositories`(`id`) ON UPDATE no action ON DELETE no action
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
CREATE TABLE `user_keys` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`hashed_password` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`active_expires` blob NOT NULL,
	`idle_expires` blob NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `systems` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`setup_complete` integer DEFAULT false NOT NULL,
	`current_setup_step` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`language` text DEFAULT 'en' NOT NULL,
	`theme` text DEFAULT 'system' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `app_repositories_url_unique` ON `app_repositories` (`url`);--> statement-breakpoint
CREATE UNIQUE INDEX `container_engines_name_unique` ON `container_engines` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);