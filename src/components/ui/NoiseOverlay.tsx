import { cn } from "@/lib/cn";

type Props = {
  className?: string;
};

/** Fixed film-grain overlay — presentational only. */
export function NoiseOverlay({ className }: Props) {
  return (
    <div
      aria-hidden
      className={cn("cam-noise pointer-events-none fixed inset-0 z-[70]", className)}
    />
  );
}
