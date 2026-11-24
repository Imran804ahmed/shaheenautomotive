import "./mysql-env.mjs";
import { closeDatabase, db } from "../src/lib/server/database.mjs";

try {
  await db().prepare("SELECT 1").get();
  console.log("MySQL schema ready.");
} finally {
  await closeDatabase();
}
