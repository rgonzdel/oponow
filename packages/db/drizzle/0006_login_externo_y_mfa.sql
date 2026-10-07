CREATE TYPE "public"."proveedor_identidad" AS ENUM('google', 'facebook');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "desafios_mfa" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"codigo_hash" text NOT NULL,
	"intentos" integer DEFAULT 0 NOT NULL,
	"reenvios" integer DEFAULT 0 NOT NULL,
	"expira_en" timestamp with time zone NOT NULL,
	"enviado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"usado_en" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dispositivos_confianza" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"user_agent" text,
	"expira_en" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "identidades_externas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"proveedor" "proveedor_identidad" NOT NULL,
	"sujeto" text NOT NULL,
	"email" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "usuarios" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "usuarios" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "desafios_mfa" ADD CONSTRAINT "desafios_mfa_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dispositivos_confianza" ADD CONSTRAINT "dispositivos_confianza_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "identidades_externas" ADD CONSTRAINT "identidades_externas_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "desafios_mfa_usuario_id_idx" ON "desafios_mfa" USING btree ("usuario_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "dispositivos_confianza_token_hash_idx" ON "dispositivos_confianza" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dispositivos_confianza_usuario_id_idx" ON "dispositivos_confianza" USING btree ("usuario_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "identidades_externas_proveedor_sujeto_idx" ON "identidades_externas" USING btree ("proveedor","sujeto");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "identidades_externas_usuario_id_idx" ON "identidades_externas" USING btree ("usuario_id");