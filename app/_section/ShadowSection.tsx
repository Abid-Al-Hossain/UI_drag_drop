"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import { LabeledField } from "@/components/shared/layout/LabeledField";
import Slider from "@/components/shared/input/Slider";
import Switch from "@/components/shared/input/Switch";
import ColorControl from "@/components/shared/color/ColorControl";
import type { DragDropState } from "../types";

type Props = { state: DragDropState; update: <K extends keyof DragDropState>(key: K, value: DragDropState[K]) => void };

export default function ShadowSection({ state, update }: Props) {
  return (
    <SectionCard title="Shadow" subtitle="Drop shadow position, size, and color.">
      <div className="space-y-4">
        <Switch label="Enable shadow" checked={state.shadowEnabled} onChange={(v) => update("shadowEnabled", v)} />
        {state.shadowEnabled && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <LabeledField label={`X: ${state.shadowX}px`}>
                <Slider value={state.shadowX} min={-50} max={50} step={1} onChange={(v) => update("shadowX", v)} />
              </LabeledField>
              <LabeledField label={`Y: ${state.shadowY}px`}>
                <Slider value={state.shadowY} min={-50} max={50} step={1} onChange={(v) => update("shadowY", v)} />
              </LabeledField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <LabeledField label={`Blur: ${state.shadowBlur}px`}>
                <Slider value={state.shadowBlur} min={0} max={100} step={1} onChange={(v) => update("shadowBlur", v)} />
              </LabeledField>
              <LabeledField label={`Spread: ${state.shadowSpread}px`}>
                <Slider value={state.shadowSpread} min={-50} max={50} step={1} onChange={(v) => update("shadowSpread", v)} />
              </LabeledField>
            </div>
            <LabeledField label={`Opacity: ${Math.round(state.shadowOpacity * 100)}%`}>
              <Slider value={state.shadowOpacity} min={0} max={1} step={0.01} onChange={(v) => update("shadowOpacity", v)} />
            </LabeledField>
            <ColorControl label="Color" value={state.shadowColor} onChange={(v) => update("shadowColor", v)} />
          </>
        )}
      </div>
    </SectionCard>
  );
}
