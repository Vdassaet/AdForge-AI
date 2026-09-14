/* eslint-disable @next/next/no-img-element */
"use client";

import { MoreHorizontal, ThumbsUp, MessageCircle, Share2, Globe } from "lucide-react";

interface AdPreviewProps {
  businessName: string;
  logoUrl?: string;
  headline: string;
  primaryText: string;
  description: string;
  cta: string;
  imageUrl: string;
  aspectRatio: "1:1" | "4:5" | "9:16" | "16:9";
}

export function AdPreview({
  businessName,
  logoUrl,
  headline,
  primaryText,
  description,
  cta,
  imageUrl,
  aspectRatio,
}: AdPreviewProps) {
  // Determine aspect ratio class
  const ratioClasses = {
    "1:1": "aspect-square",
    "4:5": "aspect-[4/5]",
    "9:16": "aspect-[9/16]",
    "16:9": "aspect-video",
  };

  return (
    <div className="bg-white max-w-[400px] w-full mx-auto border border-slate-200 rounded-xl shadow-sm overflow-hidden text-slate-900">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-bold text-slate-500">
                {businessName.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h4 className="font-semibold text-[14px] leading-tight">{businessName}</h4>
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-[12px]">
              <span>Sponsored</span>
              <span>•</span>
              <Globe className="w-3 h-3" />
            </div>
          </div>
        </div>
        <button className="text-slate-500 p-1 hover:bg-slate-100 rounded-full">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Primary Text */}
      <div className="px-3 pb-3 text-[14px] whitespace-pre-wrap">
        {primaryText}
      </div>

      {/* Image */}
      <div className={`w-full bg-slate-100 ${ratioClasses[aspectRatio]} relative overflow-hidden`}>
        {imageUrl ? (
          <img src={imageUrl} alt="Ad creative" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
            No image selected
          </div>
        )}
      </div>

      {/* Ad Footer / Headline Area */}
      <div className="bg-slate-50 p-3 flex items-center justify-between border-b border-slate-200">
        <div className="pr-2 flex-1">
          <div className="text-[12px] text-slate-500 uppercase tracking-wide truncate">
            {description}
          </div>
          <div className="font-semibold text-[15px] leading-tight mt-0.5 line-clamp-2">
            {headline}
          </div>
        </div>
        <button className="bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold text-[14px] px-4 py-1.5 rounded-md flex-shrink-0 transition-colors">
          {cta}
        </button>
      </div>

      {/* Social Actions */}
      <div className="flex items-center justify-around p-1 text-slate-500">
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-md text-[14px] font-medium transition-colors">
          <ThumbsUp className="w-5 h-5" /> Like
        </button>
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-md text-[14px] font-medium transition-colors">
          <MessageCircle className="w-5 h-5" /> Comment
        </button>
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-md text-[14px] font-medium transition-colors">
          <Share2 className="w-5 h-5" /> Share
        </button>
      </div>
    </div>
  );
}
