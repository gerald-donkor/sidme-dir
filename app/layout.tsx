import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { SiteHeader } from "@/components/chrome/site-header";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sidme Directory",
    template: "%s · Sidme Directory",
  },
  description:
    "Browse the people in the directory, search by name, and open a profile.",
};

/**
 * Matches the two `--background` values in app/globals.css, so the browser
 * chrome does not sit at a different colour to the page.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "oklch(0.99 0.004 265)" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.175 0.016 265)" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a className="skip-link" href="#content">
            Skip to content
          </a>
          <SiteHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
