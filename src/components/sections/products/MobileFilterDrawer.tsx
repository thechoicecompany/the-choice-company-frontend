"use client";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import ProductFilters, { ActiveFilters } from "./ProductFilters";

interface Props {
    activeFilters: ActiveFilters;
}

export default function MobileFilterDrawer({ activeFilters }: Props) {
    const [open, setOpen] = useState(false);

    const activeCount = Object.values(activeFilters).filter(Boolean).length;

    return (
        <>
            {/* Trigger button */}
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 shadow-sm"
            >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-navy text-white text-[10px] font-bold flex items-center justify-center">
                        {activeCount}
                    </span>
                )}
            </button>

            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Drawer */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800 text-sm">Filters</h3>
                    <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
                <div className="overflow-y-auto h-full pb-24 px-4 pt-4">
                    <ProductFilters activeFilters={activeFilters} onFilterChange={() => setOpen(false)} />
                </div>
            </div>
        </>
    );
}