"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { uploadContentImage } from "@/lib/api/admin/blog";
import { useCallback, useRef } from "react";

export default function BlogEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension.configure({ HTMLAttributes: { class: "rounded-lg max-w-full" } }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  const insertImage = useCallback(async (file: File) => {
    if (!editor) return;
    const placeholder = URL.createObjectURL(file);
    editor.chain().focus().setImage({ src: placeholder }).run();
    try {
      const { url } = await uploadContentImage(file);
      const html = editor.getHTML().replace(placeholder, url);
      editor.commands.setContent(html, { emitUpdate: false });
      onChange(html);
    } catch {
      const html = editor.getHTML().replace(new RegExp(`<img[^>]*src="${placeholder}"[^>]*>`), "");
      editor.commands.setContent(html, { emitUpdate: false });
      onChange(html);
    } finally {
      URL.revokeObjectURL(placeholder);
    }
  }, [editor]);

  if (!editor) return null;
  const btn = (active: boolean) => `px-2.5 py-1.5 rounded-lg text-sm ${active ? "bg-navy text-white" : "text-gray-600 hover:bg-gray-100"}`;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2">
        <button type="button" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" className={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
        <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
        <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
        <button type="button" className={btn(editor.isActive("link"))} onClick={() => { const url = window.prompt("Link URL"); if (url) editor.chain().focus().setLink({ href: url }).run(); }}>🔗</button>
        <button type="button" className={btn(false)} onClick={() => fileInputRef.current?.click()}>🖼️ Image</button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) insertImage(f); e.target.value = ""; }} />
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[300px] focus:outline-none" />
    </div>
  );
}