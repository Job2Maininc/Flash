type Props = {
  size?: number;
  className?: string;
  /** Glow intensity — stronger on dark backgrounds */
  glow?: "soft" | "strong";
};

export function FlashLogo({ size = 32, className = "", glow = "soft" }: Props) {
  const glowOpacity = glow === "strong" ? 0.85 : 0.45;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <filter
          id="flash-neon-glow"
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
        >
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient
          id="flash-neon-fill"
          x1="24"
          y1="4"
          x2="24"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f4ff7a" />
          <stop offset="1" stopColor="#e8ff4a" />
        </linearGradient>
      </defs>

      {/* Outer glow layer */}
      <path
        d="M27.5 3.5L11.5 26.5H22L17.5 44.5L36.5 21.5H26L31.5 3.5Z"
        fill="#e8ff4a"
        opacity={glowOpacity}
        filter="url(#flash-neon-glow)"
      />

      {/* Core bolt */}
      <path
        d="M27.5 3.5L11.5 26.5H22L17.5 44.5L36.5 21.5H26L31.5 3.5Z"
        fill="url(#flash-neon-fill)"
        filter="url(#flash-neon-glow)"
      />
    </svg>
  );
}
