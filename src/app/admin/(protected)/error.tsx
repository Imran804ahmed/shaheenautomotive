"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <section className="admin-card"><h1>Workspace unavailable</h1><p>Something went wrong while loading this page.</p><button onClick={reset}>Try again</button></section>;
}
