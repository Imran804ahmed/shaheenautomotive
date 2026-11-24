type Parameter = string | number | null | Uint8Array;

type Statement = {
  get(...parameters: Parameter[]): Promise<Record<string, unknown> | undefined>;
  all(...parameters: Parameter[]): Promise<Record<string, unknown>[]>;
  run(...parameters: Parameter[]): Promise<{ changes: number; lastInsertRowid: number }>;
};

export function db(): { prepare(query: string): Statement };
export function transaction<T>(work: () => Promise<T>): Promise<T>;
export function closeDatabase(): Promise<void>;
