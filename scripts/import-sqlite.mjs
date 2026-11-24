import "./mysql-env.mjs";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { closeDatabase, db, transaction } from "../src/lib/server/database.mjs";
import { db as openSqlite } from "../src/lib/server/sqlite-legacy.mjs";

const filename = resolve(process.argv[2] || "data/shaheen.sqlite");
if (!existsSync(filename)) throw new Error("SQLite source database does not exist.");
process.env.DATABASE_PATH = filename;

const tables = ["administrators", "cms", "inquiries", "media", "audit"];
const sqlite = openSqlite();

try {
  const counts = await transaction(async () => {
    const totals = [];
    for (const table of tables) {
      const existing = await db().prepare(`SELECT COUNT(*) AS total FROM ${table}`).get();
      if (Number(existing.total)) throw new Error(`Target table ${table} already has data. Import into an empty database.`);
    }
    sqlite.exec("BEGIN");
    for (const table of tables) {
      const query = sqlite.prepare(`SELECT * FROM ${table}`);
      let total = 0;
      for (const row of query.iterate()) {
        const entries = Object.entries(row).map(([key, value]) => [
          table === "cms" && key === "key" ? "cms_key" : key,
          value instanceof Uint8Array ? Buffer.from(value) : value,
        ]);
        const columns = entries.map(([key]) => `\`${key}\``).join(",");
        const placeholders = entries.map(() => "?").join(",");
        await db().prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`)
          .run(...entries.map(([, value]) => value));
        total++;
      }
      totals.push([table, total]);
    }
    sqlite.exec("COMMIT");
    return totals;
  });
  for (const [table, total] of counts) console.log(`${table}: ${total} imported`);
  console.log("Import complete. Existing administrators can sign in again with their current credentials.");
} finally {
  sqlite.close();
  await closeDatabase();
}
