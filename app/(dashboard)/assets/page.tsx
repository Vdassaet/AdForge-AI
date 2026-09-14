"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { AssetGrid, AssetRecord } from "@/components/assets/asset-grid";
import { Search, Filter } from "lucide-react";

export default function AssetsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Logo", "Project", "Before & After", "Service", "Team", "Vehicle", "Other"];

  const [assets, setAssets] = useState<AssetRecord[]>([
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f",
      fileName: "fence-project-1.jpg",
      type: "image",
      category: "Project",
      isFavorite: true,
      size: 1024 * 1024 * 2.5,
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
      fileName: "logo-transparent.png",
      type: "image",
      category: "Logo",
      isFavorite: false,
      size: 1024 * 500,
      createdAt: new Date().toISOString()
    },
    {
      id: "3",
      url: "",
      fileName: "installation-timelapse.mp4",
      type: "video",
      category: "Project",
      isFavorite: false,
      size: 1024 * 1024 * 25,
      createdAt: new Date().toISOString()
    }
  ]);

  const handleUpload = async (files: File[]) => {
    console.log("Uploading files:", files.map(f => f.name));
    
    // Simulate upload processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add dummy assets to state to reflect UI changes
    const newAssets: AssetRecord[] = files.map((f, i) => ({
      id: `new-${Date.now()}-${i}`,
      url: URL.createObjectURL(f), // fake URL for preview
      fileName: f.name,
      type: f.type.startsWith("video/") ? "video" : "image",
      category: "Other",
      isFavorite: false,
      size: f.size,
      createdAt: new Date().toISOString()
    }));

    setAssets(prev => [...newAssets, ...prev]);
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.fileName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Media Library</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your photos, videos, and brand assets for AI Ad Generation.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <FileUpload onUpload={handleUpload} multiple={true} />
      </div>

      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            <Filter className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  selectedCategory === cat 
                    ? "bg-slate-900 text-white" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <AssetGrid 
          assets={filteredAssets} 
          onDelete={(id) => setAssets(prev => prev.filter(a => a.id !== id))}
          onFavorite={(id, isFav) => setAssets(prev => prev.map(a => a.id === id ? { ...a, isFavorite: isFav } : a))}
          onEdit={(asset) => console.log("Edit asset", asset)}
        />
      </div>
    </div>
  );
}
