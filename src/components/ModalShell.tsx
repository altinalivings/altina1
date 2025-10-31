// src/components/ModalShell.tsx
"use client";

import { ReactNode, useEffect, useRef, useId, KeyboardEvent } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
  /** Click on backdrop closes modal (default true) */
  closeOnBackdrop?: boolean;
  /** Extra classes for the shell */
  className?: string;
};

export default function ModalShell({
  title,
  subtitle,
  children,
  footer,
  onClose,
  closeOnBackdrop = true,
  className = "",
}: Props) {
  const labelledBy = useId();
  const describedBy = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus trap + initial focus
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // Focus first focusable in the panel; fallback to panel
    const focusable = node.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    (focusable || node).focus();

    function handleFocusTrap(e: FocusEvent) {
      if (!node.contains(e.target as Node)) {
        // pull focus back in
        (focusable || node).focus();
      }
    }
    document.addEventListener("focusin", handleFocusTrap);
    return () => document.removeEventListener("focusin", handleFocusTrap);
  }, []);

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape" && onClose) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={onKeyDown}
      aria-hidden={false}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={closeOnBackdrop && onClose ? () => onClose() : undefined}
      />

      {/* Panel */}
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={subtitle ? describedBy : undefined}
        tabIndex={-1}
        className={`relative golden-frame glow modal-surface p-6 sm:p-8 max-w-lg w-full mx-auto outline-none ${className}`}
      >
        {/* Close button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 rounded-md border border-white/15 px-2 py-1 text-sm text-neutral-200 hover:border-white/35"
          >
            ×
          </button>
        )}

        <div className="mb-4">
          <h3 id={labelledBy} className="text-xl font-semibold tracking-tight">
            {title}
          </h3>
          {subtitle ? (
            <p id={describedBy} className="text-sm/6 text-neutral-300 mt-1">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="golden-divider mb-4" />
        <div className="space-y-4">{children}</div>

        {footer ? (
          <>
            <div className="golden-divider my-6" />
            {footer}
          </>
        ) : null}
      </div>
    </div>
  );
}