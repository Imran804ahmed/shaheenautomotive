import { cn } from "@/lib/cn";

export function Container({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8", className)}>
      {children}
    </Tag>
  );
}
