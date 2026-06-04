"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import type { DragDropState } from "../types";

type Props = { state: DragDropState; update: <K extends keyof DragDropState>(key: K, value: DragDropState[K]) => void };

export default function ContentSection({ state, update }: Props) {
  return <SectionCard title="Content" subtitle="Content controls for native dragdrop generation."><div className="rounded-2xl border p-4 text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>No separate native controls are needed for this section in this component.</div></SectionCard>;
}
