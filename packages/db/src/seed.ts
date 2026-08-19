import path from "node:path";
import { config } from "dotenv";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { and, eq } from "drizzle-orm";
import * as schema from "./schema";
import {
  TEMA3_BLOQUE_1_CORONA,
  TEMA4_BLOQUE_1_CORTES_CAMARAS,
  TEMA4_BLOQUE_2_ELABORACION_LEYES,
  TEMA4_BLOQUE_3_TRATADOS,
  TEMA5_BLOQUE_1_GOBIERNO,
  TEMA6_BLOQUE_1_RELACIONES,
  TEMA7_BLOQUE_1_PODER_JUDICIAL,
  TEMA8_BLOQUE_1_ECONOMIA,
  TEMA9_BLOQUE_1_TERRITORIAL_PRINCIPIOS,
  TEMA9_BLOQUE_2_CCAA_CONSTITUCION,
  TEMA9_BLOQUE_3_CCAA_CONTROL,
  TEMA10_BLOQUE_1_TRIBUNAL_CONSTITUCIONAL,
  TEMA11_BLOQUE_1_REFORMA,
} from "./content/ce-titulos-2-10";
import {
  AAE_TEMA1_BLOQUE1,
  AAE_TEMA1_BLOQUE2,
  AAE_TEMA8_BLOQUE1,
  AAE_TEMA21_BLOQUE1,
} from "./content/aae-temario";
import { GSI_TEMA1_BLOQUE1, GSI_TEMA5_BLOQUE1, GSI_TEMA8_BLOQUE1 } from "./content/gsi-temario";
import {
  C1_TEMA1_BLOQUE1,
  C1_TEMA18_BLOQUE1,
  C1_TEMA38_BLOQUE1,
} from "./content/c1-admin-temario";
import { sslModeFor } from "./ssl";

config({ path: path.resolve(__dirname, "../../../.env") });

type Db = ReturnType<typeof drizzle<typeof schema>>;

// Catálogo de oposiciones disponibles. Debe mantenerse alineado con
// apps/web/src/data/oposiciones.ts (los `slug` son la clave compartida
// entre el catálogo público y esta tabla). Solo se siembran aquí las
// oposiciones ya "disponibles" en el frontend — las demás son placeholders
// de UI ("Próximamente") sin fila real todavía.
const OPOSICIONES_SEED = [
  {
    slug: "tai",
    nombre: "Técnico Auxiliar de Informática",
    categoria: "Administración General del Estado — Grupo C1",
  },
  {
    slug: "auxiliar-administrativo",
    nombre: "Auxiliar Administrativo del Estado",
    categoria: "Administración General del Estado — Grupo C2",
  },
  {
    slug: "gestion-sistemas-informacion",
    nombre: "Gestión de Sistemas e Informática",
    categoria: "Administración General del Estado — Grupo B",
  },
  {
    slug: "administrativo-estado",
    nombre: "Administrativo del Estado",
    categoria: "Administración General del Estado — Grupo C1",
  },
];

const CONSTITUCION_BOE = "BOE-A-1978-31229";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no está definida (revisa tu .env)");

  // Rol admin: bypassa RLS, igual que las migraciones.
  const client = postgres(url, { max: 1, ssl: sslModeFor(url) });
  const db = drizzle(client, { schema });

  const idBySlug = new Map<string, string>();

  for (const oposicion of OPOSICIONES_SEED) {
    const [row] = await db
      .insert(schema.oposiciones)
      .values(oposicion)
      .onConflictDoUpdate({
        target: schema.oposiciones.slug,
        set: { nombre: oposicion.nombre, categoria: oposicion.categoria },
      })
      .returning({ id: schema.oposiciones.id });
    console.log(`Oposición sembrada: ${oposicion.slug}`);
    idBySlug.set(oposicion.slug, row.id);
  }

  const taiId = idBySlug.get("tai");
  if (taiId) await seedTemarioDemo(db, taiId);

  const aaeId = idBySlug.get("auxiliar-administrativo");
  if (aaeId) await seedTemarioAAE(db, aaeId);

  const gsiId = idBySlug.get("gestion-sistemas-informacion");
  if (gsiId) await seedTemarioGSI(db, gsiId);

  const c1Id = idBySlug.get("administrativo-estado");
  if (c1Id) await seedTemarioC1Admin(db, c1Id);

  await client.end();
}

/**
 * Contenido de demostración para probar de punta a punta el sistema de
 * bloques + RLS por plan (ver apps/api/src/temario).
 *
 * El Tema 1 (gratuito) es contenido original propio, redactado a partir
 * del texto oficial de la Constitución Española (BOE, dominio público) y
 * de la estructura de la propia CE — no es una transcripción ni un
 * parafraseo cercano de ningún manual comercial de terceros. El Tema 2 (de
 * pago) sigue siendo el fragmento corto usado para probar el gating por
 * plan/suscripción.
 */
