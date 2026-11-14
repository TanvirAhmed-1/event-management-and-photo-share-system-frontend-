"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetAllBlogsQuery } from "@/redux/features/blog/blogApi";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Clock, ArrowRight, Sparkles, User } from "lucide-react";

const CATEGORIES = [
  "all",
  "Event Planning",
  "Wedding Guides",
  "AI Photography",
  "Catering & Food",
  "Corporate Events",
];

export default function BlogListingPage() {
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: res, isLoading } = useGetAllBlogsQuery({
    category: selectedCat,
    search: searchQuery || undefined,
  });

  const blogs = res?.data || [];

  return (
    <div className="min-h-screen bg-[#FAFAFF] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 motion-preset-slide-up-sm motion-preset-fade">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-xs font-bold border border-purple-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Eventora Editorial &amp; Guides</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">
            Event Planning &amp; AI Photo Stories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Expert tips on Bangladeshi weddings, catering budgets, corporate production, and instant AI guest photo sharing.
          </p>
        </div>

        {/* Search & Category Pills */}
        <div className="space-y-5">
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, wedding tips, AI photo guides..."
              className="pl-10 pr-4 h-10 text-xs rounded-2xl bg-white shadow-xs"
            />
          </div>

          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  selectedCat === cat
                    ? "bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/20"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat === "all" ? "All Articles" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xs motion-preset-fade"
              >
                <div className="h-48 bg-slate-200 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="w-24 h-4 rounded bg-slate-200 animate-pulse" />
                  <div className="w-full h-5 rounded bg-slate-200 animate-pulse" />
                  <div className="w-3/4 h-4 rounded bg-slate-200/70 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#172554]">No articles published yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Check back soon or try a different search keyword.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((post: any, idx: number) => {
              const cover =
                post.coverImage ||
                "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900&auto=format&fit=crop";
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col motion-preset-slide-up-sm motion-preset-fade"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={cover}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#7C3AED] text-[10px] font-extrabold shadow-xs">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium mb-2">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
                          {post.readingTimeMin || 3} min read
                        </span>
                        {post.author?.name && (
                          <span className="inline-flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {post.author.name}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-extrabold text-[#172554] group-hover:text-[#7C3AED] transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#7C3AED]">
                      <span>Read Full Guide</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
