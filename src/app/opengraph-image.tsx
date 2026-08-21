import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Flash — live video dating";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#0e0b12",
          padding: "72px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 36,
          }}
        >
          <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
            <path
              d="M27.5 3.5L11.5 26.5H22L17.5 44.5L36.5 21.5H26L31.5 3.5Z"
              fill="#ff4326"
            />
          </svg>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#f3f1ee",
            }}
          >
            Flash
          </div>
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "#f3f1ee",
            maxWidth: 820,
            lineHeight: 1.15,
          }}
        >
          Live video dating. Camera on. Match when it clicks.
        </div>
      </div>
    ),
    { ...size },
  );
}
