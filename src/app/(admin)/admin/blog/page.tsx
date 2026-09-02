"use client";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { fetchAdminBlogs, deleteBlog, publishBlog, unpublishBlog } from "@/lib/api/admin/blog";
import type { AdminBlogPost } from "@/lib/types/blog.types";

export default function AdminBlogListPage() {
    const [posts, setPosts] = useState<AdminBlogPost[]>([]);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetchAdminBlogs({ status: status || undefined, page: page - 1, size: 20 });
            setPosts(res.data);
            setTotalPages(res.totalPages || 1);
        } finally {
            setLoading(false);
        }
    }, [status, page]);

    useEffect(() => { load(); }, [load]);

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this blog post? This cannot be undone.")) return;
        await deleteBlog(id);
        load();
    };

    const handleTogglePublish = async (post: AdminBlogPost) => {
        post.isPublished ? await unpublishBlog(post.id) : await publishBlog(post.id);
        load();
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-navy">Blog Posts</h1>
                <Link href="/admin/blog/new" className="btn-gold">+ New Post</Link>
            </div>

            <div className="flex gap-2 mb-4">
                {["", "draft", "published"].map((s) => (
                    <button
                        key={s || "all"}
                        onClick={() => { setStatus(s); setPage(1); }}
                        className={`badge ${status === s ? "badge-navy" : "badge-gray"}`}
                    >
                        {s === "" ? "All" : s === "draft" ? "Draft" : "Published"}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-gray-500">
                        <tr>
                            <th className="p-3">Title</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Author</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Updated</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="p-6 text-center text-gray-400">Loading…</td></tr>
                        ) : posts.length === 0 ? (
                            <tr><td colSpan={6} className="p-6 text-center text-gray-400">No posts found.</td></tr>
                        ) : posts.map((post) => (
                            <tr key={post.id} className="border-t border-gray-100">
                                <td className="p-3 font-medium text-navy">{post.title}</td>
                                <td className="p-3">{post.category}</td>
                                <td className="p-3">{post.author}</td>
                                <td className="p-3">
                                    <span className={`badge ${post.isPublished ? "badge-green" : "badge-gray"}`}>
                                        {post.isPublished ? "Published" : "Draft"}
                                    </span>
                                </td>
                                <td className="p-3 text-gray-400">{new Date(post.updatedAt).toLocaleDateString()}</td>
                                <td className="p-3 text-right space-x-2">
                                    <button onClick={() => handleTogglePublish(post)} className="text-xs font-semibold text-gold">
                                        {post.isPublished ? "Unpublish" : "Publish"}
                                    </button>
                                    <Link href={`/admin/blog/${post.id}/edit`} className="text-xs font-semibold text-navy">Edit</Link>
                                    <button onClick={() => handleDelete(post.id)} className="text-xs font-semibold text-red-500">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                        <button
                            key={n}
                            onClick={() => setPage(n)}
                            className={`w-8 h-8 rounded-lg text-sm ${n === page ? "bg-navy text-white" : "text-gray-500"}`}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}