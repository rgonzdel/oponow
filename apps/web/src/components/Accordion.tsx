import { useId, useState, type ReactNode } from "react";

export function Accordion({ children }: { children: ReactNode }) {
  return (
    <div className="divide-y divide-ink-divider rounded-lg border border-ink-divider bg-ink-surface px-5">
      {children}
    </div>
  );
}

interface AccordionItemProps {
  title: string;
  meta?: string;
  icon: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function AccordionItem({
  title,
  meta,
  icon,
  defaultOpen = false,
  children,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full items-center gap-3 py-4 text-left"
      >
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-md border border-ink-divider text-accent">
          {icon}
        </span>
        <span className="flex-1">
          <span className="block text-sm font-medium text-ink-text">
            {title}
          </span>
          {meta && (
            <span className="block text-xs text-neutral-500">{meta}</span>
          )}
        </span>
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`flex-none text-neutral-500 motion-safe:transition-transform motion-safe:duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        id={contentId}
        className="grid motion-safe:transition-[grid-template-rows] motion-safe:duration-200 motion-safe:ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pb-5 pl-12 pr-1 text-sm text-neutral-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
