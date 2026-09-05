"use client";

import { useState } from "react";
import CatalogGateModal from "@/components/catalog/CatalogGateModal";

export default function DownloadCatalogButton() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="btn-navy rounded-xl px-6 py-3 text-sm font-semibold"
            >
                📋 Download Catalogue
            </button>

            {open && (
                <CatalogGateModal
                    onClose={() => setOpen(false)}
                />
            )}
        </>
    );
}

