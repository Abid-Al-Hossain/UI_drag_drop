"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import { LabeledField } from "@/components/shared/layout/LabeledField";
import Slider from "@/components/shared/input/Slider";
import Select from "@/components/shared/input/Select";
import ColorControl from "@/components/shared/color/ColorControl";
import type { DragDropState } from "../types";

type Props = { state: DragDropState; update: <K extends keyof DragDropState>(key: K, value: DragDropState[K]) => void };

const BORDER_STYLE_OPTIONS = [
  { value: "solid", label: "Solid" },
  { value: "dashed", label: "Dashed" },
  { value: "dotted", label: "Dotted" },
  { value: "double", label: "Double" },
  { value: "none", label: "None" },
];

export default function BorderSection({ state, update }: Props) {
  return (
    <SectionCard title="Border" subtitle="Width, style, and color.">
      <div className="space-y-4">
        <LabeledField label={`Width: ${state.borderWidth}px`}>
          <Slider value={state.borderWidth} min={0} max={10} step={1} onChange={(v) => update("borderWidth", v)} />
        </LabeledField>
        <LabeledField label="Style">
          <Select
            value={state.borderStyle}
            onChange={(v) => update("borderStyle", v as DragDropState["borderStyle"])}
            options={BORDER_STYLE_OPTIONS}
          />
        </LabeledField>
        {state.borderWidth > 0 && (
          <ColorControl label="Color" value={state.border} onChange={(v) => update("border", v)} />
        )}
      </div>
    </SectionCard>
  );
}
