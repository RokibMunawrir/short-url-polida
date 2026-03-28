CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`username` varchar(255),
	`role` enum('Admin','Editor','User') NOT NULL DEFAULT 'User',
	`status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
	`password` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	`deleted_at` timestamp,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`),
	CONSTRAINT `user_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
RENAME TABLE `users` TO `account`;--> statement-breakpoint
ALTER TABLE `account` DROP INDEX `users_username_unique`;--> statement-breakpoint
ALTER TABLE `account` DROP INDEX `users_email_unique`;--> statement-breakpoint
ALTER TABLE `account` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `settings` MODIFY COLUMN `user_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `urls` MODIFY COLUMN `user_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `account` MODIFY COLUMN `id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `account` MODIFY COLUMN `password` text;--> statement-breakpoint
ALTER TABLE `account` MODIFY COLUMN `created_at` timestamp(3) NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `account` MODIFY COLUMN `updated_at` timestamp(3) NOT NULL;--> statement-breakpoint
ALTER TABLE `account` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `account` ADD `account_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `account` ADD `provider_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `account` ADD `user_id` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `account` ADD `access_token` text;--> statement-breakpoint
ALTER TABLE `account` ADD `refresh_token` text;--> statement-breakpoint
ALTER TABLE `account` ADD `id_token` text;--> statement-breakpoint
ALTER TABLE `account` ADD `access_token_expires_at` timestamp(3);--> statement-breakpoint
ALTER TABLE `account` ADD `refresh_token_expires_at` timestamp(3);--> statement-breakpoint
ALTER TABLE `account` ADD `scope` text;--> statement-breakpoint
ALTER TABLE `urls` ADD CONSTRAINT `urls_short_code_unique` UNIQUE(`short_code`);--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `username`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `email`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `role`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `status`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `avatar`;--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `deleted_at`;