async function seedTemarioDemo(db: Db, oposicionId: string) {
  const leyId = await upsertLey(db, {
    nombre: "Constitución Española",
    boeReferencia: CONSTITUCION_BOE,
    boeUrl: "https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229",
  });

  const articulo1Id = await upsertArticulo(db, leyId, {
    numero: "1",
    textoOriginal:
      "1. España se constituye en un Estado social y democrático de Derecho, que propugna como valores superiores de su ordenamiento jurídico la libertad, la justicia, la igualdad y el pluralismo político.\n2. La soberanía nacional reside en el pueblo español, del que emanan los poderes del Estado.\n3. La forma política del Estado español es la Monarquía parlamentaria.",
  });

  const articulo103Id = await upsertArticulo(db, leyId, {
    numero: "103.1",
    textoOriginal:
      "La Administración Pública sirve con objetividad los intereses generales y actúa de acuerdo con los principios de eficacia, jerarquía, descentralización, desconcentración y coordinación, con sometimiento pleno a la ley y al Derecho.",
  });

  const articulo9Id = await upsertArticulo(db, leyId, {
    numero: "9.3",
    textoOriginal:
      "La Constitución garantiza el principio de legalidad, la jerarquía normativa, la publicidad de las normas, la irretroactividad de las disposiciones sancionadoras no favorables o restrictivas de derechos individuales, la seguridad jurídica, la responsabilidad y la interdicción de la arbitrariedad de los poderes públicos.",
  });

  const tema1Id = await upsertTema(db, {
    oposicionId,
    orden: 1,
    titulo: "Tema 1 · La Constitución Española de 1978",
    esGratuito: true,
  });

  await upsertBloque(db, {
    temaId: tema1Id,
    orden: 1,
    contenido: TEMA1_BLOQUE_1_ESTRUCTURA,
  });
  await upsertBloque(db, {
    temaId: tema1Id,
    orden: 2,
    articuloId: articulo1Id,
    contenido: TEMA1_BLOQUE_2_TITULO_PRELIMINAR,
  });
  await upsertBloque(db, {
    temaId: tema1Id,
    orden: 3,
    contenido: TEMA1_BLOQUE_3_DERECHOS_FUNDAMENTALES,
  });
  await upsertBloque(db, {
    temaId: tema1Id,
    orden: 4,
    contenido: TEMA1_BLOQUE_4_DEBERES_CIUDADANOS,
  });
  await upsertBloque(db, {
    temaId: tema1Id,
    orden: 5,
    contenido: TEMA1_BLOQUE_5_PRINCIPIOS_RECTORES,
  });
  await upsertBloque(db, {
    temaId: tema1Id,
    orden: 6,
    contenido: TEMA1_BLOQUE_6_GARANTIAS,
  });

  const tema2Id = await upsertTema(db, {
    oposicionId,
    orden: 2,
    titulo: "Tema 2 · Principios constitucionales de la actuación administrativa",
    esGratuito: false,
  });
  await upsertBloque(db, {
    temaId: tema2Id,
    orden: 1,
    articuloId: articulo9Id,
    contenido:
      "El artículo 9.3 de la Constitución Española recoge los principios que limitan y garantizan toda actuación de los poderes públicos:\n\n" +
      "«La Constitución garantiza el principio de legalidad, la jerarquía normativa, la publicidad de las normas, la irretroactividad de las disposiciones sancionadoras no favorables o restrictivas de derechos individuales, la seguridad jurídica, la responsabilidad y la interdicción de la arbitrariedad de los poderes públicos.»\n\n" +
      "Para un TAI, dos de estos principios son especialmente relevantes en el día a día: la seguridad jurídica (los sistemas de información deben reflejar fielmente lo que establece la norma vigente, no una interpretación particular) y la interdicción de la arbitrariedad (cualquier decisión automatizada o asistida por un sistema informático de la Administración debe poder justificarse por referencia a una norma, no a un criterio discrecional no motivado).",
  });

  const tema3Id = await upsertTema(db, {
    oposicionId,
    orden: 3,
    titulo: "Tema 3 · La Corona",
    esGratuito: false,
  });
  await upsertBloque(db, { temaId: tema3Id, orden: 1, contenido: TEMA3_BLOQUE_1_CORONA });

  const tema4Id = await upsertTema(db, {
    oposicionId,
    orden: 4,
    titulo: "Tema 4 · Las Cortes Generales",
    esGratuito: false,
  });
  await upsertBloque(db, { temaId: tema4Id, orden: 1, contenido: TEMA4_BLOQUE_1_CORTES_CAMARAS });
  await upsertBloque(db, { temaId: tema4Id, orden: 2, contenido: TEMA4_BLOQUE_2_ELABORACION_LEYES });
  await upsertBloque(db, { temaId: tema4Id, orden: 3, contenido: TEMA4_BLOQUE_3_TRATADOS });

  const tema5Id = await upsertTema(db, {
    oposicionId,
    orden: 5,
    titulo: "Tema 5 · El Gobierno y la Administración",
    esGratuito: false,
  });
  await upsertBloque(db, {
    temaId: tema5Id,
    orden: 1,
    articuloId: articulo103Id,
    contenido: TEMA5_BLOQUE_1_GOBIERNO,
  });

  const tema6Id = await upsertTema(db, {
    oposicionId,
    orden: 6,
    titulo: "Tema 6 · Relaciones entre el Gobierno y las Cortes Generales",
    esGratuito: false,
  });
  await upsertBloque(db, { temaId: tema6Id, orden: 1, contenido: TEMA6_BLOQUE_1_RELACIONES });

  const tema7Id = await upsertTema(db, {
    oposicionId,
    orden: 7,
    titulo: "Tema 7 · El Poder Judicial",
    esGratuito: false,
  });
  await upsertBloque(db, { temaId: tema7Id, orden: 1, contenido: TEMA7_BLOQUE_1_PODER_JUDICIAL });

  const tema8Id = await upsertTema(db, {
    oposicionId,
    orden: 8,
    titulo: "Tema 8 · Economía y Hacienda",
    esGratuito: false,
  });
  await upsertBloque(db, { temaId: tema8Id, orden: 1, contenido: TEMA8_BLOQUE_1_ECONOMIA });

  const tema9Id = await upsertTema(db, {
    oposicionId,
    orden: 9,
    titulo: "Tema 9 · Organización Territorial del Estado",
    esGratuito: false,
  });
  await upsertBloque(db, { temaId: tema9Id, orden: 1, contenido: TEMA9_BLOQUE_1_TERRITORIAL_PRINCIPIOS });
  await upsertBloque(db, { temaId: tema9Id, orden: 2, contenido: TEMA9_BLOQUE_2_CCAA_CONSTITUCION });
  await upsertBloque(db, { temaId: tema9Id, orden: 3, contenido: TEMA9_BLOQUE_3_CCAA_CONTROL });

  const tema10Id = await upsertTema(db, {
    oposicionId,
    orden: 10,
    titulo: "Tema 10 · El Tribunal Constitucional",
    esGratuito: false,
  });
  await upsertBloque(db, {
    temaId: tema10Id,
    orden: 1,
    contenido: TEMA10_BLOQUE_1_TRIBUNAL_CONSTITUCIONAL,
  });

  const tema11Id = await upsertTema(db, {
    oposicionId,
    orden: 11,
    titulo: "Tema 11 · La reforma constitucional",
    esGratuito: false,
  });
  await upsertBloque(db, { temaId: tema11Id, orden: 1, contenido: TEMA11_BLOQUE_1_REFORMA });

  console.log(
    "Temario demo sembrado: 11 temas de TAI (Tema 1 gratuito, Temas 2-11 de pago) cubriendo la Constitución Española completa.",
  );
}

