"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ProjectPicker = dynamic(() => import("@/components/ProjectPicker"), { ssr: false });
const UnifiedLeadDialog = dynamic(() => import("@/components/UnifiedLeadDialog"), { ssr: false });

type Mode = "callback" | "brochure" | "visit";
type Detail = { mode: Mode; projectId?: string; projectName?: string };

export default function LeadBus() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [project, setProject] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    function handle(detail: Detail) {
      if (!detail?.mode) return;
      setMode(detail.mode);

      if (detail.projectId && detail.projectName) {
        setProject({ id: detail.projectId, name: detail.projectName });
        return;
      }
      if (detail.mode === "callback") {
        setProject({ id: "ALL", name: "General Enquiry" });
      } else {
        setProject(null);
      }
    }

    const onLeadOpen = (e: Event) => handle((e as CustomEvent<Detail>).detail);
    const onOpenLeadDialog = (e: Event) => handle((e as CustomEvent<Detail>).detail);

    window.addEventListener("lead:open", onLeadOpen as EventListener);
    // Back-compat with earlier helpers if present
    window.addEventListener("open-lead-dialog", onOpenLeadDialog as EventListener);
    return () => {
      window.removeEventListener("lead:open", onLeadOpen as EventListener);
      window.removeEventListener("open-lead-dialog", onOpenLeadDialog as EventListener);
    };
  }, []);

  function close() {
    setMode(null);
    setProject(null);
  }

  if (!mode) return null;

  return (
    <>
      {!project && (mode === "brochure" || mode === "visit") && (
        <ProjectPicker open={true} onClose={() => setMode(null)} onPick={(p) => setProject(p)} />
      )}
      {project && (
        <UnifiedLeadDialog
          open={true}
          onClose={close}
          mode={mode}
          projectId={project.id}
          projectName={project.name}
        />
      )}
    </>
  );
}
