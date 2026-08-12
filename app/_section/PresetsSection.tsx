"use client";

import { useMemo, useState } from "react";
import Input from "@/components/shared/input/Input";
import Select from "@/components/shared/input/Select";
import { SectionCard } from "@/components/shared/layout/SectionCard";
import { DRAGDROP_PRESETS } from "../_data/DragDropPresets";
import type { StudioPreset } from "../types";

const PAGE_SIZE = 8;

export default function PresetsSection({ activePresetId, onApply }: { activePresetId: string | null; onApply: (preset: StudioPreset) => void }) {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("all");
  const [size, setSize] = useState("all");
  const [page, setPage] = useState(1);

  const families = useMemo(() => ["all", ...Array.from(new Set(DRAGDROP_PRESETS.map((preset) => preset.family)))], []);
  const sizes = useMemo(() => ["all", ...Array.from(new Set(DRAGDROP_PRESETS.map((preset) => preset.size)))], []);
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      DRAGDROP_PRESETS.filter((preset) => {
        const haystack = [preset.family, preset.archetype, preset.variant, preset.size, ...preset.tags].join(" ").toLowerCase();
        return (!normalizedQuery || haystack.includes(normalizedQuery)) && (family === "all" || preset.family === family) && (size === "all" || preset.size === size);
      }),
    [family, normalizedQuery, size],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const visiblePresets = filtered.slice(pageStart, pageStart + PAGE_SIZE);
  const hasFilters = Boolean(normalizedQuery) || family !== "all" || size !== "all";
  const source = filtered.length ? filtered : DRAGDROP_PRESETS;
const resetFilters = () => {
    setQuery("");
    setFamily("all");
    setSize("all");
    setPage(1);
  };

  return (
    <SectionCard title="Presets" subtitle="48 structured full-state presets.">
      <div className="grid gap-3 sm:grid-cols-3" data-audit="preset-filters" data-testid="preset-filters">
        <Input label="Search presets" value={query} onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Family, mode, size, tag" />
        <Select label="Family" value={family} options={families} onChange={(value) => { setFamily(value); setPage(1); }} />
        <Select label="Size" value={size} options={sizes} onChange={(value) => { setSize(value); setPage(1); }} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3 text-sm" style={{ borderColor: "var(--border)", color: "var(--text)" }} data-audit="preset-results" data-testid="preset-results">
        <span>
          Showing {visiblePresets.length ? pageStart + 1 : 0}-{Math.min(pageStart + visiblePresets.length, filtered.length)} of {filtered.length} presets
        </span>
        <span data-audit="applied-preset-filters" data-testid="applied-preset-filters" style={{ color: "var(--muted)" }}>
          {hasFilters ? `Filters: ${[normalizedQuery && `query=${query.trim()}`, family !== "all" && `family=${family}`, size !== "all" && `size=${size}`].filter(Boolean).join(", ")}` : "No filters applied"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onApply(source[Math.floor(Math.random() * source.length)])} className="rounded-xl border px-4 py-3 text-sm font-semibold" style={{ borderColor: "var(--border)", color: "var(--text)" }} data-audit="preset-surprise" data-testid="preset-surprise">Surprise me</button>
        <button type="button" onClick={resetFilters} disabled={!hasFilters} className="rounded-xl border px-4 py-3 text-sm font-semibold disabled:opacity-50" style={{ borderColor: "var(--border)", color: "var(--text)" }} data-audit="reset-filters" data-testid="reset-filters">Reset filters</button>
      </div>

      <div className="grid gap-3" data-audit="preset-page" data-testid="preset-page">
        {visiblePresets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onApply(preset)}
            className="rounded-2xl border p-4 text-left transition-transform hover:-translate-y-0.5"
            style={{
              borderColor: activePresetId === preset.id ? "var(--primary)" : "var(--border)",
              background: activePresetId === preset.id ? "color-mix(in oklab, var(--primary) 20%, transparent)" : "color-mix(in oklab, var(--card) 65%, transparent)",
              color: "var(--text)",
            }}
            data-audit="preset-card"
            data-testid={`preset-card-${preset.id}`}
            aria-pressed={activePresetId === preset.id}
          >
            <strong>{preset.archetype}</strong>
            <span className="ml-2 text-xs uppercase tracking-[0.16em]" style={{ color: "var(--muted)" }}>{preset.variant} / {preset.size}</span>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{preset.tags.join(", ")}</p>
          </button>
        ))}
        {!visiblePresets.length ? <div className="rounded-2xl border p-4 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>No presets match the current filters.</div> : null}
      </div>

      <div className="flex items-center justify-between gap-3" data-audit="preset-pagination" data-testid="preset-pagination">
        <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={safePage === 1} className="rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-50" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Previous</button>
        <span className="text-sm" style={{ color: "var(--muted)" }}>Page {safePage} of {totalPages}</span>
        <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={safePage === totalPages} className="rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-50" style={{ borderColor: "var(--border)", color: "var(--text)" }}>Next</button>
      </div>
    </SectionCard>
  );
}
