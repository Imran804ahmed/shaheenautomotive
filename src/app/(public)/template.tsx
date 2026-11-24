/** Re-mounts on every navigation, giving each page a short, calm fade-up entrance (CSS only). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
