import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Blog CMS";

export const metadata: Metadata = {
  title: siteName,
  description: "Microservice blog CMS — portfolio project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="blog-cms-theme"
          disableTransitionOnChange
        >
          <SiteHeader />
          <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
