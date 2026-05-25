import Link from "next/link";
import { SiteBrandTitle } from "@/components/site-brand-title";
import { elsewhereLinks, siteTagline } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <SiteBrandTitle />
            <p className="max-w-md text-sm text-muted-foreground">{siteTagline}</p>
          </div>
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-12">
            <nav className="flex flex-col gap-2 text-sm">
              <span className="font-medium text-foreground">Site</span>
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <Link href="/posts" className="text-muted-foreground hover:text-foreground">
                Articles
              </Link>
            </nav>
            {elsewhereLinks.length > 0 && (
              <nav className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-foreground">Elsewhere</span>
                {elsewhereLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
