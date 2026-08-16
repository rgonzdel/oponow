CREATE TABLE IF NOT EXISTS "tareas_agenda" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"titulo" text NOT NULL,
	"descripcion" text,
	"fecha" timestamp with time zone NOT NULL,
	"completada" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "agenda_feed_token" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tareas_agenda" ADD CONSTRAINT "tareas_agenda_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tareas_agenda_usuario_fecha_idx" ON "tareas_agenda" USING btree ("usuario_id","fecha");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "usuarios_agenda_feed_token_idx" ON "usuarios" USING btree ("agenda_feed_token");