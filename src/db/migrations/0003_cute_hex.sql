ALTER TABLE `user` DROP INDEX `user_username_unique`;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `username` text;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `role` text;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `status` text;--> statement-breakpoint
ALTER TABLE `user` ADD `display_username` text;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `password`;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `deleted_at`;