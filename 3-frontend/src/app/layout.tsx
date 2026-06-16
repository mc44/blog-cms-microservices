import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { UnsavedChangesProvider } from "@/context/unsaved-changes-context";
import { siteDescription, siteName } from "@/lib/site";
import "./globals.css";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: siteName,
  description: siteDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${leagueSpartan.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="blog-cms-theme"
          disableTransitionOnChange
        >
          <UnsavedChangesProvider>
            <SiteHeader />
            <main className="mx-auto min-h-[calc(100vh-12rem)] max-w-6xl px-4 py-10">
              {children}
            </main>
            <SiteFooter />
          </UnsavedChangesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
