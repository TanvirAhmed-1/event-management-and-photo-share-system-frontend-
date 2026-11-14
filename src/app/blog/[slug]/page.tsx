import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchBlog(slug: string) {
  try {
    const res = await fetch(`${API_URL}/blogs/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlog(slug);

  if (!post) {
    return {
      title: "Article Not Found | Eventora Blog",
    };
  }

  return {
    title: `${post.metaTitle || post.title} | Eventora`,
    description: post.metaDescription || post.excerpt || "Read expert event & AI photo guides on Eventora.",
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "",
      type: "article",
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchBlog(slug);

  if (!post) {
    notFound();
  }

  const cover =
    post.coverImage ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription || post.excerpt || "",
    image: cover,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author?.name || "Eventora Editorial Team",
    },
  };

  return (
    <article className="min-h-screen bg-[#FAFAFF] py-12 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#7C3AED] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>

        <header className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#7C3AED] text-xs font-bold">
            {post.category}
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-200/80">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
              <User className="w-4 h-4 text-[#7C3AED]" />
              {post.author?.name || "Eventora Team"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#7C3AED]" />
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#7C3AED]" />
              {post.readingTimeMin || 3} min read
            </span>
          </div>
        </header>

        <div className="relative w-full h-64 sm:h-96 rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
          <Image
            src={cover}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>

        {/* Rendered TipTap HTML Content */}
        <div
          className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs text-slate-700 leading-relaxed space-y-4 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-[#172554] [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#172554] [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:text-sm sm:[&_p]:text-base [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5 [&_blockquote]:border-l-4 [&_blockquote]:border-[#7C3AED] [&_blockquote]:bg-purple-50/50 [&_blockquote]:py-2 [&_blockquote]:px-4 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_a]:text-[#7C3AED] [&_a]:underline [&_img]:rounded-2xl [&_img]:my-6 [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:rounded-2xl [&_pre]:overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Tag className="w-4 h-4 text-slate-400" />
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
