import { cn } from "@/lib/utils";

export function Logo({ className, isCollapsed }: { className?: string, isCollapsed?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-primary"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="hsl(var(--primary))" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
      {!isCollapsed && <span className="text-xl font-bold">Twilight Hub</span>}
    </div>
  );
}
