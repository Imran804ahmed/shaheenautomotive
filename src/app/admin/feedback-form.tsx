"use client";

import { useActionState } from "react";

export function FeedbackForm({ submit, label, confirmation, children }: {
  submit: (previous: string, form: FormData) => Promise<string>;
  label: string;
  confirmation?: string;
  children?: React.ReactNode;
}) {
  const [message, action, pending] = useActionState(submit, "");
  return (
    <form action={action} className="admin-form" onSubmit={(event) => {
      if (confirmation && !window.confirm(confirmation)) event.preventDefault();
    }}>
      {children}
      {message && <p role="status" className="admin-notice">{message}</p>}
      <button disabled={pending}>{pending ? "Saving…" : label}</button>
    </form>
  );
}
