ALTER TYPE "public"."plan_tipo" ADD VALUE 'prueba';--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "usuario" text;--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "acceso_expira" timestamp with time zone;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "usuarios_usuario_idx" ON "usuarios" USING btree ("usuario");