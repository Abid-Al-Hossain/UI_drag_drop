"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Input from "@/components/shared/input/Input";
import Select from "@/components/shared/input/Select";
import Switch from "@/components/shared/input/Switch";
import type { DragDropState } from "../types";

type Props = { state: DragDropState; update: <K extends keyof DragDropState>(key: K, value: DragDropState[K]) => void };

export default function BehaviorSection({ state, update }: Props) {
  return <SectionCard title="Behavior" subtitle="Behavior controls for native dragdrop generation."><Select label="Transfer mode" value={state.transferMode ?? "move"} options={["move", "copy", "reorder"]} onChange={(value) => update("transferMode", value as DragDropState["transferMode"])} />
<Input label="Empty state" value={state.emptyStateText ?? "Drop items here to build your list."} onChange={(value) => update("emptyStateText", value)} />
<Switch label="Show ghost preview" checked={state.showGhost} onChange={(value) => update("showGhost", value)} />
<Switch label="Disabled" checked={state.disabled} onChange={(value) => update("disabled", value)} /></SectionCard>;
}
