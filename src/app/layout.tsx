import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Spline_Sans_Mono } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/components/LocaleProvider";
import { SkipLink } from "@/components/SkipLink";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n";

/** Display + body: one family across weights. Preload display face only. */
const display = Schibsted_Grotesk({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
  display: "swap",
  preload: true,
});

const body = Schibsted_Grotesk({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
});

const mono = Spline_Sans_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
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
  viewportFit: "cover",
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
      className={`${display.variable} ${body.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-dvh overflow-x-hidden bg-[var(--ink-900)] font-[family-name:var(--font-body)] text-[var(--cam-paper)] antialiased">
        <LocaleProvider locale={locale}>
          <SkipLink label={t.a11y.skipToContent} />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
