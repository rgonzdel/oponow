import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  TAI_TEMA2_PREGUNTAS, TAI_TEMA3_PREGUNTAS, TAI_TEMA4_PREGUNTAS, TAI_TEMA5_PREGUNTAS,
  TAI_TEMA6_PREGUNTAS, TAI_TEMA7_PREGUNTAS, TAI_TEMA8_PREGUNTAS, TAI_TEMA9_PREGUNTAS,
} from "../src/content/tai-temario-preguntas-2-9";
import {
  TAI_TEMA10_PREGUNTAS, TAI_TEMA11_PREGUNTAS, TAI_TEMA12_PREGUNTAS, TAI_TEMA13_PREGUNTAS,
  TAI_TEMA14_PREGUNTAS, TAI_TEMA15_PREGUNTAS, TAI_TEMA16_PREGUNTAS, TAI_TEMA17_PREGUNTAS,
} from "../src/content/tai-temario-preguntas-10-17";
import {
  AAE_TEMA2_PREGUNTAS, AAE_TEMA8_PREGUNTAS, AAE_TEMA11_PREGUNTAS, AAE_TEMA13_PREGUNTAS,
  AAE_TEMA17_PREGUNTAS, AAE_TEMA21_PREGUNTAS, AAE_TEMA25_PREGUNTAS,
} from "../src/content/aae-temario-preguntas";
import {
  GSI_TEMA4_PREGUNTAS, GSI_TEMA5_PREGUNTAS, GSI_TEMA8_PREGUNTAS, GSI_TEMA9_PREGUNTAS,
} from "../src/content/gsi-temario-preguntas";
import {
  C1_TEMA3_PREGUNTAS, C1_TEMA16_PREGUNTAS, C1_TEMA18_PREGUNTAS, C1_TEMA19_PREGUNTAS,
  C1_TEMA23_PREGUNTAS, C1_TEMA33_PREGUNTAS, C1_TEMA38_PREGUNTAS,
} from "../src/content/c1-admin-temario-preguntas";
import {
  CORREOS_TEMA2_PREGUNTAS, CORREOS_TEMA5_PREGUNTAS, CORREOS_TEMA10_PREGUNTAS, CORREOS_TEMA11_PREGUNTAS,
} from "../src/content/correos-temario-preguntas";

// tema_id tomados de la consulta ya ejecutada contra el proyecto Supabase real
// (select o.slug, t.orden, t.id from temas t join oposiciones o ...).
const TEMA_ID: Record<string, string> = {
  "tai:2": "21d63b92-c3d0-4f51-a2bc-20f5ffdf431d",
  "tai:3": "fc7b5418-5b1d-43f3-86c0-95835c1c6255",
  "tai:4": "e10d6f39-8314-4f06-ba98-b820e1e4c742",
  "tai:5": "fac50f3d-1dcd-4f15-941a-16b95f28fe5d",
  "tai:6": "07c1eae3-400b-4b6c-91f1-200429bf8692",
  "tai:7": "a2c2bcb5-03b1-4d34-9399-7afdf6845649",
  "tai:8": "1c042bac-b7cf-45c2-a460-56aadf15c342",
  "tai:9": "d97f919c-c4b2-4871-98b1-de7876e8794c",
  "tai:10": "c9c245d4-2c92-4097-94f1-1ff9cc39ef6a",
  "tai:11": "db193189-d79b-4100-8b90-61c0cf4462f6",
  "tai:12": "47510225-cbe1-401d-ba13-d3b27873634b",
  "tai:13": "402d8ee3-4120-41be-8273-cb4b0d6bbd2b",
  "tai:14": "88adf5b7-358f-49e6-bab9-f700a05b6211",
  "tai:15": "62f9af44-09c9-4ad8-aeeb-bcba7ae52e08",
  "tai:16": "842726c2-2547-49ec-bfbd-099c2a38d76d",
  "tai:17": "cd63c6bc-4930-4740-86d9-df2d79196bb6",
  "aae:2": "eb8b4a36-c773-4fd8-a8be-0d203651b27b",
  "aae:8": "f18bd8c6-aa51-443d-b39f-1fca91abde75",
  "aae:11": "192b9266-411b-40a9-aee2-5e87ebb4f536",
  "aae:13": "9b82edf0-431b-4e0b-9bd1-e053a85bd30f",
  "aae:17": "0b4d7ac8-7c38-4b40-8065-66ee3950adf0",
  "aae:21": "fb9e8766-1098-4d6b-99e8-9cbeaffb3c76",
  "aae:25": "ac0d2973-32f8-4ec0-9511-4866e6fa525a",
  "gsi:4": "f320dd10-6616-461c-a6a2-97c6ec207e15",
  "gsi:5": "1fba7280-4010-46f9-b3bc-3c006494c5f8",
  "gsi:8": "76eab3ef-32d8-4406-8d1b-11853b805481",
  "gsi:9": "5e385a5b-91bb-454f-a461-7772b2be765b",
  "c1:3": "14dc8486-6325-4a25-b9ba-d17667170e1b",
  "c1:16": "228d7d57-c497-452a-bfb2-298dca648e60",
  "c1:18": "a5895554-fe16-419a-a0da-cc767a02115d",
  "c1:19": "b1abe2ad-e364-4662-8506-d71aeccba7fc",
  "c1:23": "4c3e6ecc-3c3a-4b37-9718-bbe30ea08515",
  "c1:33": "880ebd53-49bb-459e-bcb9-3070b82b4ee6",
  "c1:38": "cf684b7b-9b96-4df0-ba54-b4aaf5ceece7",
  "correos:2": "773153dd-6630-4a3d-b851-5433ad3facbb",
  "correos:5": "bca6cbb6-26c5-462a-911c-528261c9e130",
  "correos:10": "9cb9edf8-cfd4-470b-809d-7bfe231900f5",
  "correos:11": "95625c45-9181-4b9f-91b5-88adc118b600",
};

