// src/components/AnyCTA.tsx
"use client";

export default function AnyCTA({
  projectId,
  projectName,
  style = "golden-btn px-3 py-2 rounded-xl",
  label = "Request Callback",
  mode = "callback",
}: {
  projectId?: string;
  projectName?: string;
  style?: string;
  label?: string;
  mode?: "callback" | "brochure" | "visit";
}) {
  function fire() {
    window.dispatchEvent(
      new CustomEvent("lead:open", { detail: { mode, projectId, projectName } })
    );
  }
  return (
    <button className={style} onClick={fire}>
      {label}
    </button>
  );
}
