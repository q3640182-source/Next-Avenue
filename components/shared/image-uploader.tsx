"use client";

import * as React from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getUploadSignature } from "@/app/actions/upload";

export function CustomImageUploader({ 
  onUpload, 
  disabled,
  currentCount,
  maxFiles = 5,
  children
}: { 
  onUpload: (url: string) => void, 
  disabled?: boolean,
  currentCount?: number,
  maxFiles?: number,
  children?: React.ReactNode
}) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadFiles(Array.from(e.target.files));
    }
  };

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    let uploadedCount = 0;
    for (const file of files) {
      if (currentCount !== undefined && currentCount + uploadedCount >= maxFiles) {
         toast.error(`Maximum ${maxFiles} images allowed`);
         break;
      }
      try {
        const { timestamp, signature, apiKey } = await getUploadSignature();
        
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: formData,
        });
        
        if (res.ok) {
          const data = await res.json();
          onUpload(data.secure_url);
          uploadedCount++;
        } else {
          toast.error("Failed to upload image");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error uploading image");
      }
    }
    setIsUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div 
      className={cn(
        "relative flex flex-col items-center justify-center transition-colors text-center w-full",
        !children && "rounded-xl border-2 border-dashed p-8",
        !children && (isDragging ? "border-primary bg-primary/5" : "border-slate-200 bg-slate-50"),
        disabled || isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-slate-100",
        children && "p-0 border-0"
      )}
      onDragOver={(e) => { e.preventDefault(); if (!disabled && !isUploading) setIsDragging(true); }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled || isUploading) return;
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          uploadFiles(Array.from(e.dataTransfer.files));
        }
      }}
      onClick={() => {
        if (!disabled && !isUploading) inputRef.current?.click();
      }}
    >
      <input 
        type="file" 
        multiple={maxFiles > 1} 
        accept="image/*" 
        className="hidden" 
        ref={inputRef}
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
      {isUploading ? (
        <div className="flex flex-col items-center justify-center min-h-[100px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm font-medium text-slate-500">Uploading...</p>
        </div>
      ) : children ? (
         children
      ) : (
        <div className="flex flex-col items-center">
          <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
            <UploadCloud className="h-8 w-8 text-primary" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">Click to upload or drag and drop</h4>
          <p className="text-xs text-slate-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
        </div>
      )}
    </div>
  );
}