interface Pregunta {
  enunciado: string;
  opciones: string[];
  respuestaCorrecta: number;
  justificacionIa: string;
  mnemotecnia: string;
  dificultad: number;
}

const BATCHES: Array<[string, Pregunta[]]> = [
  ["tai:2", TAI_TEMA2_PREGUNTAS], ["tai:3", TAI_TEMA3_PREGUNTAS], ["tai:4", TAI_TEMA4_PREGUNTAS],
  ["tai:5", TAI_TEMA5_PREGUNTAS], ["tai:6", TAI_TEMA6_PREGUNTAS], ["tai:7", TAI_TEMA7_PREGUNTAS],
  ["tai:8", TAI_TEMA8_PREGUNTAS], ["tai:9", TAI_TEMA9_PREGUNTAS],
  ["tai:10", TAI_TEMA10_PREGUNTAS], ["tai:11", TAI_TEMA11_PREGUNTAS], ["tai:12", TAI_TEMA12_PREGUNTAS],
  ["tai:13", TAI_TEMA13_PREGUNTAS], ["tai:14", TAI_TEMA14_PREGUNTAS], ["tai:15", TAI_TEMA15_PREGUNTAS],
  ["tai:16", TAI_TEMA16_PREGUNTAS], ["tai:17", TAI_TEMA17_PREGUNTAS],
  ["aae:2", AAE_TEMA2_PREGUNTAS], ["aae:8", AAE_TEMA8_PREGUNTAS], ["aae:11", AAE_TEMA11_PREGUNTAS],
  ["aae:13", AAE_TEMA13_PREGUNTAS], ["aae:17", AAE_TEMA17_PREGUNTAS], ["aae:21", AAE_TEMA21_PREGUNTAS],
  ["aae:25", AAE_TEMA25_PREGUNTAS],
  ["gsi:4", GSI_TEMA4_PREGUNTAS], ["gsi:5", GSI_TEMA5_PREGUNTAS], ["gsi:8", GSI_TEMA8_PREGUNTAS],
  ["gsi:9", GSI_TEMA9_PREGUNTAS],
  ["c1:3", C1_TEMA3_PREGUNTAS], ["c1:16", C1_TEMA16_PREGUNTAS], ["c1:18", C1_TEMA18_PREGUNTAS],
  ["c1:19", C1_TEMA19_PREGUNTAS], ["c1:23", C1_TEMA23_PREGUNTAS], ["c1:33", C1_TEMA33_PREGUNTAS],
  ["c1:38", C1_TEMA38_PREGUNTAS],
  ["correos:2", CORREOS_TEMA2_PREGUNTAS], ["correos:5", CORREOS_TEMA5_PREGUNTAS],
  ["correos:10", CORREOS_TEMA10_PREGUNTAS], ["correos:11", CORREOS_TEMA11_PREGUNTAS],
];

function sqlStr(s: string): string {
  return `'${s.replace(/'/g, "''")}'`;
}

function sqlStrArray(arr: string[]): string {
  return `ARRAY[${arr.map(sqlStr).join(", ")}]::text[]`;
}

let totalRows = 0;
let out = "";
for (const [key, preguntas] of BATCHES) {
  const temaId = TEMA_ID[key];
  if (!temaId) throw new Error(`Sin tema_id para ${key}`);
  if (preguntas.length === 0) continue;
  out += `-- ${key} (${preguntas.length} preguntas)\n`;
  out += `INSERT INTO preguntas (tema_id, enunciado, opciones, respuesta_correcta, justificacion_ia, mnemotecnia, dificultad)\n`;
  const rows = preguntas.map((p) => {
    totalRows++;
    return `  (${sqlStr(temaId)}, ${sqlStr(p.enunciado)}, to_jsonb(${sqlStrArray(p.opciones)}), ${p.respuestaCorrecta}, ${sqlStr(p.justificacionIa)}, ${sqlStr(p.mnemotecnia)}, ${p.dificultad})`;
  });
  out += `VALUES\n${rows.join(",\n")}\n`;
  out += `ON CONFLICT DO NOTHING;\n\n`;
}

const outPath = resolve(__dirname, "../../../.scratch-preguntas.sql");
writeFileSync(outPath, out, "utf8");
console.log(`Generadas ${totalRows} filas en ${BATCHES.length} lotes -> ${outPath}`);
