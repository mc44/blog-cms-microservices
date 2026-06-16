"use client";

import { useRef, useState } from "react";
import { MarkdownContent } from "@/components/markdown-content";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

type EditorTab = "write" | "preview";

const TOOLBAR_ITEMS: { label: string; snippet: string; selectOffset?: number }[] = [
  { label: "H2", snippet: "## ", selectOffset: 0 },
  { label: "Bold", snippet: "**bold**", selectOffset: 2 },
  { label: "Italic", snippet: "*italic*", selectOffset: 1 },
  { label: "Quote", snippet: "> ", selectOffset: 0 },
  { label: "List", snippet: "- ", selectOffset: 0 },
  { label: "Code", snippet: "```\n\n```", selectOffset: 4 },
];

function insertAtCursor(
  textarea: HTMLTextAreaElement,
  current: string,
  snippet: string,
  selectOffset?: number
): { next: string; cursor: number } {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const next = current.slice(0, start) + snippet + current.slice(end);
  const cursor =
    selectOffset !== undefined ? start + selectOffset : start + snippet.length;
  return { next, cursor };
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [tab, setTab] = useState<EditorTab>("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function applySnippet(snippet: string, selectOffset?: number) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { next, cursor } = insertAtCursor(textarea, value, snippet, selectOffset);
    onChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-md border border-border p-0.5 text-sm">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={`rounded px-3 py-1 ${tab === "write" ? "bg-muted font-medium" : "text-muted-foreground"}`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`rounded px-3 py-1 ${tab === "preview" ? "bg-muted font-medium" : "text-muted-foreground"}`}
          >
            Preview
          </button>
        </div>
        {tab === "write" &&
          TOOLBAR_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => applySnippet(item.snippet, item.selectOffset)}
              className="rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </button>
          ))}
      </div>
      {tab === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={16}
          className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm leading-relaxed"
          placeholder="Write in Markdown — use ## for headings, ``` for code blocks, > for quotes…"
          required
        />
      ) : (
        <div className="min-h-[20rem] rounded-md border border-border bg-muted/30 px-4 py-3">
          {value.trim() ? (
            <MarkdownContent content={value} />
          ) : (
            <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
