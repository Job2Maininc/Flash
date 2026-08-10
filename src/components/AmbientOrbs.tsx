type Props = {
  variant?: "dark" | "warm";
  className?: string;
};

export function AmbientOrbs({ variant = "dark", className = "" }: Props) {
  const accent =
    variant === "dark"
      ? "bg-[var(--accent)]/12"
      : "bg-[#ffe08a]/35";
  const warm =
    variant === "dark" ? "bg-[#ffb4a2]/10" : "bg-[#ffb4a2]/25";

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div
        className={`absolute -left-1/4 top-1/4 h-[55%] w-[55%] rounded-full blur-3xl flash-float-slow ${accent}`}
      />
      <div
        className={`absolute -right-1/4 bottom-0 h-[45%] w-[45%] rounded-full blur-3xl flash-float-delayed ${warm}`}
      />
      <div
        className={`absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full blur-2xl flash-pulse-ring ${accent}`}
      />
    </div>
  );
}
