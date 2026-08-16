CREATE TABLE IF NOT EXISTS "google_calendar_conexiones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"refresh_token_cifrado" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX IF EXISTS "usuarios_agenda_feed_token_idx";--> statement-breakpoint
ALTER TABLE "tareas_agenda" ADD COLUMN "google_event_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "google_calendar_conexiones" ADD CONSTRAINT "google_calendar_conexiones_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "google_calendar_conexiones_usuario_idx" ON "google_calendar_conexiones" USING btree ("usuario_id");--> statement-breakpoint
ALTER TABLE "usuarios" DROP COLUMN IF EXISTS "agenda_feed_token";