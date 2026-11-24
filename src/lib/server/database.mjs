import { AsyncLocalStorage } from "node:async_hooks";
import mysql from "mysql2/promise";
import { schema } from "./mysql-schema.mjs";

const context = new AsyncLocalStorage();
let pool;
let initialization;

function getPool() {
  if (!pool) {
    const { MYSQL_HOST, MYSQL_PORT, MYSQL_SOCKET, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_TLS } = process.env;
    if (!MYSQL_DATABASE || !MYSQL_USER) throw new Error("Configure MYSQL_DATABASE and MYSQL_USER before starting Shaheen Automotive.");
    pool = mysql.createPool({
      host: MYSQL_HOST || "127.0.0.1",
      port: Number(MYSQL_PORT || 3306),
      socketPath: MYSQL_SOCKET || undefined,
      database: MYSQL_DATABASE,
      user: MYSQL_USER,
      password: MYSQL_PASSWORD ?? "",
      ssl: MYSQL_TLS === "1" ? { rejectUnauthorized: true } : undefined,
      charset: "utf8mb4",
      jsonStrings: true,
      timezone: "Z",
      connectionLimit: 8,
    });
  }
  return pool;
}

async function ready() {
  const database = getPool();
  initialization ??= (async () => {
    const connection = await database.getConnection();
    try {
      const [[row]] = await connection.query("SELECT GET_LOCK(SHA2(CONCAT(DATABASE(), ':shaheen-schema'),256),30) AS acquired");
      if (row.acquired !== 1) throw new Error("Could not acquire the schema migration lock.");
      try {
        for (const statement of schema) await connection.query(statement);
      } finally {
        await connection.query("SELECT RELEASE_LOCK(SHA2(CONCAT(DATABASE(), ':shaheen-schema'),256))");
      }
    } finally {
      connection.release();
    }
  })().catch((error) => {
    initialization = undefined;
    throw error;
  });
  await initialization;
  return database;
}

export function db() {
  return {
    prepare(sql) {
      async function execute(parameters) {
        const connection = context.getStore() ?? await ready();
        const [result] = await connection.execute(sql, parameters);
        return result;
      }
      return {
        async get(...parameters) { return (await execute(parameters))[0]; },
        all(...parameters) { return execute(parameters); },
        async run(...parameters) {
          const result = await execute(parameters);
          return { changes: result.affectedRows, lastInsertRowid: result.insertId };
        },
      };
    },
  };
}

export async function transaction(work) {
  const connection = await (await ready()).getConnection();
  try {
    await connection.beginTransaction();
    // Serialize related CMS, media and account mutations across server processes.
    await connection.query("SELECT id FROM app_write_lock WHERE id=1 FOR UPDATE");
    const result = await context.run(connection, work);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function closeDatabase() {
  if (pool) await pool.end();
  pool = undefined;
  initialization = undefined;
}
