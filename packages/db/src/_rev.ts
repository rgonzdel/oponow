import { bancoOficial } from "./content/banco-oficial";
const pre = process.argv.slice(2);
for (const p of bancoOficial()) {
  if (!pre.some((x) => p.id.startsWith(x))) continue;
  const max = Math.max(...p.mal.map((m) => m.length));
  if (p.ok.length > max * 1.15) console.log(`${p.id} [${p.ok.length}/${max}] OK: ${p.ok} || MAL: ${p.mal.join(" | ")}`);
}
