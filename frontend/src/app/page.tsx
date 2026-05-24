import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Blog CMS</h1>
        <p className="text-muted-foreground leading-relaxed">
          A microservice blog platform built for learning and portfolio demos: Spring Cloud
          Gateway, auth-service (sibling repo), blog and media services, audit trail, MongoDB,
          Cloudinary, and optional Kafka-compatible events via Redpanda.
        </p>
      </section>
      <section className="flex flex-wrap gap-3">
        <Link
          href="/posts"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Read published posts
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Sign in to edit
        </Link>
      </section>
      <section className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="mb-2 font-medium text-foreground">Stack</h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Auth: separate auth-service repository on the VPS</li>
          <li>Content: blog-service + media-service (Cloudinary)</li>
          <li>Audit: audit-service (HTTP V1, Redpanda optional)</li>
        </ul>
      </section>
    </div>
  );
}