/**
 * ~10% del temario oficial de cada oposición nueva (Auxiliar Administrativo,
 * Gestión de Sistemas e Informática, Administrativo del Estado) — el resto
 * de temas queda pendiente (ver packages/shared-types/src/oposiciones.ts,
 * bloques[] refleja el recuento oficial completo aunque solo estos estén
 * sembrados). Numeración y títulos oficiales según el BOE citado en cada
 * archivo de content/; redacción propia.
 */
async function seedTemarioAAE(db: Db, oposicionId: string) {
  const tema1Id = await upsertTema(db, {
    oposicionId,
    orden: 1,
    titulo: "Tema 1 · La Constitución Española de 1978",
    esGratuito: true,
  });
  await upsertBloque(db, { temaId: tema1Id, orden: 1, contenido: AAE_TEMA1_BLOQUE1 });
  await upsertBloque(db, { temaId: tema1Id, orden: 2, contenido: AAE_TEMA1_BLOQUE2 });

  const tema8Id = await upsertTema(db, {
    oposicionId,
    orden: 8,
    titulo: "Tema 8 · La Administración General del Estado",
    esGratuito: false,
  });
  await upsertBloque(db, { temaId: tema8Id, orden: 1, contenido: AAE_TEMA8_BLOQUE1 });

  const tema21Id = await upsertTema(db, {
    oposicionId,
    orden: 21,
    titulo: "Tema 21 · Informática básica",
    esGratuito: false,
  });
  await upsertBloque(db, { temaId: tema21Id, orden: 1, contenido: AAE_TEMA21_BLOQUE1 });

  console.log("Temario sembrado: 3 temas de Auxiliar Administrativo del Estado.");
}

async function seedTemarioGSI(db: Db, oposicionId: string) {
  const tema1Id = await upsertTema(db, {
    oposicionId,
    orden: 1,
    titulo: "Tema 1 · Los contratos de las Administraciones públicas",
    esGratuito: true,
  });
  await upsertBloque(db, { temaId: tema1Id, orden: 1, contenido: GSI_TEMA1_BLOQUE1 });

  const tema5Id = await upsertTema(db, {
    oposicionId,
    orden: 5,
    titulo: "Tema 5 · Ciberseguridad",
    esGratuito: false,
  });
  await upsertBloque(db, { temaId: tema5Id, orden: 1, contenido: GSI_TEMA5_BLOQUE1 });

  const tema8Id = await upsertTema(db, {
    oposicionId,
    orden: 8,
    titulo: "Tema 8 · Inteligencia artificial",
    esGratuito: false,
  });
  await upsertBloque(db, { temaId: tema8Id, orden: 1, contenido: GSI_TEMA8_BLOQUE1 });

  console.log("Temario sembrado: 3 temas de Gestión de Sistemas e Informática.");
}

