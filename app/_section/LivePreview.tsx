"use client";

import { type CSSProperties, type DragEvent, type KeyboardEvent, useState } from "react";
import type { DragDropState } from "../types";
import { SYSTEM_FONTS } from "@/components/shared/typography/fontConstants";

type DragItem = {
  id: string;
  label: string;
  type: string;
};

const clampCount = (value: number, max: number) => Math.max(0, Math.min(max, Math.round(value)));

function resolveFont(state: { fontBucket: "system" | "google"; googleFontFamily: string; systemFontIdx: number }): string {
  return state.fontBucket === "google"
    ? `"${state.googleFontFamily}", sans-serif`
    : (SYSTEM_FONTS[state.systemFontIdx]?.css ?? "inherit");
}

function buildShadow(state: { shadowEnabled: boolean; shadowX: number; shadowY: number; shadowBlur: number; shadowSpread: number; shadowColor: string; shadowOpacity: number }): string {
  if (!state.shadowEnabled) return "none";
  const hex = Math.round(state.shadowOpacity * 255).toString(16).padStart(2, "0");
  return `${state.shadowX}px ${state.shadowY}px ${state.shadowBlur}px ${state.shadowSpread}px ${state.shadowColor}${hex}`;
}

function buildRadius(state: { radiusLinked: boolean; radius: number; radiusTL: number; radiusTR: number; radiusBR: number; radiusBL: number }): string {
  return state.radiusLinked
    ? `${state.radius}px`
    : `${state.radiusTL}px ${state.radiusTR}px ${state.radiusBR}px ${state.radiusBL}px`;
}

function makeItems(state: DragDropState): DragItem[] {
  return Array.from({ length: clampCount(state.itemCount, 14) }, (_, index) => ({
    id: `item-${index + 1}`,
    label: `${state.label} ${index + 1}`,
    type: state.acceptedType,
  }));
}

function moveBefore(ids: string[], movedId: string, targetId: string) {
  const withoutMoved = ids.filter((id) => id !== movedId);
  const targetIndex = withoutMoved.indexOf(targetId);
  if (targetIndex < 0) return withoutMoved.concat(movedId);
  return withoutMoved.slice(0, targetIndex).concat(movedId, withoutMoved.slice(targetIndex));
}

function styles(state: DragDropState) {
  const mode = state.transferMode ?? "move";
  const shell: CSSProperties = {
    width: state.width,
    minHeight: state.height,
    padding: state.padding,
    borderRadius: buildRadius(state),
    border: `${state.borderWidth}px ${state.borderStyle} ${state.border}`,
    boxShadow: buildShadow(state),
    background: state.background,
    color: state.foreground,
    fontFamily: resolveFont(state),
    fontStyle: state.fontStyle,
    textTransform: state.textTransform,
    textDecoration: state.textDecoration,
    letterSpacing: `${state.letterSpacing}${state.letterSpacingUnit}`,
    lineHeight: state.lineHeight,
    opacity: state.disabled ? 0.55 : 1,
  };
  const layout: CSSProperties = {
    display: "grid",
    gap: state.gap,
  };
  const columns: CSSProperties = {
    display: "grid",
    gap: state.gap,
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  };
  const panel: CSSProperties = {
    border: `${state.borderWidth}px ${state.borderStyle} ${state.border}`,
    borderRadius: Math.max(12, state.radius - 6),
    padding: Math.max(12, Math.round(state.padding * 0.65)),
    background: "rgba(15, 23, 42, 0.34)",
  };
  const sourceItem = (active: boolean, dragging: boolean): CSSProperties => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "10px 12px",
    borderRadius: Math.max(10, state.radius - 10),
    border: `1px solid ${active ? state.accent : state.border}`,
    background: active ? `${state.accent}22` : "rgba(255,255,255,.04)",
    color: state.foreground,
    cursor: state.disabled ? "not-allowed" : "grab",
    opacity: dragging ? 0.5 : 1,
    transition: state.transitionDuration > 0 ? "border-color 0.2s ease, background 0.2s ease, opacity 0.2s ease" : "none",
  });
  const dropZone = (over: boolean): CSSProperties => ({
    minHeight: Math.max(120, Math.round(state.height * 0.42)),
    display: "grid",
    alignContent: "start",
    gap: Math.max(8, Math.round(state.gap * 0.75)),
    padding: Math.max(12, Math.round(state.padding * 0.65)),
    borderRadius: Math.max(12, state.radius - 6),
    border: `2px dashed ${over ? state.accent : state.border}`,
    background: over ? `${state.accent}18` : "rgba(255,255,255,.035)",
    transform: over && state.transitionDuration > 0 ? "scale(1.02)" : "scale(1)",
    transition: state.transitionDuration > 0 ? "background 0.2s ease, border-color 0.2s ease, transform 0.2s ease" : "none",
  });
  const ghost: CSSProperties = {
    marginTop: Math.max(8, Math.round(state.gap * 0.5)),
    padding: "8px 10px",
    borderRadius: 999,
    background: `${state.accent}20`,
    color: state.accent,
    fontSize: Math.max(11, state.bodySize - 2),
  };

  return { mode, shell, layout, columns, panel, sourceItem, dropZone, ghost };
}

