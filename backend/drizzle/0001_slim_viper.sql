CREATE TABLE "calendar_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"start_datetime" timestamp NOT NULL,
	"end_datetime" timestamp NOT NULL,
	"event_type" varchar(20) NOT NULL,
	"color" varchar(7),
	"notify_me" boolean DEFAULT false,
	"created_by" integer
);
--> statement-breakpoint
CREATE TABLE "class_resource_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"class_id" integer,
	"resource_id" integer
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"teacher_name" text,
	"exam_date" timestamp,
	"curriculum" text,
	"created_by" integer
);
--> statement-breakpoint
CREATE TABLE "exam_periods" (
	"id" serial PRIMARY KEY NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"class_id" integer,
	"user_id" integer
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"uploaded_at" timestamp DEFAULT now(),
	"created_by" integer
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"file_path" text NOT NULL,
	"file_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"uploaded_at" timestamp DEFAULT now(),
	"uploaded_by" integer
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "date_of_birth" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_resource_links" ADD CONSTRAINT "class_resource_links_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_resource_links" ADD CONSTRAINT "class_resource_links_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_periods" ADD CONSTRAINT "exam_periods_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_periods" ADD CONSTRAINT "exam_periods_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;