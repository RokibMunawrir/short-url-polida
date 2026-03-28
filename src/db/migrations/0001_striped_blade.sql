ALTER TABLE `urls` DROP INDEX `short_code_idx`;--> statement-breakpoint
ALTER TABLE `clicks` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `clicks` MODIFY COLUMN `url_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` MODIFY COLUMN `user_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `urls` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `urls` MODIFY COLUMN `user_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `settings` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `urls` ADD `deleted_at` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `deleted_at` timestamp;