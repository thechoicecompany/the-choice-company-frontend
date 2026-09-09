"use client";
import { useCallback, useRef, useState, useId } from "react";
import type { ImageSlot, ImageUploadZoneProps } from "@/lib/types/product-image.types";
import ImagePreviewCard from "./ImagePreviewCard";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp"];

function buildSlot(file: File): ImageSlot {
  return {
    uid: crypto.randomUUID(),
    file,
    preview: URL.createObjectURL(file),
    status: "pending",
    progress: 0,
  };
}

function validateFile(file: File, existingNames: Set<string>): string | null {
  if (!ALLOWED_MIME.includes(file.type.toLowerCase())) {
    return `"${file.name}" — invalid format. Use JPG, PNG, or WebP.`;
  }
  if (file.size > MAX_SIZE) {
    return `"${file.name}" exceeds 5 MB (${(file.size / 1024 / 1024).toFixed(1)} MB).`;
  }
  if (existingNames.has(file.name + file.size)) {
    return `"${file.name}" is already added.`;
  }
  return null;
}

export default function ImageUploadZone({
  slots, onChange, maxImages = 8, disabled = false,
}: ImageUploadZoneProps) {

  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Drag-and-drop reorder state
  const dragIndexRef = useRef<number | null>(null);

  const existingNames = new Set(slots.map(s => s.file.name + s.file.size));
  const remaining = maxImages - slots.length;

  // ── Add files ─────────────────────────────────────────────────────────────
  const addFiles = useCallback((incoming: File[]) => {
    const newErrors: string[] = [];
    const valid: ImageSlot[] = [];

    const names = new Set(slots.map(s => s.file.name + s.file.size));

    for (const file of incoming) {
      if (slots.length + valid.length >= maxImages) {
        newErrors.push(`Maximum ${maxImages} images allowed. Remaining files ignored.`);
        break;
      }
      const err = validateFile(file, names);
      if (err) { newErrors.push(err); continue; }
      names.add(file.name + file.size);
      valid.push(buildSlot(file));
    }

    setErrors(newErrors);
    if (valid.length > 0) {
      // First slot added gets primary if list is currently empty
      const next = [...slots, ...valid];
      onChange(next);
    }
  }, [slots, maxImages, onChange]);

  // ── Drop zone handlers ─────────────────────────────────────────────────────
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  }, [addFiles]);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = (e: React.DragEvent) => {
    // Only fire if leaving the zone entirely (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    addFiles(files);
    e.target.value = ""; // reset so same file can be re-added after removal
  };

  // ── Slot mutations ─────────────────────────────────────────────────────────
  function removeSlot(uid: string) {
    const next = slots.filter(s => s.uid !== uid);
    // Revoke object URL to prevent memory leak
    const removed = slots.find(s => s.uid === uid);
    if (removed) URL.revokeObjectURL(removed.preview);
    // If removed was primary, make first remaining slot primary
    if (next.length > 0 && removed?.uid === slots.find((_, i) => i === 0)?.uid) {
      next[0] = { ...next[0] };
    }
    onChange(next);
  }

  function setPrimary(uid: string) {
    onChange(slots.map((s, i) => ({
      ...s,
      // No explicit isPrimary on slot; primary = index 0 (first slot = primary)
      // We implement "set primary" by moving the slot to position 0
      // This is simpler and matches the spec: first image = primary
    })));
    // Move slot to front
    const idx = slots.findIndex(s => s.uid === uid);
    if (idx <= 0) return;
    const next = [...slots];
    const [item] = next.splice(idx, 1);
    next.unshift(item);
    onChange(next);
  }

  function moveSlot(from: number, to: number) {
    if (to < 0 || to >= slots.length) return;
    const next = [...slots];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  // ── Card drag-to-reorder handlers ─────────────────────────────────────────
  function onCardDragStart(index: number) {
    dragIndexRef.current = index;
  }

  function onCardDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === index) return;
    moveSlot(from, index);
    dragIndexRef.current = index;
  }

  function onCardDragEnd() {
    dragIndexRef.current = null;
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* Drop zone */}
      <div
        onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
        onClick={() => !disabled && remaining > 0 && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-all
          ${disabled || remaining === 0
            ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50"
            : dragging
              ? "border-navy bg-navy/5 scale-[1.01] cursor-copy"
              : "border-gray-200 bg-gray-50 hover:border-navy hover:bg-navy/5 cursor-pointer"
          }
          py-10
        `}
      >
        <div className="w-12 h-12 rounded-2xl bg-navy/10 flex items-center justify-center text-2xl">
          🖼️
        </div>
        <div className="text-center px-4">
          <p className="text-sm font-semibold text-navy">
            {remaining > 0
              ? "Drag & drop images here, or click to browse"
              : `Maximum ${maxImages} images reached`
            }
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Supported: JPG, PNG, WebP · Max 5 MB per image · Up to {maxImages} images
          </p>
          {remaining > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">
              {slots.length}/{maxImages} added · {remaining} remaining
            </p>
          )}
        </div>

        {remaining > 0 && !disabled && (
          <button type="button"
            onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
            className="px-5 py-2 rounded-xl text-sm font-semibold border border-navy/30 text-navy hover:bg-navy hover:text-white transition-all">
            Select Images
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_EXT.join(",")}
          multiple
          className="hidden"
          onChange={onInputChange}
          disabled={disabled || remaining === 0}
        />
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl space-y-1">
          {errors.map((e, i) => (
            <p key={i} className="text-red-700 text-xs flex items-start gap-1.5">
              <span className="flex-shrink-0 mt-0.5">⚠</span>
              <span>{e}</span>
            </p>
          ))}
        </div>
      )}

      {/* Image grid */}
      {slots.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">
              {slots.length} image{slots.length !== 1 ? "s" : ""} selected
              <span className="text-xs text-gray-400 font-normal ml-2">
                — drag cards to reorder · first image = primary
              </span>
            </p>
            <button type="button"
              onClick={() => {
                slots.forEach(s => URL.revokeObjectURL(s.preview));
                onChange([]);
                setErrors([]);
              }}
              disabled={disabled}
              className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-40">
              Remove all
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {slots.map((slot, index) => (
              <ImagePreviewCard
                key={slot.uid}
                slot={slot}
                index={index}
                totalCount={slots.length}
                isPrimary={index === 0}
                onRemove={() => removeSlot(slot.uid)}
                onSetPrimary={() => setPrimary(slot.uid)}
                onMoveLeft={() => moveSlot(index, index - 1)}
                onMoveRight={() => moveSlot(index, index + 1)}
                disabled={disabled}
                dragProps={{
                  draggable: true,
                  onDragStart: () => onCardDragStart(index),
                  onDragOver: (e) => onCardDragOver(e, index),
                  onDragEnd: onCardDragEnd,
                }}
              />
            ))}
          </div>

          {/* Primary image indicator */}
          <p className="text-xs text-gray-400 text-center">
            ★ <span className="text-gold font-semibold">Primary image</span> is shown in product listings.
            Drag cards or use ← → arrows to reorder. First card = primary.
          </p>
        </>
      )}
    </div>
  );
}

// ── Export uploadAll logic for parent use ─────────────────────────────────────
/**
 * Uploads all pending image slots sequentially.
 * Call this from the parent form's submit handler.
 * Returns updated slots with Cloudinary URLs + publicIds.
 */
export async function uploadSlots(
  slots: ImageSlot[],
  onChange: (s: ImageSlot[]) => void,
): Promise<ImageSlot[]> {
  const updated = [...slots];

  for (let i = 0; i < updated.length; i++) {
    if (updated[i].status === "done") continue;

    updated[i] = { ...updated[i], status: "uploading", progress: 10 };
    onChange([...updated]);

    try {
      const form = new FormData();
      form.append("file", updated[i].file);
      form.append("folder", "tcc/products");

      const res = await fetch("/api/proxy/api/upload/image", {
        method: "POST",
        body: form,
      });

      updated[i] = { ...updated[i], progress: 70 };
      onChange([...updated]);

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message ?? "Upload failed");

      updated[i] = {
        ...updated[i],
        status: "done",
        progress: 100,
        url: json.data.url as string,
        publicId: (json.data.publicId ?? "") as string,
      };
    } catch (err: unknown) {
      updated[i] = {
        ...updated[i],
        status: "error",
        error: err instanceof Error ? err.message : "Upload failed",
      };
      onChange([...updated]);
      // Throw to stop upload chain and let ProductForm handle the failure
      throw new Error(`Image ${i + 1} failed: ${updated[i].error}`);
    }

    onChange([...updated]);
  }

  return updated;
}