// src/components/SearchBar.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchBar({ placeholder = "Search projects, locations, developers..." }: { placeholder?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState("");

  useEffect(() => {
    setQ(params.get("q") || "");
  }, [params]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams(Array.from(params.entries()));
    if (q) sp.set("q", q);
    else sp.delete("q");
    router.push(`/projects?${sp.toString()}`);
  }

  return (
    <form onSubmit={submit} className="flex w-full items-center gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-lg border border-white/20 bg-transparent px-3 py-2 outline-none focus:border-white/40"
      />
      <button className="golden-btn px-4">Search</button>
    </form>
  );
}
