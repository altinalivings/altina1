'use client'
import { useCallback } from 'react'

export default function ProjectCTARail({ project }: { project: any }) {
  const ctx = {
    projectId: project?.id || project?.projectId || "",
    projectName: project?.name || project?.projectName || "",
  };

  const openLead = useCallback((mode: 'callback' | 'visit' | 'brochure') => {
    window.dispatchEvent(new CustomEvent('lead:open', { detail: { mode, ...ctx } }));
  }, [ctx.projectId, ctx.projectName]);

  return (
    <aside className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
      <button onClick={() => openLead('visit')} className="btn btn-gold">Organize a Visit</button>
		  {/*<button onClick={() => openLead('callback')} className="btn btn-emerald">Request a Call</button>*/}
	  <button type="button" className="..." onClick={()=>dispatchLead('callback', ctx)}>

      {project?.brochure && (
        <button onClick={() => openLead('brochure')} className="btn btn-gold">Download Brochure</button>
      )}
    </aside>
  )
}
