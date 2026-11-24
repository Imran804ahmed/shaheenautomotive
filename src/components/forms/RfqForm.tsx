"use client";

import { useState, Suspense } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

type RfqProps = { email: string; productCategories: { slug: string; label: string }[] };

type Status = "idle" | "submitting" | "success" | "error";

const fieldClasses =
  "min-h-12 w-full min-w-0 rounded-2xl border border-border bg-bg px-4 py-3 text-base text-fg placeholder:text-fg-muted/70 sm:text-sm transition-[border-color,box-shadow] focus:border-accent focus:shadow-[0_0_0_4px_rgb(23_112_63/0.12)] focus:outline-none";

const invalidClasses = "border-red-600 focus:border-red-600 focus:shadow-[0_0_0_4px_rgb(220_38_38/0.12)]";

// native arrow is removed for consistent styling, so draw a caret in its place
const selectClasses =
  "appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2016%2016%27%20fill=%27none%27%20stroke=%27%234d5a53%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3E%3Cpath%20d=%27m4%206%204%204%204-4%27/%3E%3C/svg%3E')] bg-[length:1rem] bg-[position:right_1rem_center] bg-no-repeat pr-11";

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

function RfqFormInner({ email, productCategories }: RfqProps) {
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

    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch("/api/inquiries/", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw new Error(result.error || "We couldn’t send this automatically.");
      }
      setStatus("success");
      form.reset();
      setCategory("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Please try again.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        role="status"
        initial={reduce ? false : { opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-sm border border-accent/30 bg-accent-soft p-6 text-center sm:p-8"
      >
        <DrawnCheck />
        <h3 className="mt-4 text-lg font-semibold text-fg">
          Your RFQ has been sent
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          Thank you. Our team will review your request and respond to the email address you provided.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-accent underline underline-offset-4"
        >
          Submit another request
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate aria-busy={status === "submitting"}>
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
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
            className={cn(fieldClasses, selectClasses, errors.category && invalidClasses)}
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
        hint="PDF, PNG, JPEG, STEP or DWG, up to 5 MB."
      >
        <input id="rfq-attachment" name="attachment" type="file" accept=".pdf,.png,.jpg,.jpeg,.step,.stp,.dwg" className={cn(fieldClasses, "cursor-pointer file:mr-3 file:rounded-full file:border-0 file:bg-bg-inverted file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-fg-inverted")} />
      </Field>

      <Field label="Additional message" name="message">
        <textarea id="rfq-message" name="message" rows={3} className={fieldClasses} placeholder="Anything else we should know" />
      </Field>

      {status === "error" && (
        <p role="alert" className="text-sm text-fg">
          {errorMessage} Email us at{" "}
          <a href={`mailto:${email}`} className="text-accent underline underline-offset-4">
            {email}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-accent bg-accent px-7 py-3.5 text-sm font-semibold sm:w-auto text-accent-fg shadow-[0_10px_24px_-10px_rgb(23_112_63/0.7)] transition-[transform,background-color,opacity] hover:-translate-y-0.5 hover:bg-accent-strong active:translate-y-0 active:scale-[0.98] disabled:translate-y-0 disabled:opacity-70"
      >
        {status === "submitting" ? <Spinner /> : <PaperPlaneTilt size={16} weight="bold" />}
        {status === "submitting" ? "Sending..." : "Send RFQ"}
      </button>
    </form>
  );
}

export function RfqForm(props: RfqProps) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-sm bg-bg-elevated" />}>
      <RfqFormInner {...props} />
    </Suspense>
  );
}
