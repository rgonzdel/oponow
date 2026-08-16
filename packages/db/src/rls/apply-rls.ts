import { readFileSync } from "node:fs";
import path from "node:path";
import { config } from "dotenv";
import postgres from "postgres";

config({ path: path.resolve(__dirname, "../../../../.env") });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no está definida (revisa tu .env)");

  const sql = postgres(url, { max: 1 });

  try {
    for (const file of ["grants.sql", "auth-grants.sql", "policies.sql"]) {
      const filePath = path.join(__dirname, file);
      console.log(`Aplicando ${file}...`);
      const raw = readFileSync(filePath, "utf-8");
      await sql.unsafe(raw);
    }
    console.log("Grants y políticas RLS aplicados.");
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
