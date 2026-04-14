/**
 * Importa socios desde data/Copia de Socios actuales.xlsx a Supabase.
 *
 * Requiere la service_role key (no la anon key) para saltarse el RLS.
 *
 * Uso:
 *   SUPABASE_SERVICE_ROLE_KEY=<tu_key> node scripts/import-members.mjs
 *
 * La service_role key está en: Supabase Dashboard → Project Settings → API → service_role
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Leer .env.local manualmente (no hay dotenv instalado)
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf-8");
const env = Object.fromEntries(
  envContent
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => l.split("=").map((s) => s.trim()))
);

const SUPABASE_URL = env["NEXT_PUBLIC_SUPABASE_URL"];
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error(
    "Falta SUPABASE_SERVICE_ROLE_KEY.\n" +
    "Ejecútalo así:\n" +
    "  SUPABASE_SERVICE_ROLE_KEY=<tu_key> node scripts/import-members.mjs\n\n" +
    "La key está en: Supabase Dashboard → Project Settings → API → service_role"
  );
  process.exit(1);
}

// Parsear el Excel con el módulo nativo de Node (sin dependencias externas)
// Usamos xlsx si está disponible, o leemos con python como fallback
let members;
try {
  // Intentar con xlsx si está instalado
  const { default: XLSX } = await import("xlsx");
  const wb = XLSX.readFile(join(__dirname, "../data/Copia de Socios actuales.xlsx"));
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: "yyyy-mm-dd" });
  members = parseMembersFromRows(rows);
} catch {
  // xlsx no instalado — usar python para extraer los datos
  const { execSync } = await import("child_process");
  const output = execSync(
    `python3 -c "
import openpyxl, json
wb = openpyxl.load_workbook('${join(__dirname, '../data/Copia de Socios actuales.xlsx')}')
ws = wb.active
data = []
for row in ws.iter_rows(min_row=3, values_only=True):
    if row[0] and row[1]:
        name = str(row[0]).strip()
        dt = row[1]
        if hasattr(dt, 'strftime'):
            date = dt.strftime('%Y-%m-%d')
        else:
            date = str(dt)
        data.append({'name': name, 'date': date})
print(json.dumps(data, ensure_ascii=False))
"`,
    { encoding: "utf-8" }
  );
  members = JSON.parse(output).map(({ name, date }) => ({
    name,
    seniority: date.slice(0, 7) + "-01", // primer día del mes
  }));
}

function parseMembersFromRows(rows) {
  return rows
    .slice(2) // saltar cabeceras (fila 1: título, fila 2: columnas)
    .filter((r) => r[0] && r[1])
    .map((r) => {
      const name = String(r[0]).trim();
      const raw = String(r[1]); // "yyyy-mm-dd" por dateNF
      const seniority = raw.slice(0, 7) + "-01"; // primer día del mes
      return { name, seniority };
    });
}

console.log(`Socios leídos del Excel: ${members.length}`);
console.log("Muestra (primeros 3):");
members.slice(0, 3).forEach((m) => console.log(`  ${m.name} → ${m.seniority}`));
console.log("...");

// Insertar en Supabase
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const { data, error } = await supabase
  .from("members")
  .insert(members)
  .select("id, name, seniority");

if (error) {
  console.error("Error al insertar:", error.message);
  process.exit(1);
}

console.log(`\n✓ ${data.length} socios importados correctamente.`);
