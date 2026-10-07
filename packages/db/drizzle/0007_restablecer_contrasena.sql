CREATE TABLE IF NOT EXISTS "restablecimientos_contrasena" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expira_en" timestamp with time zone NOT NULL,
	"usado_en" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "restablecimientos_contrasena" ADD CONSTRAINT "restablecimientos_contrasena_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "restablecimientos_contrasena_token_hash_idx" ON "restablecimientos_contrasena" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "restablecimientos_contrasena_usuario_id_idx" ON "restablecimientos_contrasena" USING btree ("usuario_id");