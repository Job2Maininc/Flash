import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Flash — dating en vidéo live",
    template: "%s · Flash",
  },
  description:
    "Site de rencontres en appel vidéo continu. Choisis ton sexe et qui tu cherches, swipe pour matcher, rappelle tes coups de cœur.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1a1410",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-dvh overflow-x-hidden antialiased">{children}</body>
    </html>
  );
}
