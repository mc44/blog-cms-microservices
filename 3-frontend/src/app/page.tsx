import Link from "next/link";
import { Suspense } from "react";
import { RecentPosts } from "@/components/posts/recent-posts";
import { PostGridSkeleton } from "@/components/skeletons/post-grid-skeleton";
import { SiteBrandTitle } from "@/components/site-brand-title";
import { elsewhereLinks, homeTopics, siteTagline } from "@/lib/site";

export default function HomePage() {
  return (
    <div className="space-y-14">
      <section className="mx-auto max-w-3xl space-y-6 text-center">
        <div className="flex justify-center">
          <SiteBrandTitle size="lg" />
        </div>
        <p className="text-lg leading-relaxed text-muted-foreground">{siteTagline}</p>
        {homeTopics.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {homeTopics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
        {elsewhereLinks.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Also building{" "}
            {elsewhereLinks.map((link, i) => (
              <span key={link.href}>
                {i > 0 && (i === elsewhereLinks.length - 1 ? " and " : ", ")}
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  {link.label}
                </a>
              </span>
            ))}
            .
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/posts"
            className="rounded-2xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow hover:opacity-90"
          >
            Browse all articles
          </Link>
          <Link
            href="/login"
            className="rounded-2xl border border-border px-6 py-2.5 text-sm font-medium hover:bg-accent"
          >
            Sign in to write
          </Link>
        </div>
      </section>

      <section className="space-y-8">
        <Suspense
          fallback={
            <>
              <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
                <h2 className="text-2xl font-semibold">Recent articles</h2>
              </div>
              <PostGridSkeleton count={6} columns="home" />
            </>
          }
        >
          <RecentPosts />
        </Suspense>
      </section>
    </div>
  );
}
