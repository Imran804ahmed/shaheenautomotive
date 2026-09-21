"use client";

import { useState, Suspense } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { WarningCircle, PaperPlaneTilt } from "@phosphor-icons/react";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/cn";

const productCategories = siteConfig.productCategories;

type Status = "idle" | "submitting" | "success" | "error";

const fieldClasses =
  "w-full rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-fg placeholder:text-fg-muted/70 transition-[border-color,box-shadow] focus:border-accent focus:shadow-[0_0_0_4px_rgb(23_112_63/0.12)] focus:outline-none";

const invalidClasses = "border-red-600 focus:border-red-600 focus:shadow-[0_0_0_4px_rgb(220_38_38/0.12)]";

type Errors = Partial<Record<"name" | "company" | "email" | "category" | "description", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(name: string, value: string): string | undefined {
  const v = value.trim();
  switch (name) {
    case "name":
      return v ? undefined : "Please enter your name.";
    case "company":
      return v ? undefined : "Please enter your company.";
    case "email":
      if (!v) return "Please enter your work email.";
      return emailPattern.test(v) ? undefined : "Enter a valid email address, like you@company.com.";
    case "category":
      return v ? undefined : "Please choose a process or category.";
    case "description":
      return v ? undefined : "Please describe the part you need.";
    default:
      return undefined;
  }
}

const labelClasses = "text-sm font-medium text-fg";