async function seedTemarioC1Admin(db: Db, oposicionId: string) {
  const tema1Id = await upsertTema(db, {
    oposicionId,
    orden: 1,
    titulo: "Tema 1 · La Constitución Española de 1978",
    esGratuito: true,
  });
  await upsertBloque(db, { temaId: tema1Id, orden: 1, contenido: C1_TEMA1_BLOQUE1 });

  const tema18Id = await upsertTema(db, {
    oposicionId,
    orden: 18,
    titulo: "Tema 18 · Las Leyes del Procedimiento Administrativo Común",
    esGratuito: false,
  });
  await upsertBloque(db, { temaId: tema18Id, orden: 1, contenido: C1_TEMA18_BLOQUE1 });

  const tema38Id = await upsertTema(db, {
    oposicionId,
    orden: 38,
    titulo: "Tema 38 · Informática básica",
    esGratuito: false,
  });
  await upsertBloque(db, { temaId: tema38Id, orden: 1, contenido: C1_TEMA38_BLOQUE1 });

  console.log("Temario sembrado: 3 temas de Administrativo del Estado.");
}

const TEMA1_BLOQUE_1_ESTRUCTURA = `## Aprobación y entrada en vigor
La Constitución Española (CE) fue aprobada por las Cortes en sesiones plenarias del Congreso y el Senado el 31 de octubre de 1978, ratificada en referéndum el 6 de diciembre de 1978, sancionada por el Rey el 27 de diciembre y publicada en el BOE número 311, de 29 de diciembre de 1978, fecha de su entrada en vigor. Es la norma suprema del ordenamiento jurídico español: toda ley, reglamento o acto de los poderes públicos debe ajustarse a ella.

## Estructura formal
Se compone de un preámbulo, un título preliminar, diez títulos numerados del I al X, cuatro disposiciones adicionales, nueve disposiciones transitorias, una disposición derogatoria y una disposición final. En total suma 169 artículos.

## El preámbulo
No tiene fuerza jurídica vinculante por sí mismo, pero orienta la interpretación del resto del texto: expresa la voluntad de garantizar la convivencia democrática, consolidar un Estado de derecho, proteger a españoles y pueblos de España en el ejercicio de sus derechos, promover el progreso, establecer una sociedad democrática avanzada y colaborar en el fortalecimiento de relaciones pacíficas entre los pueblos.

## Parte dogmática y parte orgánica
Por su contenido, se distingue habitualmente entre una parte dogmática, que recoge los principios y derechos (título preliminar y título I), y una parte orgánica, que organiza los poderes del Estado (títulos II a IX). El título X, dedicado a la reforma constitucional, no encaja en ninguna de las dos categorías anteriores.

## Los diez títulos
I. De los derechos y deberes fundamentales (arts. 10 a 55); II. De la Corona (arts. 56 a 65); III. De las Cortes Generales (arts. 66 a 96); IV. Del Gobierno y de la Administración (arts. 97 a 107); V. De las relaciones entre el Gobierno y las Cortes Generales (arts. 108 a 116); VI. Del Poder Judicial (arts. 117 a 127); VII. Economía y Hacienda (arts. 128 a 136); VIII. De la Organización Territorial del Estado (arts. 137 a 158); IX. Del Tribunal Constitucional (arts. 159 a 165); X. De la reforma constitucional (arts. 166 a 169).

## Qué cubre este tema
Este primer tema se centra en el título preliminar y en el título I, que son la base de todo lo demás: definen qué tipo de Estado es España, qué valores lo sustentan y qué derechos y deberes tienen las personas frente a los poderes públicos. Los títulos II a X, sobre la organización concreta de la Corona, las Cortes, el Gobierno, el Poder Judicial y el resto de instituciones, se desarrollan en temas posteriores.`;

