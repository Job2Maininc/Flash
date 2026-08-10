type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "h-5 w-5 border",
  md: "h-10 w-10 border-2",
  lg: "h-12 w-12 border-2",
};

export function Spinner({ size = "md", className = "" }: Props) {
  return (
    <div
      className={`animate-spin rounded-full border-white/20 border-t-[var(--accent)] ${sizes[size]} ${className}`}
      role="status"
      aria-label="Chargement"
    />
  );
}