function Field({
  label,
  name,
  children,
  required,
  hint,
  error,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={`rfq-${name}`} className={labelClasses}>
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`rfq-${name}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="text-xs font-medium text-red-700"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && <p className="text-xs text-fg-muted">{hint}</p>}
    </div>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Success tick that draws itself: confirms the action landed. */
function DrawnCheck() {
  const reduce = useReducedMotion();
  const draw = (delay: number) => ({
    initial: reduce ? false : { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 0.45, delay, ease: "easeOut" as const },
  });
  return (
    <svg viewBox="0 0 48 48" className="mx-auto h-12 w-12 text-accent" fill="none" aria-hidden="true">
      <motion.circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="2.5" {...draw(0)} />
      <motion.path d="M14 25l7 7 13-15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...draw(0.3)} />
    </svg>
  );
}

function RfqFormInner() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(() => {
    const fromQuery = searchParams.get("category");
    return fromQuery && productCategories.some((c) => c.slug === fromQuery) ? fromQuery : "";
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const reduce = useReducedMotion();

  function checkField(name: string, value: string) {
    const message = validateField(name, value);
    setErrors((prev) => {
      if (prev[name as keyof Errors] === message) return prev;
      const next = { ...prev };
      if (message) next[name as keyof Errors] = message;
      else delete next[name as keyof Errors];
      return next;
    });
  }

  // validate on blur; once a field shows an error, re-check as the user types so it clears promptly
  const fieldProps = (name: keyof Errors) => ({
    id: `rfq-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `rfq-${name}-error` : undefined,
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      checkField(name, e.currentTarget.value),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      if (name === "category") setCategory(e.currentTarget.value);
      if (errors[name]) checkField(name, e.currentTarget.value);
    },
  });

  const hasEndpoint = Boolean(siteConfig.rfqFormEndpoint);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const found: Errors = {};
    (["name", "company", "email", "category", "description"] as const).forEach((key) => {
      const message = validateField(key, String(data.get(key) ?? ""));
      if (message) found[key] = message;
    });
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`#rfq-${firstInvalid}`)?.focus();
      return;
    }

    if (!hasEndpoint) {
      const name = String(data.get("name") ?? "");
      const company = String(data.get("company") ?? "");
      const email = String(data.get("email") ?? "");
      const phone = String(data.get("phone") ?? "");
      const qty = String(data.get("quantity") ?? "");
      const cat = String(data.get("category") ?? "");
      const description = String(data.get("description") ?? "");
      const message = String(data.get("message") ?? "");

      const subject = `RFQ: ${cat || "New enquiry"} — ${company || name}`;
      const bodyLines = [
        `Name: ${name}`,
        `Company: ${company}`,
        `Work email: ${email}`,
        `Phone: ${phone}`,
        `Process / category: ${cat}`,
        `Estimated quantity: ${qty}`,
        "",
        "Part description:",
        description,
        "",
        "Additional message:",
        message,
        "",
        "Note: if you selected a drawing/specification file, please attach it manually to this email before sending.",
      ];
      const mailto = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
      window.location.href = mailto;
      setStatus("success");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch(siteConfig.rfqFormEndpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage(
        "We couldn't send this automatically. Please email us directly instead."
      );
    }
  }

  if (status === "success") {
    return (
      <motion.div
        role="status"
        initial={reduce ? false : { opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-sm border border-accent/30 bg-accent-soft p-8 text-center"
      >
        <DrawnCheck />
        <h3 className="mt-4 text-lg font-semibold text-fg">
          {hasEndpoint ? "Your RFQ has been sent" : "Your email client should now be open"}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          {hasEndpoint
            ? "Thank you. Our team will review your request and respond to the email address you provided."
            : `A pre-filled email to ${siteConfig.contact.email} has been opened in your default email application. Please review it, attach any drawing file, and hit send.`}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-medium text-accent underline underline-offset-4"
        >
          Submit another request
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate aria-busy={status === "submitting"}>
      {!hasEndpoint && (
        <div className="flex items-start gap-3 rounded-sm border border-border bg-bg-elevated p-4">
          <WarningCircle size={18} className="mt-0.5 shrink-0 text-fg-muted" />
          <p className="text-xs leading-relaxed text-fg-muted">
            This form opens a pre-filled email in your own email client when submitted; it does not send data to a
            server. Nothing is transmitted until you press send in your email app.
          </p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full name" name="name" required error={errors.name}>
          <input {...fieldProps("name")} type="text" autoComplete="name" className={cn(fieldClasses, errors.name && invalidClasses)} placeholder="Your name" />
        </Field>
        <Field label="Company" name="company" required error={errors.company}>
          <input {...fieldProps("company")} type="text" autoComplete="organization" className={cn(fieldClasses, errors.company && invalidClasses)} placeholder="Company name" />
        </Field>
        <Field label="Work email" name="email" required error={errors.email}>
          <input {...fieldProps("email")} type="email" autoComplete="email" className={cn(fieldClasses, errors.email && invalidClasses)} placeholder="you@company.com" />
        </Field>
        <Field label="Phone" name="phone">
          <input id="rfq-phone" name="phone" type="tel" autoComplete="tel" className={fieldClasses} placeholder="+92 ..." />
        </Field>
        <Field label="Process / category" name="category" required error={errors.category}>
          <select
            {...fieldProps("category")}
            value={category}
            className={cn(fieldClasses, "appearance-none", errors.category && invalidClasses)}
          >
            <option value="" disabled>
              Select a category
            </option>
            {productCategories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
            <option value="not-sure">Not sure / multiple processes</option>
          </select>
        </Field>
        <Field label="Estimated quantity" name="quantity">
          <input id="rfq-quantity" name="quantity" type="text" className={fieldClasses} placeholder="e.g. 5,000 units / month" />
        </Field>
      </div>

      <Field label="Part description" name="description" required error={errors.description}>
        <textarea
          {...fieldProps("description")}
          rows={4}
          className={cn(fieldClasses, errors.description && invalidClasses)}
          placeholder="Describe the part, material, dimensions and application"
        />
      </Field>

      <Field
        label="Drawing / specification"
        name="attachment"
        hint={
          hasEndpoint
            ? "PDF, image or CAD file, up to a few MB."
            : "File attachments can't be sent through this button; please attach the file manually once your email client opens."
        }
      >
        <input id="rfq-attachment" name="attachment" type="file" className={cn(fieldClasses, "cursor-pointer file:mr-3 file:rounded-full file:border-0 file:bg-bg-inverted file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-fg-inverted")} />
      </Field>

      <Field label="Additional message" name="message">
        <textarea id="rfq-message" name="message" rows={3} className={fieldClasses} placeholder="Anything else we should know" />
      </Field>

      {status === "error" && (
        <p role="alert" className="text-sm text-fg">
          {errorMessage} Email us at{" "}
          <a href={`mailto:${siteConfig.contact.email}`} className="text-accent underline underline-offset-4">
            {siteConfig.contact.email}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-accent bg-accent px-7 py-3.5 text-sm font-semibold text-accent-fg shadow-[0_10px_24px_-10px_rgb(23_112_63/0.7)] transition-[transform,background-color,opacity] hover:-translate-y-0.5 hover:bg-accent-strong active:translate-y-0 active:scale-[0.98] disabled:translate-y-0 disabled:opacity-70"
      >
        {status === "submitting" ? <Spinner /> : <PaperPlaneTilt size={16} weight="bold" />}
        {status === "submitting" ? "Sending..." : hasEndpoint ? "Send RFQ" : "Open email to send this RFQ"}
      </button>
    </form>
  );
}

export function RfqForm() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-sm bg-bg-elevated" />}>
      <RfqFormInner />
    </Suspense>
  );
}