export default function LivePreview({ state }: { state: DragDropState }) {
  const allItems = makeItems(state);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isOver, setIsOver] = useState(false);
  const [overItemId, setOverItemId] = useState<string | null>(null);
  const helpId = `${state.id}-help`;
  const dropId = `${state.id}-dropzone`;
  const view = styles(state);
  const mode = view.mode;
  const knownIds = new Set(allItems.map((item) => item.id));
  const droppedIds = selectedIds.filter((id) => knownIds.has(id));
  const droppedItems = droppedIds.map((id) => allItems.find((item) => item.id === id)).filter((item): item is DragItem => Boolean(item));
  const sourceItems = mode === "copy" ? allItems : allItems.filter((item) => !droppedIds.includes(item.id));
  const zoneCount = Math.max(1, Math.round(state.zoneCount));
  const previewState = state.previewState === "empty" || allItems.length === 0 ? "empty" : state.previewState;

  const commitItem = (itemId: string, targetId?: string) => {
    if (state.disabled || !knownIds.has(itemId)) return;
    setActiveId(itemId);
    setSelectedIds((current) => {
      const normalized = current.filter((id) => knownIds.has(id));
      if (mode === "reorder" && targetId) return moveBefore(normalized.includes(itemId) ? normalized : normalized.concat(itemId), itemId, targetId);
      if (mode === "copy") return normalized.includes(itemId) ? normalized : normalized.concat(itemId);
      return normalized.includes(itemId) ? normalized : normalized.concat(itemId);
    });
  };

  const removeItem = (itemId: string) => {
    if (state.disabled) return;
    setSelectedIds((current) => current.filter((id) => id !== itemId));
    setActiveId(itemId);
  };

  const handleDragStart = (itemId: string) => (event: DragEvent<HTMLButtonElement>) => {
    if (state.disabled) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.effectAllowed = mode === "copy" ? "copy" : "move";
    event.dataTransfer.setData("text/plain", itemId);
    setDraggingId(itemId);
    setActiveId(itemId);
  };

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    if (state.disabled) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = mode === "copy" ? "copy" : "move";
    setIsOver(true);
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const itemId = event.dataTransfer.getData("text/plain") || draggingId;
    if (itemId) commitItem(itemId, overItemId ?? undefined);
    setDraggingId(null);
    setIsOver(false);
    setOverItemId(null);
  };

  const handleItemKeyDown = (itemId: string) => (event: KeyboardEvent<HTMLButtonElement>) => {
    if (state.disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (droppedIds.includes(itemId) && mode !== "copy") {
        removeItem(itemId);
      } else {
        commitItem(itemId);
      }
    }
    if (mode === "reorder" && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
      event.preventDefault();
      setSelectedIds((current) => {
        const index = current.indexOf(itemId);
        if (index < 0) return current;
        const next = current.slice();
        const targetIndex = event.key === "ArrowUp" ? Math.max(0, index - 1) : Math.min(next.length - 1, index + 1);
        [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
        return next;
      });
    }
  };

  const renderItem = (item: DragItem, location: "source" | "drop") => {
    const selected = droppedIds.includes(item.id);
    const dragging = draggingId === item.id;
    return (
      <li key={`${location}-${item.id}`} style={{ listStyle: "none" }}>
        <button
          type="button"
          draggable={!state.disabled}
          onClick={() => (location === "drop" ? removeItem(item.id) : commitItem(item.id))}
          onDragStart={handleDragStart(item.id)}
          onDragEnd={() => {
            setDraggingId(null);
            setIsOver(false);
            setOverItemId(null);
          }}
          onDragOver={(event) => {
            if (location === "drop") {
              handleDragOver(event);
              setOverItemId(item.id);
            }
          }}
          onKeyDown={handleItemKeyDown(item.id)}
          aria-label={`${location === "drop" ? "Remove" : "Add"} ${item.label}`}
          aria-describedby={helpId}
          aria-pressed={selected}
          disabled={state.disabled}
          style={view.sourceItem(activeId === item.id || selected || overItemId === item.id, dragging)}
        >
          <span>{item.label}</span>
          <small style={{ color: state.muted }}>{item.type}</small>
        </button>
      </li>
    );
  };

  return (
    <section
      id={state.id}
      role={state.role}
      aria-label={state.ariaLabel}
      aria-describedby={helpId}
      tabIndex={state.tabIndex}
      data-state={previewState}
      data-drag-state={draggingId ? "dragging" : isOver ? "over" : state.dragState}
      data-transfer-mode={mode}
      style={view.shell}
    >
      <div style={view.layout}>
        <header>
          <p style={{ margin: 0, color: state.accent, fontSize: Math.max(11, state.bodySize - 2), fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>{mode} drop board</p>
          <h3 style={{ margin: "4px 0 0", fontSize: state.titleSize, fontWeight: state.fontWeight }}>{state.title}</h3>
          <p style={{ margin: "6px 0 0", color: state.muted, fontSize: state.bodySize }}>{state.description}</p>
        </header>

        <div style={view.columns}>
          <section aria-label={state.sourceLabel ?? "Available items"} style={view.panel}>
            <strong>{state.sourceLabel ?? "Available items"}</strong>
            <ul style={{ display: "grid", gap: Math.max(8, Math.round(state.gap * 0.65)), margin: "12px 0 0", padding: 0 }}>
              {sourceItems.length ? sourceItems.map((item) => renderItem(item, "source")) : <li style={{ color: state.muted, listStyle: "none" }}>All items are in the drop zone.</li>}
            </ul>
          </section>

          <section
            id={dropId}
            aria-label={state.dropZoneLabel ?? "Selected drop zone"}
            aria-describedby={helpId}
            onDragOver={handleDragOver}
            onDragLeave={() => {
              setIsOver(false);
              setOverItemId(null);
            }}
            onDrop={handleDrop}
            style={view.dropZone(isOver)}
          >
            <strong>{state.dropZoneLabel ?? "Selected drop zone"}</strong>
            <p style={{ margin: 0, color: state.muted, fontSize: Math.max(11, state.bodySize - 1) }}>{zoneCount} zone{zoneCount === 1 ? "" : "s"} accept {state.acceptedType}</p>
            {droppedItems.length ? (
              <ul role="listbox" aria-label="Dropped items" style={{ display: "grid", gap: Math.max(8, Math.round(state.gap * 0.65)), margin: 0, padding: 0 }}>
                {droppedItems.map((item) => renderItem(item, "drop"))}
              </ul>
            ) : (
              <div role="status" style={{ color: state.muted, border: `1px dashed ${state.border}`, borderRadius: Math.max(10, state.radius - 10), padding: 14 }}>{state.emptyStateText ?? "Drop items here to build your list."}</div>
            )}
          </section>
        </div>

        {state.showGhost && draggingId ? <div aria-live="polite" style={view.ghost}>Dragging {allItems.find((item) => item.id === draggingId)?.label ?? state.label}</div> : null}
        <p id={helpId} style={{ margin: 0, color: state.muted, fontSize: Math.max(11, state.bodySize - 2) }}>{state.keyboardHelp ? `${state.helper} Press Enter or Space to move an item; use Arrow Up or Arrow Down to reorder dropped items.` : state.helper}</p>
      </div>
    </section>
  );
}
