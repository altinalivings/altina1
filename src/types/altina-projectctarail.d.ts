// Accept both legacy and new props for ProjectCTARail to avoid TS compile breaks
declare module "@/components/ProjectCTARail" {
  import * as React from "react";

  export interface ProjectCTARailPropsLegacy {
    projectId?: string | null;
    projectName?: string | null;
  }

  export interface ProjectCTARailPropsNew {
    project: any;
  }

  export type ProjectCTARailProps = ProjectCTARailPropsLegacy | ProjectCTARailPropsNew;

  const ProjectCTARail: React.FC<ProjectCTARailProps>;
  export default ProjectCTARail;
}
