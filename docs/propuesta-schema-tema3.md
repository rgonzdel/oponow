# Propuesta de schema y contenido piloto — notas de esta rama

Contexto: rama preparada mientras Rafael dormía, en paralelo a una sesión de
Claude Design que estaba trabajando sobre el mismo repositorio (vía GitHub,
no sobre este mismo checkout) en un modelo de contenido más rico para
`TemarioPage`/`TemaReaderPage` (bloques con título, "para recordar", tiempo
estimado, dificultad) y en su propia migración de progreso de usuario. Para
no duplicar ni chocar con ese trabajo, esta rama se ha limitado a datos
(contenido + preguntas) sobre el schema **actual**, sin tocar
`packages/db/src/schema/*` ni ninguna página de `apps/web`.

## 1. Lo que se ha añadido en esta rama

- **Tema 3 de Auxiliar Administrativo del Estado (AAE)**: "Las Cortes
  Generales: composición, atribuciones y funcionamiento del Congreso de los
  Diputados y Senado. El Defensor del Pueblo" — título y numeración oficial
  según el Anexo I de BOE-A-2025-26262. Bloque 1 reutiliza el contenido ya
  existente y verificado de Cortes Generales
  (`TEMA4_BLOQUE_1_CORTES_CAMARAS` en `content/ce-titulos-2-10.ts`, arts.
  66-80 CE) en vez de duplicarlo; bloque 2 es contenido nuevo sobre el
  Defensor del Pueblo (art. 54 CE y LO 3/1981), verificado contra el texto
  vigente — incluye la reforma del art. 69 CE en vigor desde el 20 de mayo
  de 2026 (Formentera con senador propio).
- **9 preguntas de test** para ese tema, con enunciado, 4 opciones,
  respuesta correcta y justificación citando el artículo exacto — mismo
  formato que consume `QuizService`/`schema.preguntas`.
- **`upsertPreguntas` en `seed.ts`**: no existía ningún seeder de preguntas
  para ningún tema de ninguna oposición — el botón "Hacer test de este
  tema" no tenía datos con los que funcionar en ningún tema sembrado hasta
  ahora. Este PR lo desbloquea al menos para el Tema 3 de AAE, con un
  patrón (`upsertPreguntas`) reutilizable para sembrar preguntas del resto
  de temas.

## 2. Propuestas de schema para valorar (NO aplicadas en esta rama)

Estas dos propuestas nacen de mirar el schema actual con la pregunta
"¿qué le falta para sostener el modelo de negocio descrito?". Se dejan
documentadas en vez de implementadas porque pueden solaparse con lo que
Claude Design ya esté generando en su propia migración — conviene revisar
ambas cosas juntas antes de aplicar cualquiera.

### 2.1 Progreso de lectura por usuario (`progreso_lectura`)

Hoy `TemarioPage` calcula una barra de progreso como
`temas_sembrados / temas_oficiales` — mide cobertura del catálogo, no si
UN usuario concreto se ha leído esos temas. Es fácil de confundir con
progreso personal y no lo es. Propuesta mínima, no disruptiva:

```sql
CREATE TABLE progreso_lectura (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tema_id uuid NOT NULL REFERENCES temas(id) ON DELETE CASCADE,
  completado_en timestamptz NOT NULL DEFAULT now(),
  UNIQUE (usuario_id, tema_id)
);
```

Con política RLS `USING (usuario_id = current_setting('app.current_user_id', true)::uuid)`,
igual que `sesiones_lectura`/`tareas_agenda`. Consumo: un
`LEFT JOIN` en `TemarioService.listTemas` para devolver `completado:
boolean` por tema, y un endpoint `POST /temario/temas/:id/completar` que
el frontend llama al terminar de leer.

### 2.2 Estructurar `bloques_contenido` (columnas adicionales, no ruptura)

Si Design está moviendo el contenido a un modelo con título de bloque,
resumen "para recordar", tiempo estimado y dificultad por bloque, la forma
menos disruptiva de llegar ahí es añadir columnas **nullable** a la tabla
existente en vez de rehacerla — así el contenido ya sembrado (Tema 1, 2, 3,
8, 11, 13, 17, 21, 25 de AAE y equivalentes de TAI/GSI/C1/Correos) sigue
funcionando sin migración de datos:

```sql
ALTER TABLE bloques_contenido
  ADD COLUMN titulo text,
  ADD COLUMN para_recordar text,
  ADD COLUMN tiempo_estimado_minutos smallint,
  ADD COLUMN dificultad smallint;
```

`renderContent` (`apps/api/src/temario/watermark.util.ts`) seguiría
funcionando igual para bloques sin estas columnas (se renderiza como hoy);
el frontend solo pinta la caja "para recordar"/tiempo estimado cuando el
valor no es null. Esto permite ir migrando tema a tema sin tener que
rehacer los 9 temas de AAE ni los del resto de oposiciones de golpe.

## 3. Para revisar con Rafael cuando despierte

- **Decidir con qué propuesta de las dos rutas de progreso/estructura de
  contenido se queda** (la de esta rama, la que Design haya generado, o una
  fusión de ambas) antes de aplicar ninguna migración — aplicar las dos
  crearía columnas/tablas duplicadas o en conflicto.
- Confirmar si el Tema 3 de AAE es el "tema piloto" que tenía en mente, o si
  prefería que el esfuerzo piloto se concentrase en el Tema 1 de TAI que
  Design ya está desarrollando (en ese caso, el trabajo de esta rama sigue
  siendo válido como tema adicional, no como sustituto).
- Antes de fusionar: ejecutar `pnpm --filter @oponow/db build` y
  `pnpm --filter @oponow/db seed` en local — esta sesión no ha podido
  compilar el paquete porque los symlinks de pnpm hacia el store global no
  son accesibles desde el puente de archivos remoto, así que el código se
  ha revisado a mano pero no se ha compilado ni ejecutado de verdad.
