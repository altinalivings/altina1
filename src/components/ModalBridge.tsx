// src/components/ModalBridge.tsx
"use client";
export default function ModalBridge() {
  return (
    <>
      <button type=\"button\"
        id="lead-dialog"
        onClick={() =>
          document.querySelector<HTMLButtonElement>("#lead-form-trigger")?.click()
        }
        className="hidden"
        aria-hidden
        tabIndex={-1}
      />
      <button type=\"button\"
        id="visit-dialog"
        onClick={() =>
          document.querySelector<HTMLButtonElement>("#visit-form-trigger")?.click()
        }
        className="hidden"
        aria-hidden
        tabIndex={-1}
      />
    </>
  );
}
