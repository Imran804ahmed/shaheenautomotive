import { execFileSync } from "node:child_process";
import { DatabaseSync } from "node:sqlite";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { db, transaction } from "../src/lib/server/sqlite-legacy.mjs";
import { hashPassword, verifyPassword } from "../src/lib/server/password.mjs";

test("password hashes are salted and reject incorrect passwords", async () => {
  const password = "a test password long enough";
  const hash = await hashPassword(password);
  assert.notEqual(await hashPassword(password), hash);
  assert.equal(await verifyPassword(password, hash), true);
  assert.equal(await verifyPassword("an incorrect test password", hash), false);
});

test("migrations enforce relations, uniqueness and transactional rollback", async () => {
  const directory = await mkdtemp(join(tmpdir(), "shaheen-db-test-"));
  process.env.DATABASE_PATH = join(directory, "test.sqlite");
  try {
    const databaseSource = new URL("../src/lib/server/sqlite-legacy.mjs", import.meta.url).href;
    execFileSync(process.execPath, ["--input-type=module", "-e", `import { db } from ${JSON.stringify(databaseSource)}; db().close()`]);
    const legacy = new DatabaseSync(process.env.DATABASE_PATH);
    legacy.exec("PRAGMA user_version = 3");
    const add = legacy.prepare("INSERT INTO cms(key,published,draft) VALUES (?,?,?)");
    add.run("settings", '{"siteName":"Saved name"}', '{"footerActionHref":"/custom"}');
    add.run("productCategories", '[{"slug":"one"},{"slug":"two","visible":false}]', '[{"slug":"one","featured":false}]');
    legacy.close();

    const database = db();
    assert.equal(database.prepare("PRAGMA user_version").get().user_version, 4);
    const getContent = (key) => {
      const { published, draft } = database.prepare("SELECT published,draft FROM cms WHERE key=?").get(key);
      return [JSON.parse(published), JSON.parse(draft)];
    };
    const [settings, settingsDraft] = getContent("settings");
    assert.equal(settings.siteName, "Saved name");
    assert.equal(settings.footerActionHref, "/contact");
    assert.equal(settingsDraft.footerActionHref, "/custom");
    assert.deepEqual(getContent("productCategories"), [
      [{ slug: "one", visible: true, featured: true }, { slug: "two", visible: false, featured: true }],
      [{ slug: "one", visible: true, featured: false }],
    ]);
    assert.throws(() => database.prepare("INSERT INTO sessions VALUES ('hash',99,99999)").run(), /FOREIGN KEY/);

    const insert = database.prepare("INSERT INTO administrators(email,name,password_hash,role) VALUES (?,?,?,'super_admin')");
    assert.throws(() => transaction(() => {
      insert.run("test@example.com", "Test Administrator", "unused fixture");
      insert.run("TEST@example.com", "Duplicate", "unused fixture");
    }), /UNIQUE/);
    assert.equal(database.prepare("SELECT count(*) AS total FROM administrators").get().total, 0);

    database.prepare("INSERT INTO cms(key,published,draft) VALUES ('hero',?,?)").run('{"title":"Public"}', '{"title":"Draft"}');
    assert.equal(JSON.parse(database.prepare("SELECT published FROM cms WHERE key='hero'").get().published).title, "Public");
    assert.throws(() => database.prepare("INSERT INTO cms(key,published) VALUES ('invalid','not JSON')").run(), /CHECK/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
