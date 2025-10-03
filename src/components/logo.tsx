interface LogoProps {
  isCollapsed?: boolean;
}

export function Logo({ isCollapsed }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-sm">T</span>
      </div>
      {!isCollapsed && (
        <span className="font-semibold text-lg">Twilight Hub</span>
      )}
    </div>
  );
}