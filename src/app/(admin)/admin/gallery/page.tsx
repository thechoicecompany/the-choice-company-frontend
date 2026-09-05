import type { Metadata } from "next";
import AdminGalleryClient from "./AdminGalleryClient";

export const metadata: Metadata = { title: "Gallery Management" };

export default function AdminGalleryPage() {
    return <AdminGalleryClient />;
}