const TEMA1_BLOQUE_2_TITULO_PRELIMINAR = `## Título preliminar (artículos 1 a 9)
Fija los rasgos de identidad del Estado español antes de entrar en el desarrollo de derechos o de instituciones concretas.

## Artículo 1 · Estado social y democrático de Derecho
Es el más citado de todo el texto: en su apartado 1 define a España como un Estado social y democrático de Derecho, que propugna como valores superiores de su ordenamiento jurídico la libertad, la justicia, la igualdad y el pluralismo político. El apartado 2 sitúa la soberanía nacional en el pueblo español, del que emanan los poderes del Estado. El apartado 3 establece que la forma política del Estado español es la Monarquía parlamentaria.

## Artículo 2 · Unidad de la Nación y derecho a la autonomía
Recoge el llamado principio dispositivo: la Constitución se fundamenta en la indisoluble unidad de la Nación española, patria común e indivisible de todos los españoles, y al mismo tiempo reconoce y garantiza el derecho a la autonomía de las nacionalidades y regiones que la integran y la solidaridad entre todas ellas. Es la base sobre la que se construye después, en el título VIII, el Estado de las Autonomías.

## Artículo 3 · Lenguas oficiales
Declara el castellano como la lengua española oficial del Estado: todos los españoles tienen el deber de conocerla y el derecho a usarla. Las demás lenguas españolas serán también oficiales en las respectivas Comunidades Autónomas de acuerdo con sus estatutos, y la riqueza de las distintas modalidades lingüísticas de España es un patrimonio cultural que será objeto de especial respeto y protección.

## Artículo 4 · Bandera
Describe la bandera de España (roja, amarilla —de doble anchura que la roja— y roja) y permite que los estatutos de autonomía reconozcan banderas y enseñas propias de las Comunidades Autónomas, para su uso junto a la bandera de España en edificios públicos y actos oficiales.

## Artículo 5 · Capital
Fija la capital del Estado en la villa de Madrid.

## Artículo 6 · Partidos políticos
Expresan el pluralismo político, concurren a la formación y manifestación de la voluntad popular y son instrumento fundamental para la participación política. Su creación y el ejercicio de su actividad son libres dentro del respeto a la Constitución y a la ley, y su estructura interna y funcionamiento deben ser democráticos.

## Artículo 7 · Sindicatos y asociaciones empresariales
Dice lo mismo, con matices, para los sindicatos de trabajadores y las asociaciones empresariales: contribuyen a la defensa y promoción de los intereses económicos y sociales que les son propios, con creación y ejercicio libres y estructura y funcionamiento democráticos.

## Artículo 8 · Fuerzas Armadas
Se ocupa de las Fuerzas Armadas (Ejército de Tierra, Armada y Ejército del Aire), cuya misión es garantizar la soberanía e independencia de España, defender su integridad territorial y el ordenamiento constitucional; una ley orgánica regula las bases de la organización militar.

## Artículo 9 · Sujeción al ordenamiento y principio de legalidad
Cierra el título preliminar con tres apartados clave para cualquier empleado público. El 9.1 sujeta a ciudadanos y poderes públicos a la Constitución y al resto del ordenamiento jurídico. El 9.2 encomienda a los poderes públicos promover las condiciones para que la libertad y la igualdad del individuo y de los grupos en que se integra sean reales y efectivas, remover los obstáculos que impidan o dificulten su plenitud, y facilitar la participación de todos los ciudadanos en la vida política, económica, cultural y social. El 9.3 garantiza el principio de legalidad, la jerarquía normativa, la publicidad de las normas, la irretroactividad de las disposiciones sancionadoras no favorables o restrictivas de derechos individuales, la seguridad jurídica, la responsabilidad y la interdicción de la arbitrariedad de los poderes públicos — este último apartado es, junto con el artículo 103.1 del título IV, uno de los fundamentos jurídicos de cómo debe comportarse cualquier Administración Pública, incluida la gestión de sus sistemas de información.`;

