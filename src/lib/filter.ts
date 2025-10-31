export type Filter = {
  city?: string;
  location?: string;
  type?: string;
};

export function matchProject(p: any, f: Filter) {
  const cityOk = !f.city || (p.city || "").toLowerCase() === f.city.toLowerCase();
  const typeOk = !f.type || (p.type || "").toLowerCase() === f.type.toLowerCase();

  // For location, allow contains to be user-friendly
  const locOk =
    !f.location ||
    (p.location || "").toLowerCase().includes((f.location || "").toLowerCase());

  return cityOk && locOk && typeOk;
}

export function filterProjects(items: any[], f: Filter) {
  if (!f.city && !f.location && !f.type) return items;
  return items.filter((p) => matchProject(p, f));
}
