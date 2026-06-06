"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Input from "@/components/shared/input/Input";
import Slider from "@/components/shared/input/Slider";
import type { DragDropState } from "../types";

type Props = { state: DragDropState; update: <K extends keyof DragDropState>(key: K, value: DragDropState[K]) => void };

export default function ItemsSection({ state, update }: Props) {
  return <SectionCard title="Items" subtitle="Items controls for native dragdrop generation."><Slider label="Item count" value={state.itemCount} min={0} max={14} step={1} onChange={(value) => update("itemCount", value)} />
<Slider label="Drop zones" value={state.zoneCount} min={1} max={4} step={1} onChange={(value) => update("zoneCount", value)} />
<Input label="Accepted type" value={state.acceptedType} onChange={(value) => update("acceptedType", value)} />
<Input label="Source label" value={state.sourceLabel ?? "Available items"} onChange={(value) => update("sourceLabel", value)} />
<Input label="Drop zone label" value={state.dropZoneLabel ?? "Selected drop zone"} onChange={(value) => update("dropZoneLabel", value)} /></SectionCard>;
}
