CREATE TYPE "public"."suscripcion_estado" AS ENUM('trialing', 'active', 'past_due', 'canceled');--> statement-breakpoint
ALTER TABLE "suscripciones_oposicion" ADD COLUMN "estado" "suscripcion_estado" DEFAULT 'trialing' NOT NULL;--> statement-breakpoint
ALTER TABLE "suscripciones_oposicion" ADD COLUMN "trial_ends_at" timestamp with time zone;