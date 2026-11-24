import { closeSync, mkdirSync, openSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

let connection;

export function db() {
  if (connection) return connection;
  const filename = resolve(process.env.DATABASE_PATH || "data/shaheen.sqlite");
  mkdirSync(dirname(filename), { recursive: true, mode: 0o700 });
  closeSync(openSync(filename, "a", 0o600));
  const database = new DatabaseSync(filename);
  try {
    database.exec("PRAGMA busy_timeout = 5000; PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
    database.exec("BEGIN IMMEDIATE");
    if (!database.prepare("PRAGMA user_version").get().user_version) {
      database.exec(`
        CREATE TABLE administrators (
          id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE COLLATE NOCASE,
          name TEXT NOT NULL, password_hash TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('super_admin','admin')),
          active INTEGER NOT NULL DEFAULT 1 CHECK(active IN (0,1)),
          created_at INTEGER NOT NULL DEFAULT (unixepoch()), updated_at INTEGER NOT NULL DEFAULT (unixepoch())
        );
        CREATE TABLE sessions (
          token_hash TEXT PRIMARY KEY, administrator_id INTEGER NOT NULL REFERENCES administrators(id) ON DELETE CASCADE,
          expires_at INTEGER NOT NULL
        );
        CREATE INDEX sessions_administrator ON sessions(administrator_id);
        CREATE INDEX sessions_expiry ON sessions(expires_at);
        CREATE TABLE audit (
          id INTEGER PRIMARY KEY, administrator_id INTEGER REFERENCES administrators(id),
          action TEXT NOT NULL, subject TEXT NOT NULL, created_at INTEGER NOT NULL DEFAULT (unixepoch())
        );
        CREATE TABLE cms (
          key TEXT PRIMARY KEY, published TEXT NOT NULL CHECK(json_valid(published)),
          draft TEXT CHECK(draft IS NULL OR json_valid(draft)),
          revision INTEGER NOT NULL DEFAULT 0, updated_at INTEGER NOT NULL DEFAULT (unixepoch())
        );
        CREATE TABLE inquiries (
          id INTEGER PRIMARY KEY, name TEXT NOT NULL, company TEXT NOT NULL, email TEXT NOT NULL,
          phone TEXT NOT NULL, category TEXT NOT NULL, quantity TEXT NOT NULL, description TEXT NOT NULL,
          message TEXT NOT NULL, attachment_name TEXT, attachment BLOB,
          status TEXT NOT NULL DEFAULT 'unread' CHECK(status IN ('unread','read','closed')),
          created_at INTEGER NOT NULL DEFAULT (unixepoch()), updated_at INTEGER NOT NULL DEFAULT (unixepoch())
        );
        CREATE INDEX inquiries_status_created ON inquiries(status, created_at DESC);
        CREATE TABLE limits (
          key TEXT PRIMARY KEY, expires_at INTEGER NOT NULL, attempts INTEGER NOT NULL
        );
        CREATE INDEX limits_expiry ON limits(expires_at);
        CREATE TABLE reset_tokens (
          token_hash TEXT PRIMARY KEY, administrator_id INTEGER NOT NULL REFERENCES administrators(id) ON DELETE CASCADE,
          expires_at INTEGER NOT NULL
        );
        CREATE INDEX reset_administrator ON reset_tokens(administrator_id);
        CREATE TABLE media (
          id TEXT PRIMARY KEY, name TEXT NOT NULL, alt TEXT NOT NULL, bytes BLOB NOT NULL,
          created_at INTEGER NOT NULL DEFAULT (unixepoch())
        );
        PRAGMA user_version = 1;
      `);
    }
    if (database.prepare("PRAGMA user_version").get().user_version === 1) {
      database.exec(`
        CREATE INDEX inquiries_created ON inquiries(created_at);
        PRAGMA user_version = 2;
      `);
    }
    if (database.prepare("PRAGMA user_version").get().user_version === 2) {
      database.exec(`
        UPDATE cms SET
          published=json_remove(published,'$.domain','$.companyShortName','$.tagline','$.productCategories'),
          draft=json_remove(draft,'$.domain','$.companyShortName','$.tagline','$.productCategories'),
          revision=revision+1
        WHERE key='settings';
        PRAGMA user_version = 3;
      `);
    }
    if (database.prepare("PRAGMA user_version").get().user_version === 3) {
      database.exec(`
        UPDATE cms SET
          published=json_insert(published,
            '$.footerHeadline','Engineering excellence.',
            '$.footerHighlight','Driving the future.',
            '$.footerAction','Start a project',
            '$.footerActionHref','/contact'),
          draft=json_insert(draft,
            '$.footerHeadline','Engineering excellence.',
            '$.footerHighlight','Driving the future.',
            '$.footerAction','Start a project',
            '$.footerActionHref','/contact'),
          revision=revision+1
        WHERE key='settings';
        UPDATE cms SET
          published=(SELECT json_group_array(json_insert(value,
            '$.visible',json('true'),'$.featured',json('true'))) FROM json_each(cms.published)),
          draft=CASE WHEN draft IS NOT NULL THEN
            (SELECT json_group_array(json_insert(value,
              '$.visible',json('true'),'$.featured',json('true'))) FROM json_each(cms.draft))
          END,
          revision=revision+1
        WHERE key='productCategories';
        PRAGMA user_version = 4;
      `);
    }
    database.exec("COMMIT");
    connection = database;
    return connection;
  } catch (error) {
    database.close();
    throw error;
  }
}

export function transaction(work) {
  const database = db();
  database.exec("BEGIN IMMEDIATE");
  try {
    const result = work();
    database.exec("COMMIT");
    return result;
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}
