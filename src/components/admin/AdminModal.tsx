"use client";
import { useEffect } from "react";

interface AdminModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: string;
}

export default function AdminModal({ open, onClose, title, children, width = "max-w-lg" }: AdminModalProps) {
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            {/* Modal */}
            <div className={`relative w-full ${width} bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <h3 className="font-bold text-navy text-lg">{title}</h3>
                    <button onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-xl">
                        ×
                    </button>
                </div>
                {/* Body */}
                <div className="overflow-y-auto p-6 flex-1">{children}</div>
            </div>
        </div>
    );
}
