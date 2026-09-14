"use client";

import { useState, useCallback } from "react";
import { UploadCloud } from "lucide-react";

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  accept?: string;
  maxSize?: number; // bytes
  multiple?: boolean;
}

export function FileUpload({ 
  onUpload, 
  accept = "image/*,video/*", 
  maxSize = 52428800, // default 50MB
  multiple = true 
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(async (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;
    
    setError(null);
    const filesArray = Array.from(filesList);
    
    const validFiles = filesArray.filter(file => {
      if (file.size > maxSize) {
        setError(`File ${file.name} is too large. Max size is ${Math.round(maxSize / 1024 / 1024)}MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      setIsUploading(true);
      // Simulate progress for UI purposes
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onUpload(validFiles);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => setProgress(0), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file(s)");
    } finally {
      setIsUploading(false);
    }
  }, [maxSize, onUpload]);

  return (
    <div className="w-full">
      <div
        className={`relative flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-lg transition-colors
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"}
          ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
          <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
          <p className="mb-2 text-sm text-slate-500 text-center px-4">
            <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-400">
            Supports Images and Videos (MAX. {Math.round(maxSize / 1024 / 1024)}MB)
          </p>
          
          {isUploading && (
            <div className="w-64 mt-4">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs font-medium text-blue-600 text-center">Uploading... {progress}%</p>
            </div>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
