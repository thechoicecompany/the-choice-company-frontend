"use client";
import { useCallback, useState } from "react";
import type { KitBuilderHook } from "@/lib/hooks/useKitBuilder";

const BRANDING_OPTIONS = [
  { id:"screen",    icon:"🖨",  label:"Screen Print",   desc:"Best for flat surfaces" },
  { id:"embroider", icon:"🧵",  label:"Embroidery",     desc:"Premium stitched logo" },
  { id:"laser",     icon:"✏",   label:"Laser Engrave",  desc:"Elegant & permanent" },
  { id:"sticker",   icon:"🏷",  label:"Sticker Label",  desc:"Quick & cost-effective" },
];

export default function Step3LogoUpload({ kit }: { kit: KitBuilderHook }) {
  const [dragging,    setDragging]    = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploading,   setUploading]   = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setUploadError("");
    const allowed = ["image/png","image/jpeg","image/jpg","image/svg+xml","image/webp"];
    if (!allowed.includes(file.type)) { setUploadError("Invalid file type. Please upload PNG, JPG, or SVG."); return; }
    if (file.size > 5 * 1024 * 1024)  { setUploadError("File too large. Maximum size is 5MB."); return; }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("logo", file);
      const res  = await fetch("/api/upload/logo", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      kit.setLogo(file, data.url);
    } catch (err) {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [kit]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="space-y-5">
      {/* Logo Upload Panel */}
      <div className="card p-6">
        <h3 className="font-bold text-navy mb-1 flex items-center gap-2">
          <span className="text-xl">🏢</span> Upload Your Company Logo
        </h3>
        <p className="text-xs text-gray-500 mb-5">We'll print your logo on all selected products</p>

        {!kit.logoUrl ? (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => document.getElementById("logo-file-input")?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
              dragging ? "border-gold bg-gold/5" : "border-gray-300 hover:border-gold hover:bg-gray-50"
            }`}>
            <input id="logo-file-input" type="file" accept="image/png,image/jpeg,image/svg+xml"
              className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Uploading logo...</p>
              </div>
            ) : (
              <>
                <div className="text-5xl mb-3">☁️</div>
                <p className="text-sm font-medium text-gray-700 mb-1">Drop your logo here or click to upload</p>
                <p className="text-xs text-gray-400">PNG, SVG, JPG — max 5 MB · Best results with transparent PNG</p>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-200">
            <div className="w-14 h-14 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-2xl flex-shrink-0">
              🏢
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-navy">{kit.logoFile?.name}</p>
              <p className="text-xs text-gray-500">Logo uploaded — will be printed on all products</p>
            </div>
            <button onClick={kit.removeLogo}
              className="text-xs text-red-500 hover:underline px-3 py-1 rounded-lg hover:bg-red-50">
              Remove
            </button>
          </div>
        )}

        {uploadError && (
          <p className="text-xs text-red-600 mt-2 bg-red-50 px-3 py-2 rounded-lg">❌ {uploadError}</p>
        )}
      </div>

      {/* Branding Style */}
      <div className="card p-6">
        <h3 className="font-bold text-navy mb-1 flex items-center gap-2">
          <span className="text-xl">🎨</span> Branding Style
        </h3>
        <p className="text-xs text-gray-500 mb-5">How would you like your logo applied?</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {BRANDING_OPTIONS.map((opt) => (
            <button key={opt.id} onClick={() => kit.setBranding(opt.label)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                kit.brandingStyle === opt.label
                  ? "border-navy bg-blue-50/50"
                  : "border-gray-200 hover:border-gold"
              }`}>
              <div className="text-2xl mb-2">{opt.icon}</div>
              <div className="text-xs font-bold text-navy mb-1">{opt.label}</div>
              <div className="text-[11px] text-gray-400">{opt.desc}</div>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          * Final branding method recommended by our team based on product type
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={() => kit.setStep(2)} className="btn-outline-navy flex-1">← Back</button>
        <button onClick={() => kit.setStep(4)} className="btn-gold flex-[3]">
          ✨ Generate AI Combo →
        </button>
      </div>
    </div>
  );
}
