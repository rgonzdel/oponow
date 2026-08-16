import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

export function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-neutral-400">{label}</span>
      {children}
      {error && (
        <span className="mt-1.5 block text-xs text-red-400">{error}</span>
      )}
    </label>
  );
}

export const TextInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function TextInput(props, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className="w-full rounded-md border border-ink-divider bg-ink-surface px-3 py-2 text-sm text-ink-text placeholder-neutral-600 outline-none transition-colors focus:border-accent"
    />
  );
});
