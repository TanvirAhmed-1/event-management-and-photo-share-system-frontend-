"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface TableThumbnailProps {
  src?: string | null;
  alt: string;
}

/**
 * Displays a compact rounded table thumbnail with automatic fallback on broken URLs.
 */
export default function TableThumbnail({ src, alt }: TableThumbnailProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-400">
        <ImageIcon className="w-4 h-4" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes="44px"
      onError={() => setFailed(true)}
    />
  );
}