const TEMA1_BLOQUE_3_DERECHOS_FUNDAMENTALES = `## Título I (artículos 10 a 55)
"De los derechos y deberes fundamentales" es el título más extenso de la Constitución y el que con más frecuencia aparece en los exámenes. Se divide en cinco capítulos: I. De los españoles y los extranjeros; II. Derechos y libertades (con dos secciones); III. De los principios rectores de la política social y económica; IV. De las garantías de las libertades y derechos fundamentales; V. De la suspensión de los derechos y libertades.

## Artículo 10 · Cláusula general
Abre el título con una idea de fondo: la dignidad de la persona, los derechos inviolables que le son inherentes, el libre desarrollo de la personalidad, el respeto a la ley y a los derechos de los demás son fundamento del orden político y de la paz social. Además, las normas relativas a derechos fundamentales y libertades se interpretan de conformidad con la Declaración Universal de los Derechos Humanos y los tratados internacionales ratificados por España.

## Artículos 11 a 13 · Españoles y extranjeros
El capítulo I regula la nacionalidad. El artículo 11 establece que la nacionalidad española se adquiere, conserva y pierde de acuerdo con la ley, y que ningún español de origen puede ser privado de su nacionalidad. El artículo 12 fija la mayoría de edad en los 18 años. El artículo 13 dice que los extranjeros gozarán en España de las libertades públicas según los tratados y la ley, que solo los españoles son titulares de los derechos del artículo 23 (salvo excepción por reciprocidad para el sufragio municipal) y que la extradición solo se concede en cumplimiento de un tratado o de la ley, quedando excluidos los delitos políticos.

## Artículo 14 · Igualdad ante la ley
Abre la sección 1ª del capítulo II —"De los derechos fundamentales y de las libertades públicas", artículos 15 a 29, la parte más protegida del texto, que solo puede desarrollarse por ley orgánica y cuenta con recurso de amparo ante el Tribunal Constitucional— declarando a los españoles iguales ante la ley, sin que pueda prevalecer discriminación alguna por razón de nacimiento, raza, sexo, religión, opinión o cualquier otra condición o circunstancia personal o social.

## Artículo 15 · Vida e integridad física y moral
Reconoce el derecho a la vida y a la integridad física y moral, prohíbe la tortura y las penas o tratos inhumanos o degradantes, y abole la pena de muerte salvo lo que puedan disponer las leyes penales militares para tiempos de guerra.

## Artículo 16 · Libertad ideológica, religiosa y de culto
Garantiza la libertad ideológica, religiosa y de culto, sin más limitación que el mantenimiento del orden público; nadie puede ser obligado a declarar su ideología, religión o creencias, y ninguna confesión tiene carácter estatal, sin perjuicio de la cooperación con la Iglesia Católica y las demás confesiones.

## Artículo 17 · Libertad y seguridad
Protege la libertad y la seguridad: la detención preventiva no puede durar más del tiempo estrictamente necesario y en ningún caso más de 72 horas, el detenido debe ser informado de forma inmediata y comprensible de sus derechos y de las razones de la detención, y se garantiza el procedimiento de habeas corpus.

## Artículo 18 · Honor, intimidad y domicilio
Protege el honor, la intimidad personal y familiar y la propia imagen; declara inviolable el domicilio, que solo puede registrarse con consentimiento del titular, resolución judicial o en caso de flagrante delito; garantiza el secreto de las comunicaciones salvo resolución judicial, y encarga a la ley limitar el uso de la informática para garantizar el honor, la intimidad y el pleno ejercicio de los derechos de las personas.

## Artículo 19 · Libertad de residencia y circulación
Reconoce la libertad de elegir residencia y de circular por el territorio nacional, y de entrar y salir libremente de España.

## Artículo 20 · Libertad de expresión e información
Recoge el derecho a expresar y difundir libremente pensamientos, ideas y opiniones; a la producción y creación literaria, artística, científica y técnica; la libertad de cátedra; y el derecho a comunicar o recibir información veraz por cualquier medio de difusión. El ejercicio de estos derechos no puede restringirse mediante ningún tipo de censura previa, y solo cabe el secuestro de publicaciones, grabaciones u otros medios de información en virtud de resolución judicial.

## Artículo 21 · Derecho de reunión
Reconoce el derecho de reunión pacífica y sin armas, que no necesita autorización previa, aunque las reuniones en lugares de tránsito público y las manifestaciones deben comunicarse previamente a la autoridad.

## Artículo 22 · Derecho de asociación
Reconoce el derecho de asociación; son ilegales las asociaciones que persigan fines o utilicen medios tipificados como delito, y quedan prohibidas las secretas y las de carácter paramilitar.

## Artículo 23 · Participación en asuntos públicos
Reconoce el derecho de los ciudadanos a participar en los asuntos públicos, directamente o por medio de representantes, y el derecho a acceder en condiciones de igualdad a las funciones y cargos públicos.

## Artículo 24 · Tutela judicial efectiva
Uno de los más preguntados en cualquier oposición: garantiza la tutela judicial efectiva sin que en ningún caso pueda producirse indefensión, y en el ámbito penal el derecho al juez ordinario predeterminado por la ley, a la defensa y asistencia de letrado, a ser informado de la acusación, a un proceso público sin dilaciones indebidas con todas las garantías, a utilizar los medios de prueba pertinentes, a no declarar contra sí mismo, a no confesarse culpable y a la presunción de inocencia.

## Artículo 25 · Principio de legalidad penal
Nadie puede ser condenado por acciones u omisiones que en el momento de producirse no constituyan delito, falta o infracción administrativa según la legislación vigente; las penas privativas de libertad y las medidas de seguridad se orientan hacia la reeducación y la reinserción social.

## Artículo 26 · Tribunales de honor
Prohíbe los tribunales de honor en el ámbito de la Administración civil y de las organizaciones profesionales.

## Artículo 27 · Educación
Reconoce el derecho a la educación y la libertad de enseñanza; la enseñanza básica es obligatoria y gratuita, y se garantiza la autonomía de las universidades.

## Artículo 28 · Sindicación y huelga
Reconoce el derecho a sindicarse libremente y el derecho a la huelga de los trabajadores para la defensa de sus intereses, garantizando el mantenimiento de los servicios esenciales de la comunidad.

## Artículo 29 · Derecho de petición
Cierra la sección con el derecho de petición individual y colectiva, siempre por escrito, ante los poderes públicos.`;

