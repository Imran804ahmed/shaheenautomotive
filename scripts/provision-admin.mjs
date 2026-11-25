import "./mysql-env.mjs";
import { readFileSync } from "node:fs";
import { db, closeDatabase } from "../src/lib/server/database.mjs";
import { hashPassword } from "../src/lib/server/password.mjs";

const [email, name] = process.argv.slice(2);
const password = readFileSync(0, "utf8").replace(/\r?\n$/, "");
if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !name?.trim() || name.length > 120 || password.length < 6 || password.length > 128) {
  throw new Error("Usage: npm run admin:provision -- email 'Name' < password-file (6–128 characters)");
}
try {
  await db().prepare("INSERT INTO administrators(email,name,password_hash,role) VALUES (?,?,?,'super_admin')")
    .run(email.toLowerCase(), name.trim(), await hashPassword(password));
  console.log("Super administrator created.");
} finally {
  await closeDatabase();
}
