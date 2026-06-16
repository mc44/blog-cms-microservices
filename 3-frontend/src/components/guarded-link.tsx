"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { useOptionalUnsavedChanges } from "@/context/unsaved-changes-context";

interface GuardedLinkProps extends Omit<ComponentProps<typeof Link>, "onClick"> {
  children: ReactNode;
}

export function GuardedLink({ href, children, ...props }: GuardedLinkProps) {
  const router = useRouter();
  const unsaved = useOptionalUnsavedChanges();

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (!unsaved?.isDirty) return;
    e.preventDefault();
    if (unsaved.confirmIfDirty()) {
      unsaved.setIsDirty(false);
      const target = typeof href === "string" ? href : href.toString();
      router.push(target);
    }
  }

  return (
    <Link href={href} onClick={onClick} {...props}>
      {children}
    </Link>
  );
}
