import { requireAdministrator } from "@/lib/server/auth";
import { changePassword, updateProfile } from "../../account-actions";
import { FeedbackForm } from "../../feedback-form";

export default async function Account({ searchParams }: { searchParams: Promise<{ updated?: string }> }) {
  const admin = await requireAdministrator();
  const updated = (await searchParams).updated === "1";
  return (
    <>
      <div className="admin-heading"><div><p className="admin-kicker">Administration / My account</p><h1>My account</h1></div></div>
      {updated && <p className="admin-notice" role="status">Password updated. Other sessions have been signed out.</p>}
      <div className="admin-columns">
        <section className="admin-card"><h2>Profile</h2>
          <FeedbackForm submit={updateProfile} label="Update profile">
            <label>Name<input name="name" defaultValue={admin.name} maxLength={120} autoComplete="name" required /></label>
            <label>Email<input name="email" type="email" defaultValue={admin.email} maxLength={254} autoComplete="email" required /></label>
            <label>Current password<input name="current" type="password" autoComplete="current-password" maxLength={128} required /></label>
          </FeedbackForm>
        </section>
        <section className="admin-card"><h2>Password</h2>
          <FeedbackForm submit={changePassword} label="Change password">
            <label>Current password<input name="current" type="password" autoComplete="current-password" maxLength={128} required /></label>
            <label>New password<input name="password" type="password" autoComplete="new-password" minLength={6} maxLength={128} required /></label>
            <label>Confirm password<input name="confirm" type="password" autoComplete="new-password" minLength={6} maxLength={128} required /></label>
          </FeedbackForm>
        </section>
      </div>
    </>
  );
}
