CREATE TYPE "public"."examen_motivo_entrega" AS ENUM('usuario', 'tiempo', 'salidas');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "examenes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"oposicion_id" uuid NOT NULL,
	"pregunta_ids" jsonb NOT NULL,
	"duracion_segundos" integer NOT NULL,
	"inicio" timestamp with time zone DEFAULT now() NOT NULL,
	"entregado_en" timestamp with time zone,
	"estado" "intento_estado" DEFAULT 'en_progreso' NOT NULL,
	"motivo_entrega" "examen_motivo_entrega",
	"modo_avanzado" boolean DEFAULT false NOT NULL,
	"max_salidas" smallint DEFAULT 3 NOT NULL,
	"salidas" smallint DEFAULT 0 NOT NULL,
	"segundos_fuera" integer DEFAULT 0 NOT NULL,
	"correctas" smallint,
	"incorrectas" smallint,
	"en_blanco" smallint,
	"puntuacion" numeric(5, 2)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "respuestas_examen" (
	"examen_id" uuid NOT NULL,
	"pregunta_id" uuid NOT NULL,
	"opcion_elegida" smallint,
	"marcada" boolean DEFAULT false NOT NULL,
	"actualizado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "respuestas_examen_examen_id_pregunta_id_pk" PRIMARY KEY("examen_id","pregunta_id")
);
--> statement-breakpoint
ALTER TABLE "intentos_test" ADD COLUMN "examen_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "examenes" ADD CONSTRAINT "examenes_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "examenes" ADD CONSTRAINT "examenes_oposicion_id_oposiciones_id_fk" FOREIGN KEY ("oposicion_id") REFERENCES "public"."oposiciones"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "respuestas_examen" ADD CONSTRAINT "respuestas_examen_examen_id_examenes_id_fk" FOREIGN KEY ("examen_id") REFERENCES "public"."examenes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "respuestas_examen" ADD CONSTRAINT "respuestas_examen_pregunta_id_preguntas_id_fk" FOREIGN KEY ("pregunta_id") REFERENCES "public"."preguntas"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "examenes_usuario_inicio_idx" ON "examenes" USING btree ("usuario_id","inicio");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "intentos_test" ADD CONSTRAINT "intentos_test_examen_id_examenes_id_fk" FOREIGN KEY ("examen_id") REFERENCES "public"."examenes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
