"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { login, requestReset, resetPassword } from "./auth-actions";

export function AuthForm({ mode, token = "" }: { mode: "login" | "forgot" | "reset"; token?: string }) {
  const [message, action, pending] = useActionState({ login, forgot: requestReset, reset: resetPassword }[mode], "");
  const [show, setShow] = useState(false);
  return (
    <form action={action} className="admin-form">
      {mode !== "reset" && <label>Email<input name="email" type="email" maxLength={254} autoComplete="username" required /></label>}
      {mode === "reset" && <input type="hidden" name="token" value={token} />}
      {mode !== "forgot" && (
        <>
          <label>{mode === "reset" ? "New password" : "Password"}
            <input name="password" type={show ? "text" : "password"} minLength={6} maxLength={128} autoComplete={mode === "login" ? "current-password" : "new-password"} required />
          </label>
          {mode === "reset" && <label>Confirm password<input name="confirm" type={show ? "text" : "password"} minLength={6} maxLength={128} autoComplete="new-password" required /></label>}
          <label className="admin-check"><input type="checkbox" checked={show} onChange={(event) => setShow(event.target.checked)} /> Show password</label>
        </>
      )}
      {mode === "login" && (
        <div className="admin-auth-options">
          <label className="admin-check"><input name="remember" type="checkbox" /> Remember me</label>
          <Link href="/admin/forgot">Forgot password?</Link>
        </div>
      )}
      {message && <p role="status" className="admin-notice">{message}</p>}
      <button disabled={pending}>{pending ? "Please wait…" : { login: "Sign in", forgot: "Send reset link", reset: "Reset password" }[mode]}</button>
      {mode !== "login" && <Link href="/admin/login">Back to sign in</Link>}
    </form>
  );
}
