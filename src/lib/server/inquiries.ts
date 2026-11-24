export function inquiryFilter({ q, state }: { q?: string; state?: string }) {
  const term = typeof q === "string" ? q.trim().slice(0, 100) : "";
  const status = typeof state === "string" && ["unread", "read", "closed"].includes(state) ? state : "";
  const where = "WHERE (?='' OR status=?) AND (?='' OR instr(lower(CONCAT_WS(' ',name,company,email,description,message)),lower(?))>0)";
  return { term, status, where, parameters: [status, status, term, term] };
}

export function csvCell(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);
  const safe = /^[\s\u0000-\u001f]*[=+@-]|^[\t\r\n]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}
