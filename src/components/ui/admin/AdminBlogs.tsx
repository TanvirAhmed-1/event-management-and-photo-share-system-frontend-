"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useGetAllBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useTogglePublishBlogMutation,
  useDeleteBlogMutation,
} from "@/redux/features/blog/blogApi";
import {
  BookOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Clock,
  ImageIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TipTapEditor from "@/components/shared/TipTapEditor";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import TablePagination, { paginateItems } from "@/components/shared/TablePagination";
import toast from "react-hot-toast";

const BLOG_CATEGORIES = [
  "Event Planning",
  "Wedding Guides",
  "AI Photography",
  "Catering & Food",
  "Corporate Events",
];

export default function AdminBlogs() {
  const { data: res, isLoading, refetch } = useGetAllBlogsQuery({ includeDrafts: true });
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [togglePublish] = useTogglePublishBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Event Planning");
  const [coverImage, setCoverImage] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const blogs = res?.data || [];

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setCategory("Event Planning");
    setCoverImage("");
    setExcerpt("");
    setContent("");
    setTagsText("");
    setMetaTitle("");
    setMetaDescription("");
    setIsPublished(true);
  };

  const openCreate = () => {
    resetForm();
    setSheetOpen(true);
  };

  const openEdit = (b: any) => {
    setEditingId(b.id);
    setTitle(b.title || "");
    setSlug(b.slug || "");
    setCategory(b.category || "Event Planning");
    setCoverImage(b.coverImage || "");
    setExcerpt(b.excerpt || "");
    setContent(b.content || "");
    setTagsText(Array.isArray(b.tags) ? b.tags.join(", ") : "");
    setMetaTitle(b.metaTitle || "");
    setMetaDescription(b.metaDescription || "");
    setIsPublished(Boolean(b.isPublished));
    setSheetOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || content === "<p></p>") {
      toast.error("Please provide a title and article content.");
      return;
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      category,
      coverImage: coverImage.trim() || undefined,
      excerpt: excerpt.trim() || undefined,
      content,
      tags: tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim() || undefined,
      isPublished,
    };

    try {
      if (editingId) {
        await updateBlog({ id: editingId, data: payload }).unwrap();
        toast.success("Blog article updated!");
      } else {
        await createBlog(payload).unwrap();
        toast.success("Blog article published!");
      }
      setSheetOpen(false);
      resetForm();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save blog article");
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const result = await togglePublish(id).unwrap();
      toast.success(result?.message || "Updated status!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to toggle publish state");
    }
  };

  const handleDelete = (id: string, itemTitle: string) => {
    setDeleteTarget({ id, title: itemTitle });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteBlog(deleteTarget.id).unwrap();
      toast.success("Blog article deleted");
      setDeleteTarget(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete blog article");
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = blogs.filter(
    (b: any) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.category?.toLowerCase().includes(search.toLowerCase())
  );

  const { paginatedItems: paginatedBlogs, safePage } = paginateItems(
    filtered,
    currentPage
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#172554] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#7C3AED]" />
            SEO Blog &amp; Editorial Studio (TipTap)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Write rich SEO articles for Eventora using the TipTap WYSIWYG editor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs bg-slate-50 w-56"
            />
          </div>

          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Write Article</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-xl bg-slate-100 animate-pulse motion-preset-fade"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">
          No blog articles yet. Click &ldquo;Write Article&rdquo; to create one with TipTap.
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-slate-200/80 overflow-hidden">
            <Table className="text-xs">
                <TableHeader className="bg-slate-50/90">
                  <TableRow className="hover:bg-slate-50/90">
                    <TableHead>Cover</TableHead>
                    <TableHead>Title &amp; Slug</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Read Time</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBlogs.map((b: any) => (
                    <TableRow key={b.id}>
                      <TableCell className="py-2.5">
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                          {b.coverImage ? (
                            <Image
                              src={b.coverImage}
                              alt={b.title}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="font-bold text-[#172554] line-clamp-1">{b.title}</div>
                        <div className="text-[11px] font-mono text-slate-400">/blog/{b.slug}</div>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="px-2.5 py-1 rounded-full bg-purple-50 text-[#7C3AED] font-semibold text-[11px]">
                          {b.category}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {b.readingTimeMin || 3} min
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <Switch
                          checked={Boolean(b.isPublished)}
                          onCheckedChange={() => handleToggle(b.id)}
                        />
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/blog/${b.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#7C3AED] hover:bg-purple-50 transition"
                            title="View live post"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openEdit(b)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                            title="Edit with TipTap"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(b.id, b.title)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </div>
          <div className="mt-4">
            <TablePagination
              currentPage={safePage}
              totalItems={filtered.length}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}

      {/* TipTap Blog Editor Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="p-0 sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>{editingId ? "Edit Blog Article" : "Write New Blog Article"}</SheetTitle>
            <SheetDescription>
              Compose rich SEO articles using TipTap editor with headings, lists, quotes, and images.
            </SheetDescription>
          </SheetHeader>

          <form
            id="admin-blog-form"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            <div className="space-y-1.5">
              <Label className="text-xs">Article Title *</Label>
              <Input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!editingId && !slug) {
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, "")
                        .replace(/\s+/g, "-")
                    );
                  }
                }}
                placeholder="e.g. How AI Face Recognition Transforms Wedding Photo Delivery"
                required
                className="text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">URL Slug</Label>
                <Input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ai-face-recognition-wedding-photos"
                  className="text-xs h-9 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOG_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Cover Image URL</Label>
                <Input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Tags (comma separated)</Label>
                <Input
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="Wedding, AI Photos, Dhaka"
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Short Excerpt</Label>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary shown on the blog listing card..."
                rows={2}
                className="text-xs min-h-[60px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Article Content (TipTap Rich Editor) *</Label>
              <TipTapEditor
                value={content}
                onChange={setContent}
                placeholder="Write your full article with headings, bullet points, quotes, and images..."
              />
            </div>

            {/* SEO Meta Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <p className="text-xs font-bold text-[#172554]">SEO Search Metadata</p>
              <div className="space-y-1.5">
                <Label className="text-xs">Meta Title</Label>
                <Input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Optional custom SEO title..."
                  className="text-xs h-9 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Meta Description</Label>
                <Textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="150-160 character SEO description..."
                  rows={2}
                  className="text-xs min-h-[56px] bg-white"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <Label className="text-xs">Publish immediately</Label>
                <Switch checked={isPublished} onCheckedChange={setIsPublished} />
              </div>
            </div>
          </form>

          <SheetFooter>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              form="admin-blog-form"
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white disabled:opacity-50 transition"
            >
              {isCreating || isUpdating
                ? "Saving..."
                : editingId
                ? "Update Article"
                : "Publish Article"}
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Blog Article?"
        description={`Are you sure you want to delete "${deleteTarget?.title || ""}"? This action cannot be undone.`}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
