"use client";

import Image from "next/image";
import { Heart, Trash2, Edit2, FileIcon, ImageIcon, VideoIcon } from "lucide-react";

export type AssetType = "image" | "video" | "document" | "other";

export interface AssetRecord {
  id: string;
  url: string;
  fileName: string;
  type: AssetType;
  category: string;
  isFavorite: boolean;
  size: number; // bytes
  createdAt: string;
}

interface AssetGridProps {
  assets: AssetRecord[];
  onDelete?: (id: string) => void;
  onFavorite?: (id: string, isFavorite: boolean) => void;
  onEdit?: (asset: AssetRecord) => void;
}

export function AssetGrid({ assets, onDelete, onFavorite, onEdit }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
        <ImageIcon className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-sm font-medium text-slate-900">No assets found</h3>
        <p className="text-sm text-slate-500 mt-1">Upload some files to see them here.</p>
      </div>
    );
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {assets.map((asset) => (
        <div key={asset.id} className="group relative rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="aspect-square bg-slate-100 flex items-center justify-center relative overflow-hidden">
            {asset.type === "image" ? (
              <Image src={asset.url} alt={asset.fileName} fill className="object-cover" />
            ) : asset.type === "video" ? (
              <div className="flex flex-col items-center text-slate-400">
                <VideoIcon className="w-10 h-10 mb-2" />
                <span className="text-xs">Video</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <FileIcon className="w-10 h-10 mb-2" />
                <span className="text-xs">Document</span>
              </div>
            )}
            
            {/* Overlay actions */}
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
              <div className="flex justify-end">
                <button 
                  onClick={() => onFavorite?.(asset.id, !asset.isFavorite)}
                  className={`p-1.5 rounded-full ${asset.isFavorite ? "bg-white text-red-500" : "bg-white/20 text-white hover:bg-white/40"}`}
                >
                  <Heart className={`w-4 h-4 ${asset.isFavorite ? "fill-current" : ""}`} />
                </button>
              </div>
              <div className="flex justify-between gap-2">
                <button 
                  onClick={() => onEdit?.(asset)}
                  className="flex-1 bg-white/90 text-slate-700 text-xs font-medium py-1.5 rounded-md hover:bg-white"
                >
                  <Edit2 className="w-3 h-3 mx-auto" />
                </button>
                <button 
                  onClick={() => onDelete?.(asset.id)}
                  className="flex-1 bg-red-500/90 text-white text-xs font-medium py-1.5 rounded-md hover:bg-red-500"
                >
                  <Trash2 className="w-3 h-3 mx-auto" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-3">
            <p className="text-sm font-medium text-slate-900 truncate" title={asset.fileName}>
              {asset.fileName}
            </p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {asset.category || "Uncategorized"}
              </span>
              <span className="text-xs text-slate-500">{formatSize(asset.size)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
