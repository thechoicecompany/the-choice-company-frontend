"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BlogEditor from "./BlogEditor";
import { createBlog, updateBlog, uploadFeaturedImage, publishBlog, unpublishBlog } from "@/lib/api/admin/blog";
import type { AdminBlogPost, BlogRequest } from "@/lib/types/blog.types";

const CATEGORIES = ["Corporate Gifting", "Trends", "Guides", "Case Studies", "News"];

export default function BlogForm({ initial }: { initial?: AdminBlogPost }) {
    const router = useRouter();
    const [form, setForm] = useState<BlogRequest>({
        title: initial?.title ?? "",
        slug: initial?.slug ?? "",
        excerpt: initial?.excerpt ?? "",
        content: initial?.content ?? "",
        featuredImage: initial?.featuredImage ?? "",
        featuredImagePublicId: initial?.featuredImagePublicId ?? "",
        category: initial?.category ?? CATEGORIES[0],
        tags: initial?.tags ?? [],
        author: initial?.author ?? "",
        metaTitle: initial?.metaTitle ?? "",
        metaDescription: initial?.metaDescription ?? "",
    });
    const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));
    const [saving, setSaving] = useState(false);
    const [uploadingFeatured, setUploadingFeatured] = useState(false);
    const [error, setError] = useState("");

    const set = <K extends keyof BlogRequest>(key: K, val: BlogRequest[K]) => setForm((f) => ({ ...f, [key]: val }));

    const handleFeaturedUpload = async (file: File) => {
        setUploadingFeatured(true);
        try {
            const { url, publicId } = await uploadFeaturedImage(file);
            set("featuredImage", url);
            set("featuredImagePublicId", publicId);
        } catch {
            setError("Featured image upload failed. Please try again.");
        } finally {
            setUploadingFeatured(false);
        }
    };

    const handleSubmit = async (publish: boolean) => {
        setSaving(true);
        setError("");
        try {
            const payload: BlogRequest = { ...form, tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean) };
            const saved = initial ? await updateBlog(initial.id, payload) : await createBlog(payload);
            if (publish !== saved.isPublished) publish ? await publishBlog(saved.id) : await unpublishBlog(saved.id);
            router.push("/admin/blog");
        } catch {
            setError("Could not save the blog post. Please check the form and try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl">
            <h1 className="text-xl font-bold text-navy mb-6">{initial ? "Edit Post" : "New Post"}</h1>
            {error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>}

            <div className="space-y-5">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Title</label>
                    <input value={form.title} onChange={(e) => set("title", e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2" />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Slug (optional — auto-generated)</label>
                    <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2" placeholder="auto-generated" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
                        <select value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2">
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Author</label>
                        <input value={form.author} onChange={(e) => set("author", e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Tags (comma-separated)</label>
                    <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2" />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Excerpt</label>
                    <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} className="w-full rounded-xl border border-gray-200 px-3 py-2" />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Featured Image</label>
                    {form.featuredImage && <img src={form.featuredImage} alt="" className="h-32 rounded-xl mb-2 object-cover" />}
                    <input type="file" accept="image/*" disabled={uploadingFeatured}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFeaturedUpload(f); }} />
                    {uploadingFeatured && <p className="text-xs text-gray-400 mt-1">Uploading…</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Content</label>
                    <BlogEditor value={form.content} onChange={(html) => set("content", html)} />
                </div>

                <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-5">
                    <p className="text-xs font-semibold text-gray-500">SEO</p>
                    <input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} placeholder="Meta title" className="w-full rounded-xl border border-gray-200 px-3 py-2" />
                    <textarea value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} placeholder="Meta description" rows={2} className="w-full rounded-xl border border-gray-200 px-3 py-2" />
                </div>

                <div className="flex gap-3 pt-2">
                    <button disabled={saving} onClick={() => handleSubmit(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 font-semibold text-navy">Save Draft</button>
                    <button disabled={saving} onClick={() => handleSubmit(true)} className="btn-gold">{saving ? "Saving…" : "Publish"}</button>
                </div>
            </div>
        </div>
    );
}