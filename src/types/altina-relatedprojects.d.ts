// Make TS treat "@/components/RelatedProjects" as a proper module with both default and named exports.
declare module "@/components/RelatedProjects" {
  import * as React from "react";

  // Default export (common pattern: export default function RelatedProjects() { ... })
  const RelatedProjectsDefault: React.FC<any>;
  export default RelatedProjectsDefault;

  // Also expose a named export so `import * as RelatedMod from ...` can use RelatedMod.RelatedProjects
  export const RelatedProjects: React.FC<any>;
}
