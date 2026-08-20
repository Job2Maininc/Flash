import Link from "next/link";

type Props = {
  label: string;
};

/** Visually hidden until focused — jumps to `#main`. */
export function SkipLink({ label }: Props) {
  return (
    <Link href="#main" className="cam-skip-link">
      {label}
    </Link>
  );
}
