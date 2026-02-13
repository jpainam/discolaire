/* eslint-disable @next/next/no-img-element */
"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageIcon, Upload, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface ImageDropzoneProps {
  className?: string;
  initialImage?: string | null;
  disabled?: boolean;
  onFileChange?: (file: File | null) => void;
}

export function StudentAvatarDropzone({
  className,
  initialImage = null,
  disabled = false,
  onFileChange,
}: ImageDropzoneProps) {
  const [image, setImage] = useState<string | null>(initialImage);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        onFileChange?.(file);
      }
    },
    [onFileChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const handleRemove = useCallback(() => {
    setImage(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onFileChange?.(null);
  }, [onFileChange]);

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  useEffect(() => {
    setImage(initialImage);
  }, [initialImage]);

  const previewSrc = image?.startsWith("data:")
    ? image
    : image
      ? `/api/avatars/${image}`
      : "/placeholder.svg";

  return (
    <div className={cn("w-full max-w-xl", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      {!image ? (
        <div
          onClick={handleClick}
          onDrop={disabled ? undefined : handleDrop}
          onDragOver={disabled ? undefined : handleDragOver}
          onDragLeave={disabled ? undefined : handleDragLeave}
          className={cn(
            "relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-4 transition-all",
            disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer",
            isDragging && !disabled
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
          )}
        >
          <div
            className={cn(
              "bg-muted flex h-10 w-10 items-center justify-center rounded-full transition-colors",
              isDragging && "bg-primary/10",
            )}
          >
            <Upload
              className={cn(
                "text-muted-foreground h-4 w-4 transition-colors",
                isDragging && "text-primary",
              )}
            />
          </div>
          <div className="text-center">
            <p className="text-foreground text-base text-xs font-medium">
              {isDragging ? "Drop your image here" : "Drag & drop your image"}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              or click to browse from your device
            </p>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <ImageIcon className="h-4 w-4" />
            <span>PNG, JPG, GIF, WebP</span>
          </div>
        </div>
      ) : (
        <div className="bg-muted/30 relative overflow-hidden rounded-xl border">
          <div className="relative aspect-video w-full">
            <img
              src={previewSrc}
              alt="Preview"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="absolute top-3 right-3">
            <Button variant="destructive" size="icon-xs" onClick={handleRemove}>
              <X />
              <span className="sr-only">Remove image</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
