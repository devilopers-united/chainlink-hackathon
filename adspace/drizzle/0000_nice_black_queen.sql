CREATE TABLE "user" (
	"user_id" text PRIMARY KEY NOT NULL,
	"github_id" text,
	"google_id" text,
	"metamask_wallet" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
