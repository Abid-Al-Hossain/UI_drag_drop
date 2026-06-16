"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Input from "@/components/shared/input/Input";
import Select from "@/components/shared/input/Select";
import Switch from "@/components/shared/input/Switch";
import type { DragDropState } from "../types";

type Props = { state: DragDropState; update: <K extends keyof DragDropState>(key: K, value: DragDropState[K]) => void };

export default function BehaviorSection({ state, update }: Props) {
  return (
    <div className="space-y-4">
      <SectionCard title="Transfer" subtitle="Drag transfer mode and ghost preview.">
      <div className="space-y-4">
        <Select label="Transfer mode" value={state.transferMode ?? "move"} options={["move", "copy", "reorder"]} onChange={(value) => update("transferMode", value as DragDropState["transferMode"])} />
        <Select label="Drag state" value={state.dragState} options={["idle", "dragging", "over", "dropped", "invalid"]} onChange={(value) => update("dragState", value)} />
        <Switch label="Show ghost preview" checked={state.showGhost} onChange={(value) => update("showGhost", value)} />
      </div>
    </SectionCard>
      <SectionCard title="Content" subtitle="Empty state text and disabled state.">
      <div className="space-y-4">
        <Input label="Empty state text" value={state.emptyStateText ?? ""} onChange={(value) => update("emptyStateText", value)} />
        <Switch label="Disabled" checked={state.disabled} onChange={(value) => update("disabled", value)} />
      </div>
    </SectionCard>
    </div>
  );
}
