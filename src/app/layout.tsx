import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  DM_Sans,
  Fraunces,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/components/LocaleProvider";
import { SkipLink } from "@/components/SkipLink";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
});

const cameraDisplay = Bricolage_Grotesque({
  variable: "--font-camera-display",
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
  display: "swap",
  preload: true,
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: {
      default: t.meta.titleDefault,
      template: "%s · Flash",
    },
    description: t.meta.description,
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0E0B12",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <html
      lang={locale}
      className={`${display.variable} ${body.variable} ${cameraDisplay.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-dvh overflow-x-hidden antialiased">
        <LocaleProvider locale={locale}>
          <SkipLink label={t.a11y.skipToContent} />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
