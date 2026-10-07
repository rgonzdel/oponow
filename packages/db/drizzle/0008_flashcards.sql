CREATE TABLE IF NOT EXISTS "flashcards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clave" text NOT NULL,
	"anverso" text NOT NULL,
	"reverso" text NOT NULL,
	"cita" text NOT NULL,
	"referencia" text NOT NULL,
	"boe_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "flashcards_progreso" (
	"usuario_id" uuid NOT NULL,
	"flashcard_id" uuid NOT NULL,
	"caja" smallint DEFAULT 0 NOT NULL,
	"proxima_revision" timestamp with time zone NOT NULL,
	"aciertos" integer DEFAULT 0 NOT NULL,
	"fallos" integer DEFAULT 0 NOT NULL,
	"actualizado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "flashcards_progreso_usuario_id_flashcard_id_pk" PRIMARY KEY("usuario_id","flashcard_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "flashcards_temas" (
	"flashcard_id" uuid NOT NULL,
	"tema_id" uuid NOT NULL,
	CONSTRAINT "flashcards_temas_flashcard_id_tema_id_pk" PRIMARY KEY("flashcard_id","tema_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "flashcards_progreso" ADD CONSTRAINT "flashcards_progreso_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "flashcards_progreso" ADD CONSTRAINT "flashcards_progreso_flashcard_id_flashcards_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "public"."flashcards"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "flashcards_temas" ADD CONSTRAINT "flashcards_temas_flashcard_id_flashcards_id_fk" FOREIGN KEY ("flashcard_id") REFERENCES "public"."flashcards"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "flashcards_temas" ADD CONSTRAINT "flashcards_temas_tema_id_temas_id_fk" FOREIGN KEY ("tema_id") REFERENCES "public"."temas"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "flashcards_clave_idx" ON "flashcards" USING btree ("clave");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "flashcards_progreso_usuario_revision_idx" ON "flashcards_progreso" USING btree ("usuario_id","proxima_revision");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "flashcards_temas_tema_id_idx" ON "flashcards_temas" USING btree ("tema_id");