const TEMA1_BLOQUE_4_DEBERES_CIUDADANOS = `## Sección 2ª del capítulo II (artículos 30 a 38)
"De los derechos y deberes de los ciudadanos" tiene un grado de protección menor que la sección 1ª: se desarrolla por ley ordinaria y no tiene recurso de amparo directo, aunque sigue vinculando a todos los poderes públicos.

## Artículo 30 · Defensa de España y objeción de conciencia
Reconoce el derecho y el deber de los españoles de defender España; regula la objeción de conciencia y prevé la posibilidad de un servicio civil sustitutorio.

## Artículo 31 · Deber de contribuir
Establece el deber de contribuir al sostenimiento de los gastos públicos de acuerdo con la capacidad económica de cada uno, mediante un sistema tributario justo inspirado en los principios de igualdad y progresividad, que en ningún caso tendrá alcance confiscatorio; el gasto público debe realizar una asignación equitativa de los recursos.

## Artículo 32 · Matrimonio
Reconoce el derecho del hombre y la mujer a contraer matrimonio con plena igualdad jurídica.

## Artículo 33 · Propiedad privada y herencia
Reconoce el derecho a la propiedad privada y a la herencia, delimitado por su función social; nadie puede ser privado de sus bienes salvo por causa justificada de utilidad pública o interés social, mediante la correspondiente indemnización.

## Artículo 34 · Derecho de fundación
Reconoce el derecho de fundación para fines de interés general.

## Artículo 35 · Trabajo
Reconoce el deber de trabajar y el derecho al trabajo, a la libre elección de profesión u oficio, a la promoción a través del trabajo y a una remuneración suficiente, sin que en ningún caso pueda hacerse discriminación por razón de sexo.

## Artículo 36 · Colegios profesionales
Remite a la ley la regulación de las peculiaridades propias del régimen jurídico de los colegios profesionales y el ejercicio de las profesiones tituladas.

## Artículo 37 · Negociación colectiva
Garantiza el derecho a la negociación colectiva laboral entre representantes de trabajadores y empresarios, y reconoce el derecho de unos y otros a adoptar medidas de conflicto colectivo, con las garantías necesarias para asegurar el funcionamiento de los servicios esenciales de la comunidad.

## Artículo 38 · Libertad de empresa
Reconoce la libertad de empresa en el marco de una economía de mercado, que los poderes públicos garantizan y protegen de acuerdo con las exigencias de la economía general.`;

const TEMA1_BLOQUE_5_PRINCIPIOS_RECTORES = `## Capítulo III (artículos 39 a 52)
"De los principios rectores de la política social y económica" tiene la protección más débil de todo el título I: informa la legislación, la práctica judicial y la actuación de los poderes públicos, pero solo puede alegarse ante los tribunales ordinarios de acuerdo con lo que dispongan las leyes que los desarrollen — no da lugar, por sí mismo, a un derecho subjetivo directamente exigible como los de la sección 1ª.

## Artículo 39 · Familia e infancia
Asegura la protección social, económica y jurídica de la familia y de la infancia.

## Artículo 40 · Pleno empleo y formación profesional
Promueve condiciones favorables para el progreso social y económico y una política orientada al pleno empleo, así como la formación y readaptación profesionales.

## Artículo 41 · Seguridad Social
Mantiene un régimen público de Seguridad Social para todos los ciudadanos.

## Artículo 42 · Emigración
Vela por los derechos económicos y sociales de los trabajadores españoles en el extranjero.

## Artículo 43 · Salud
Organiza y tutela la salud pública a través de medidas preventivas y de las prestaciones y servicios necesarios, y fomenta la educación sanitaria, física y el deporte.

## Artículo 44 · Cultura e investigación
Promueve y tutela el acceso a la cultura y la investigación científica y técnica.

## Artículo 45 · Medio ambiente
Reconoce el derecho a disfrutar de un medio ambiente adecuado y el deber de conservarlo, con sanciones penales o administrativas para quien lo dañe.

## Artículo 46 · Patrimonio histórico y cultural
Garantiza la conservación del patrimonio histórico, artístico y cultural de los pueblos de España.

## Artículo 47 · Vivienda
Reconoce el derecho a una vivienda digna y adecuada, regulando el suelo para impedir la especulación.

## Artículo 48 · Juventud
Promueve la participación libre y eficaz de la juventud en el desarrollo político, social, económico y cultural.

## Artículo 49 · Personas con discapacidad
Prevé una política de previsión, tratamiento, rehabilitación e integración de las personas con discapacidad.

## Artículo 50 · Tercera edad
Garantiza mediante pensiones adecuadas y periódicamente actualizadas la suficiencia económica de las personas durante la tercera edad.

## Artículo 51 · Consumidores y usuarios
Garantiza la defensa de los consumidores y usuarios, protegiendo su seguridad, salud y legítimos intereses económicos.

## Artículo 52 · Organizaciones profesionales
Remite a la ley la regulación de las organizaciones profesionales que contribuyan a la defensa de los intereses económicos que les sean propios, con estructura y funcionamiento democráticos.`;

