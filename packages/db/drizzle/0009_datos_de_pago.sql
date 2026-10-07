CREATE TYPE "public"."ciclo_facturacion" AS ENUM('mensual', 'anual');--> statement-breakpoint
CREATE TYPE "public"."metodo_pago" AS ENUM('tarjeta', 'bizum');--> statement-breakpoint
ALTER TABLE "suscripciones_oposicion" ADD COLUMN "ciclo" "ciclo_facturacion" DEFAULT 'mensual' NOT NULL;--> statement-breakpoint
ALTER TABLE "suscripciones_oposicion" ADD COLUMN "importe_centimos" integer;--> statement-breakpoint
ALTER TABLE "suscripciones_oposicion" ADD COLUMN "proximo_cobro" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "suscripciones_oposicion" ADD COLUMN "metodo_pago" "metodo_pago";--> statement-breakpoint
ALTER TABLE "suscripciones_oposicion" ADD COLUMN "tarjeta_marca" text;--> statement-breakpoint
ALTER TABLE "suscripciones_oposicion" ADD COLUMN "tarjeta_ultimos4" text;--> statement-breakpoint
ALTER TABLE "suscripciones_oposicion" ADD COLUMN "tarjeta_caducidad" text;--> statement-breakpoint
ALTER TABLE "suscripciones_oposicion" ADD COLUMN "bizum_telefono_ultimos" text;