CREATE TABLE `store_members` (
	`store_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'viewer' NOT NULL,
	`status` text NOT NULL,
	`joined_at` integer DEFAULT (strftime('%s','now')) NOT NULL,
	PRIMARY KEY(`store_id`, `user_id`),
	FOREIGN KEY (`store_id`) REFERENCES `stores`(`store_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tables` (
	`store_id` text NOT NULL,
	`table_id` text NOT NULL,
	`table_code` text NOT NULL,
	`capacity` integer DEFAULT 2 NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s','now')) NOT NULL,
	`is_active` integer DEFAULT false NOT NULL,
	`is_enabled` integer DEFAULT true NOT NULL,
	PRIMARY KEY(`store_id`, `table_id`),
	FOREIGN KEY (`store_id`) REFERENCES `stores`(`store_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `stores` (
	`store_id` text PRIMARY KEY NOT NULL,
	`store_name` text NOT NULL,
	`created_by` text NOT NULL,
	`state` text DEFAULT 'operation' NOT NULL,
	`description` text,
	`address` text,
	`address_detail` text,
	`phone` text,
	`business_hours` text,
	`payout_bank_name` text,
	`payout_account_number` text,
	`payout_account_holder` text,
	`created_at` integer DEFAULT (strftime('%s','now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s','now')) NOT NULL,
	`is_active` integer DEFAULT false NOT NULL,
	`is_locked` integer DEFAULT false NOT NULL,
	`lock_reason` text
);
