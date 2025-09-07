import projects from "@/data/projects.json";

/** Get a project by slug id */
export function getProjectById(id) {
  return projects.find((p) => String(p.id) === String(id));
}

/** Optional: get by internal projectId */
export function getProjectByProjectId(projectId) {
  return projects.find((p) => String(p.projectId) === String(projectId));
}

/** Format priceNumeric (Lakhs) → “₹ x.x Cr onwards” */
export function formatCr(priceNumeric) {
  if (priceNumeric == null) return null;
  const cr = (Number(priceNumeric) / 100).toFixed(1);
  return `₹ ${cr} Cr* Onwards`;
}
