import { siteByline, siteName } from "@/lib/site";

interface SiteBrandTitleProps {
  size?: "sm" | "lg";
  className?: string;
}

export function SiteBrandTitle({ size = "sm", className = "" }: SiteBrandTitleProps) {
  const titleClass =
    size === "lg"
      ? "text-4xl font-bold tracking-tight sm:text-5xl"
      : "text-xl font-semibold tracking-tight";

  return (
    <span className={className}>
      <span className={titleClass}>{siteName}</span>
      {siteByline ? (
        <>
          {" "}
          <span className="text-sm font-normal text-muted-foreground">{siteByline}</span>
        </>
      ) : null}
    </span>
  );
}
