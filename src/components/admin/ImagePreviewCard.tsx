"use client";
import type { ImageSlot } from "@/lib/types/product-image.types";

interface Props {
  slot:          ImageSlot;
  index:         number;
  totalCount:    number;
  isPrimary:     boolean;
  onRemove:      () => void;
  onSetPrimary:  () => void;
  onMoveLeft:    () => void;
  onMoveRight:   () => void;
  disabled?:     boolean;
  /** drag-and-drop props forwarded from parent */
  dragProps?:    React.HTMLAttributes<HTMLDivElement>;
}

const STATUS_RING: Record<ImageSlot["status"], string> = {
  pending:   "ring-gray-200",
  uploading: "ring-blue-400 ring-2",
  done:      "ring-green-400 ring-2",
  error:     "ring-red-400 ring-2",
};

export default function ImagePreviewCard({
  slot, index, totalCount, isPrimary,
  onRemove, onSetPrimary, onMoveLeft, onMoveRight,
  disabled, dragProps,
}: Props) {

  return (
    <div
      {...dragProps}
      className={`relative flex flex-col bg-white rounded-2xl overflow-hidden border shadow-sm
        transition-all duration-150 select-none
        ${isPrimary ? "border-gold shadow-gold/20 shadow-md" : "border-gray-200"}
        ${dragProps ? "cursor-grab active:cursor-grabbing" : ""}
        ${disabled ? "opacity-60 pointer-events-none" : ""}
      `}
    >
      {/* ── Image preview ───────────────────────────────────────────────── */}
      <div className={`relative w-full aspect-square overflow-hidden ring-inset ${STATUS_RING[slot.status]}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slot.preview}
          alt={`Product image ${index + 1}`}
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Primary crown badge */}
        {isPrimary && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            ★ Primary
          </div>
        )}

        {/* Upload progress overlay */}
        {slot.status === "uploading" && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-white text-xs font-semibold">{slot.progress}%</span>
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-blue-400 transition-all"
              style={{ width: `${slot.progress}%` }} />
          </div>
        )}

        {/* Error overlay */}
        {slot.status === "error" && (
          <div className="absolute inset-0 bg-red-900/60 flex flex-col items-center justify-center gap-1 p-2">
            <span className="text-2xl">⚠️</span>
            <p className="text-white text-[10px] text-center leading-tight">{slot.error}</p>
          </div>
        )}

        {/* Done checkmark */}
        {slot.status === "done" && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow">
            <span className="text-white text-[10px] font-bold">✓</span>
          </div>
        )}

        {/* Remove button */}
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onRemove(); }}
          disabled={disabled}
          className="absolute top-2 right-2 w-6 h-6 bg-white/90 hover:bg-red-500 text-gray-700 hover:text-white rounded-full flex items-center justify-center shadow transition-all text-sm font-bold"
          title="Remove image"
          aria-label="Remove image"
        >
          ×
        </button>
      </div>

      {/* ── Image info ───────────────────────────────────────────────────── */}
      <div className="px-2 pt-2 pb-1">
        <p className="text-[10px] text-gray-400 truncate" title={slot.file.name}>
          {slot.file.name}
        </p>
        <p className="text-[10px] text-gray-400">
          {(slot.file.size / 1024).toFixed(0)} KB
        </p>
      </div>

      {/* ── Actions row ──────────────────────────────────────────────────── */}
      <div className="px-2 pb-2 flex items-center gap-1">
        {/* Move left */}
        <button type="button" onClick={onMoveLeft} disabled={index === 0 || disabled}
          className="flex-none w-6 h-6 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors"
          title="Move left">
          ←
        </button>
        {/* Move right */}
        <button type="button" onClick={onMoveRight} disabled={index === totalCount - 1 || disabled}
          className="flex-none w-6 h-6 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors"
          title="Move right">
          →
        </button>

        {/* Set primary */}
        {!isPrimary && (
          <button type="button" onClick={onSetPrimary} disabled={disabled}
            className="flex-1 text-[10px] font-semibold text-amber-700 border border-gold/50 hover:bg-gold hover:text-white rounded-lg py-0.5 transition-all disabled:opacity-40"
            title="Set as primary image">
            Set Primary
          </button>
        )}
        {isPrimary && (
          <div className="flex-1 text-center text-[10px] font-bold text-gold py-0.5">
            ★ Primary
          </div>
        )}
      </div>
    </div>
  );
}
