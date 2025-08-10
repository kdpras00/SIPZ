CREATE TABLE `infaq_shadaqoh` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`type` text NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`recipient` text NOT NULL,
	`date` timestamp NOT NULL,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `infaq_shadaqoh_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notification_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`yearly_reminder_enabled` boolean NOT NULL DEFAULT true,
	`yearly_reminder_days` int NOT NULL DEFAULT 30,
	`yearly_reminder_month` text NOT NULL DEFAULT ('ramadhan'),
	`monthly_reminder_enabled` boolean NOT NULL DEFAULT false,
	`monthly_reminder_date` int NOT NULL DEFAULT 1,
	`monthly_reminder_amount` decimal(15,2),
	`email_notification_enabled` boolean NOT NULL DEFAULT true,
	`email` text,
	CONSTRAINT `notification_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `notification_settings_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`is_read` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`sid` varchar(255) NOT NULL,
	`sess` json NOT NULL,
	`expire` timestamp NOT NULL,
	CONSTRAINT `sessions_sid` PRIMARY KEY(`sid`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`email` varchar(255),
	`first_name` varchar(255),
	`last_name` varchar(255),
	`profile_image_url` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `zakat_calculations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`type` text NOT NULL,
	`monthly_income` decimal(15,2),
	`yearly_income` decimal(15,2),
	`debt` decimal(15,2),
	`gold_weight` decimal(10,3),
	`gold_price` decimal(15,2),
	`silver_weight` decimal(10,3),
	`silver_price` decimal(15,2),
	`business_assets` decimal(15,2),
	`farm_output` decimal(15,2),
	`irrigation_type` text,
	`zakat_amount` decimal(15,2) NOT NULL,
	`is_wajib` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `zakat_calculations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `zakat_payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`calculation_id` int,
	`type` text NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`due_date` timestamp,
	`paid_date` timestamp,
	`recipient` text,
	`status` text NOT NULL DEFAULT ('scheduled'),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `zakat_payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `IDX_session_expire` ON `sessions` (`expire`);