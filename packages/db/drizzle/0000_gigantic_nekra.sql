CREATE TYPE "public"."intento_estado" AS ENUM('en_progreso', 'completado');--> statement-breakpoint
CREATE TYPE "public"."plan_tipo" AS ENUM('free', 'lite', 'vip');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "articulos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ley_id" uuid NOT NULL,
	"numero" text NOT NULL,
	"texto_original" text NOT NULL,
	"texto_resumido_ia" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bloques_contenido" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tema_id" uuid NOT NULL,
	"orden" integer NOT NULL,
	"contenido" text NOT NULL,
	"articulo_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "leyes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"boe_referencia" text NOT NULL,
	"boe_url" text,
	"fecha_ultima_actualizacion" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oposiciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"slug" text NOT NULL,
	"categoria" text NOT NULL,
	"fase_escalado" text,
	"activa" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "temas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"oposicion_id" uuid NOT NULL,
	"orden" integer NOT NULL,
	"titulo" text NOT NULL,
	"es_gratuito" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"user_agent" text,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sesiones_lectura" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"bloque_id" uuid NOT NULL,
	"ip" text NOT NULL,
	"email_snapshot" text NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "suscripciones_oposicion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"oposicion_id" uuid NOT NULL,
	"activa" boolean DEFAULT true NOT NULL,
	"fecha_inicio" timestamp with time zone DEFAULT now() NOT NULL,
	"fecha_fin" timestamp with time zone,
	"stripe_subscription_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"plan" "plan_tipo" DEFAULT 'free' NOT NULL,
	"plan_expira" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "intentos_test" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"tema_id" uuid NOT NULL,
	"fecha" timestamp with time zone DEFAULT now() NOT NULL,
	"es_diario" boolean DEFAULT false NOT NULL,
	"estado" "intento_estado" DEFAULT 'en_progreso' NOT NULL,
	"puntuacion" numeric(5, 2)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "preguntas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tema_id" uuid NOT NULL,
	"articulo_id" uuid,
	"enunciado" text NOT NULL,
	"opciones" jsonb NOT NULL,
	"respuesta_correcta" smallint NOT NULL,
	"justificacion_ia" text,
	"dificultad" smallint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "respuestas_usuario" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"intento_id" uuid NOT NULL,
	"pregunta_id" uuid NOT NULL,
	"opcion_elegida" smallint NOT NULL,
	"es_correcta" boolean NOT NULL,
	"fecha" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "articulos" ADD CONSTRAINT "articulos_ley_id_leyes_id_fk" FOREIGN KEY ("ley_id") REFERENCES "public"."leyes"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bloques_contenido" ADD CONSTRAINT "bloques_contenido_tema_id_temas_id_fk" FOREIGN KEY ("tema_id") REFERENCES "public"."temas"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bloques_contenido" ADD CONSTRAINT "bloques_contenido_articulo_id_articulos_id_fk" FOREIGN KEY ("articulo_id") REFERENCES "public"."articulos"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "temas" ADD CONSTRAINT "temas_oposicion_id_oposiciones_id_fk" FOREIGN KEY ("oposicion_id") REFERENCES "public"."oposiciones"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sesiones_lectura" ADD CONSTRAINT "sesiones_lectura_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sesiones_lectura" ADD CONSTRAINT "sesiones_lectura_bloque_id_bloques_contenido_id_fk" FOREIGN KEY ("bloque_id") REFERENCES "public"."bloques_contenido"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "suscripciones_oposicion" ADD CONSTRAINT "suscripciones_oposicion_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "suscripciones_oposicion" ADD CONSTRAINT "suscripciones_oposicion_oposicion_id_oposiciones_id_fk" FOREIGN KEY ("oposicion_id") REFERENCES "public"."oposiciones"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "intentos_test" ADD CONSTRAINT "intentos_test_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "intentos_test" ADD CONSTRAINT "intentos_test_tema_id_temas_id_fk" FOREIGN KEY ("tema_id") REFERENCES "public"."temas"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "preguntas" ADD CONSTRAINT "preguntas_tema_id_temas_id_fk" FOREIGN KEY ("tema_id") REFERENCES "public"."temas"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "preguntas" ADD CONSTRAINT "preguntas_articulo_id_articulos_id_fk" FOREIGN KEY ("articulo_id") REFERENCES "public"."articulos"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "respuestas_usuario" ADD CONSTRAINT "respuestas_usuario_intento_id_intentos_test_id_fk" FOREIGN KEY ("intento_id") REFERENCES "public"."intentos_test"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "respuestas_usuario" ADD CONSTRAINT "respuestas_usuario_pregunta_id_preguntas_id_fk" FOREIGN KEY ("pregunta_id") REFERENCES "public"."preguntas"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articulos_ley_id_idx" ON "articulos" USING btree ("ley_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "bloques_tema_orden_idx" ON "bloques_contenido" USING btree ("tema_id","orden");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oposiciones_slug_idx" ON "oposiciones" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "temas_oposicion_orden_idx" ON "temas" USING btree ("oposicion_id","orden");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "refresh_tokens_token_hash_idx" ON "refresh_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "refresh_tokens_usuario_id_idx" ON "refresh_tokens" USING btree ("usuario_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sesiones_lectura_usuario_bloque_idx" ON "sesiones_lectura" USING btree ("usuario_id","bloque_id","timestamp");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "suscripciones_usuario_oposicion_idx" ON "suscripciones_oposicion" USING btree ("usuario_id","oposicion_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "usuarios_email_idx" ON "usuarios" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "intentos_test_usuario_tema_fecha_idx" ON "intentos_test" USING btree ("usuario_id","tema_id","fecha");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "preguntas_tema_id_idx" ON "preguntas" USING btree ("tema_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "preguntas_articulo_id_idx" ON "preguntas" USING btree ("articulo_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "respuestas_usuario_intento_id_idx" ON "respuestas_usuario" USING btree ("intento_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "respuestas_usuario_pregunta_id_idx" ON "respuestas_usuario" USING btree ("pregunta_id");