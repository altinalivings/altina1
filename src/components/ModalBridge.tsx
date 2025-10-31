// src/components/ModalBridge.tsx
"use client";

/**
 * Minimal “bridge” so other code can trigger hidden buttons via querySelector.
 */
export default function ModalBridge() {
  return (
    <>
      {/* Hidden click proxies */}
      <button
        type="button"
        id="lead-dialog"
        className="hidden"
        onClick={() =>
          document
            .querySelector<HTMLButtonElement>("#lead-form-trigger")
            ?.click()
        }
      />
      <button
        type="button"
        id="brochure-dialog"
        className="hidden"
        onClick={() =>
          document
            .querySelector<HTMLButtonElement>("#brochure-form-trigger")
            ?.click()
        }
      />
    </>
  );
}
