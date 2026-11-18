"use client";

import React, { useState } from "react";
import { ImageIcon, Link2, Check } from "lucide-react";

interface ImageOptionSelectorProps {
  value: string;
  onChange: (url: string) => void;
  presets: { label: string; url: string }[];
}

export default function ImageOptionSelector({
  value,
  onChange,
  presets,
}: ImageOptionSelectorProps) {
  const [mode, setMode] = useState<"default" | "custom">("default");

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-600">Cover Image</label>
        <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode("default");
              if (!value && presets[0]) onChange(presets[0].url);
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
              mode === "default"
                ? "bg-white text-[#7C3AED] shadow-xs"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>Default Image</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("custom")}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
              mode === "custom"
                ? "bg-white text-[#7C3AED] shadow-xs"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Link2 className="w-3 h-3" />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {mode === "default" ? (
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset) => {
            const isSelected = value === preset.url;
            return (
              <button
                key={preset.url}
                type="button"
                onClick={() => onChange(preset.url)}
                className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition ${
                  isSelected
                    ? "border-[#7C3AED] ring-2 ring-[#7C3AED]/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] font-semibold px-1.5 py-0.5 truncate">
                  {preset.label}
                </div>
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#7C3AED] text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7C3AED]"
          />
          {value && (
            <div className="relative h-24 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

