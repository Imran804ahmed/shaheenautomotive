import { db } from "@/lib/server/database.mjs";
import { emailPattern, rateLimit } from "@/lib/server/auth";
import { getContent } from "@/lib/server/content";

const attachmentLimit = 5 * 1024 * 1024;
const maxBody = attachmentLimit + 32 * 1024;
const fields = { name: 120, company: 160, email: 254, phone: 80, category: 100, quantity: 100, description: 6000, message: 6000 } as const;
const required = ["name", "company", "email", "category", "description"] as const;

function problem(error: string, status = 400) {
  return Response.json({ error }, { status });
}

function validateAttachment(name: string, bytes: Buffer) {
  const extension = name.split(".").at(-1)?.toLowerCase();
  const header = bytes.subarray(0, 24).toString("ascii");
  switch (extension) {
    case "pdf": return header.startsWith("%PDF-");
    case "png": return bytes.subarray(0, 8).toString("hex") === "89504e470d0a1a0a";
    case "jpg":
    case "jpeg": return bytes.subarray(0, 3).toString("hex") === "ffd8ff";
    case "stp":
    case "step": return header.trimStart().startsWith("ISO-10303-21;");
    case "dwg": return /^AC10\d\d/.test(header);
    default: return false;
  }
}

export async function POST(request: Request) {
  const expectedOrigin = process.env.APP_ORIGIN || new URL(request.url).origin;
  if (request.headers.get("origin") !== expectedOrigin) return problem("Invalid request origin.", 403);
  const length = Number(request.headers.get("content-length"));
  if (!Number.isSafeInteger(length) || length < 1 || length > maxBody) return problem("The form exceeds the upload limit.", 413);
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data;")) return problem("Invalid form format.", 415);
  if (!(await rateLimit("rfq:global", 150, 3600))) return problem("Too many requests. Please try again later.", 429);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return problem("We couldn’t read the form.");
  }
  const values = Object.fromEntries(Object.entries(fields).map(([key, limit]) => {
    const field = form.get(key);
    const text = typeof field === "string" ? field.trim() : "";
    return [key, text.length <= limit ? text : null];
  }));
  if (Object.values(values).includes(null) || required.some((key) => !values[key]) || !emailPattern.test(values.email || "")) {
    return problem("Check the required fields and their lengths.");
  }
  const { productCategories } = await getContent();
  if (values.category !== "not-sure" && !productCategories.some(({ slug, visible }) => visible && slug === values.category)) {
    return problem("Choose an available category.");
  }

  const file = form.get("attachment");
  let attachment: Buffer | null = null;
  let filename: string | null = null;
  if (file instanceof File && file.size) {
    if (file.size > attachmentLimit) return problem("The attachment exceeds 5 MB.", 413);
    filename = file.name.replace(/[^a-z0-9 ._-]/gi, "_").slice(-120);
    attachment = Buffer.from(await file.arrayBuffer());
    if (!validateAttachment(filename, attachment)) return problem("The attachment must be a PDF, PNG, JPEG, STEP or DWG.");
  }
  await db().prepare(`
    INSERT INTO inquiries(name,company,email,phone,category,quantity,description,message,attachment_name,attachment)
    VALUES (?,?,?,?,?,?,?,?,?,?)`).run(...Object.keys(fields).map((key) => values[key]), filename, attachment);
  return Response.json({ received: true }, { status: 201 });
}