const TEMA1_BLOQUE_6_GARANTIAS = `## Capítulo IV (artículos 53 y 54)
"De las garantías de las libertades y derechos fundamentales" explica cómo se protege en la práctica todo lo anterior — es la clave para entender por qué unos derechos "pesan" más que otros dentro del mismo título I.

## Artículo 53 · Los tres niveles de protección
El apartado 53.1 vincula a todos los poderes públicos los derechos y libertades reconocidos en el capítulo II; solo por ley, que en todo caso debe respetar su contenido esencial, puede regularse su ejercicio, y esa regulación se tutela de acuerdo con el artículo 161.1.a) (el recurso de inconstitucionalidad). El apartado 53.2 añade una vía reforzada, exclusiva de los derechos del artículo 14 y de la sección 1ª del capítulo II (artículos 15 a 29), más la objeción de conciencia del artículo 30.2: cualquier ciudadano puede recabar su tutela ante los tribunales ordinarios por un procedimiento basado en los principios de preferencia y sumariedad y, en su caso, a través del recurso de amparo ante el Tribunal Constitucional. El apartado 53.3 aclara que los principios del capítulo III solo informan la legislación positiva, la práctica judicial y la actuación de los poderes públicos, y solo pueden alegarse ante la jurisdicción ordinaria de acuerdo con lo que dispongan las leyes que los desarrollen.

## En resumen: tres niveles de protección
El máximo, para el artículo 14 y la sección 1ª del capítulo II (ley orgánica + tutela ordinaria preferente y sumaria + recurso de amparo); uno intermedio, para el resto de derechos y deberes del capítulo II, artículos 30 a 38 (reserva de ley ordinaria + recurso de inconstitucionalidad, sin amparo); y uno mínimo, para los principios rectores del capítulo III (sin reserva de ley ni recurso directo ante el Tribunal Constitucional).

## Artículo 54 · El Defensor del Pueblo
Crea la figura del Defensor del Pueblo: un alto comisionado de las Cortes Generales, designado por estas para la defensa de los derechos del título I, que puede supervisar la actividad de la Administración y dar cuenta a las Cortes Generales.

## Artículo 55 · Suspensión de derechos y libertades
El capítulo V permite suspender determinados derechos (entre ellos los de los artículos 17, 18.2 y 18.3, 19, 20.1.a) y 20.1.d), 20.5, 21, 28.2 y 37.2) cuando se declaren los estados de excepción o de sitio regulados en el artículo 116, con la excepción de que el artículo 17.3 no puede suspenderse durante el estado de excepción. El apartado 55.2 prevé además una suspensión individual, para personas concretas relacionadas con investigaciones sobre bandas armadas o elementos terroristas, sujeta a intervención judicial y control parlamentario; el uso injustificado o abusivo de esta facultad genera responsabilidad penal por violación de los derechos y libertades reconocidos en las leyes.`;

async function upsertLey(
  db: Db,
  data: { nombre: string; boeReferencia: string; boeUrl: string },
): Promise<string> {
  const [existing] = await db
    .select({ id: schema.leyes.id })
    .from(schema.leyes)
    .where(eq(schema.leyes.boeReferencia, data.boeReferencia))
    .limit(1);
  if (existing) return existing.id;

  const [row] = await db.insert(schema.leyes).values(data).returning({ id: schema.leyes.id });
  return row.id;
}

async function upsertArticulo(
  db: Db,
  leyId: string,
  data: { numero: string; textoOriginal: string },
): Promise<string> {
  const [existing] = await db
    .select({ id: schema.articulos.id })
    .from(schema.articulos)
    .where(and(eq(schema.articulos.leyId, leyId), eq(schema.articulos.numero, data.numero)))
    .limit(1);
  if (existing) return existing.id;

  const [row] = await db
    .insert(schema.articulos)
    .values({ leyId, ...data })
    .returning({ id: schema.articulos.id });
  return row.id;
}

async function upsertTema(
  db: Db,
  data: { oposicionId: string; orden: number; titulo: string; esGratuito: boolean },
): Promise<string> {
  const [existing] = await db
    .select({ id: schema.temas.id })
    .from(schema.temas)
    .where(and(eq(schema.temas.oposicionId, data.oposicionId), eq(schema.temas.orden, data.orden)))
    .limit(1);
  if (existing) {
    await db
      .update(schema.temas)
      .set({ titulo: data.titulo, esGratuito: data.esGratuito })
      .where(eq(schema.temas.id, existing.id));
    return existing.id;
  }

  const [row] = await db.insert(schema.temas).values(data).returning({ id: schema.temas.id });
  return row.id;
}

async function upsertBloque(
  db: Db,
  data: { temaId: string; orden: number; articuloId?: string; contenido: string },
): Promise<string> {
  const [existing] = await db
    .select({ id: schema.bloquesContenido.id })
    .from(schema.bloquesContenido)
    .where(
      and(
        eq(schema.bloquesContenido.temaId, data.temaId),
        eq(schema.bloquesContenido.orden, data.orden),
      ),
    )
    .limit(1);
  if (existing) {
    await db
      .update(schema.bloquesContenido)
      .set({ contenido: data.contenido, articuloId: data.articuloId ?? null })
      .where(eq(schema.bloquesContenido.id, existing.id));
    return existing.id;
  }

  const [row] = await db
    .insert(schema.bloquesContenido)
    .values({
      temaId: data.temaId,
      orden: data.orden,
      contenido: data.contenido,
      articuloId: data.articuloId,
    })
    .returning({ id: schema.bloquesContenido.id });
  return row.id;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
