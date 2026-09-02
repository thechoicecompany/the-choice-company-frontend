"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogForm from "@/components/admin/blog/BlogForm";
import { fetchAdminBlogById } from "@/lib/api/admin/blog";
import type { AdminBlogPost } from "@/lib/types/blog.types";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<AdminBlogPost | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchAdminBlogById(Number(id))
      .then(setPost)
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) return <div className="p-6 text-red-500">Blog post not found.</div>;
  if (!post) return <div className="p-6 text-gray-400">Loading…</div>;

  return <BlogForm initial={post} />;
}