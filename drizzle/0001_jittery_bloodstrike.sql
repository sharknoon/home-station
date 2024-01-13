DROP INDEX IF EXISTS `users_email_unique`;--> statement-breakpoint
ALTER TABLE users ADD `language` text DEFAULT 'en' NOT NULL;--> statement-breakpoint
ALTER TABLE users ADD `theme` text DEFAULT 'system' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `email`;