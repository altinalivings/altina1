// Loosen TypeScript's inferred type for the developers JSON so casts don't fail.
declare module "@/data/developers.json" {
  const value: any; // keep runtime untouched; avoid strict tuple inference
  export default value;
}
