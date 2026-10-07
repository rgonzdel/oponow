CREATE TYPE "public"."rol_usuario" AS ENUM('opositor', 'admin', 'editor', 'soporte', 'lectura');--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "rol" "rol_usuario" DEFAULT 'opositor' NOT NULL;--> statement-breakpoint
-- Quien ya era administrador pasa al rol "admin".
UPDATE "usuarios" SET "rol" = 'admin' WHERE "es_admin" = true;
