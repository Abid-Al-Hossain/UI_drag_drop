"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Input from "@/components/shared/input/Input";
import type { DragDropState } from "../types";

type Props = { state: DragDropState; update: <K extends keyof DragDropState>(key: K, value: DragDropState[K]) => void };

export default function BasicsSection({ state, update }: Props) {
  return <SectionCard title="Basics" subtitle="Basics controls for native dragdrop generation.">
      <div className="space-y-4"><Input label="Title" value={state.title} onChange={(value) => update("title", value)} />
<Input label="Label" value={state.label} onChange={(value) => update("label", value)} />
<Input label="Description" value={state.description} onChange={(value) => update("description", value)} />
<Input label="Helper" value={state.helper} onChange={(value) => update("helper", value)} /></div>
    </SectionCard>;
}
