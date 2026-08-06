"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImageDropzone({
  onFile,
  onClear,
  uploading = false,
  hasValue = false,
  preview,
  className,
}: {
  onFile: (file: File) => void;
  onClear?: () => void;
  uploading?: boolean;
  hasValue?: boolean;
  preview?: React.ReactNode;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) onFile(file);
  }

  if (hasValue) {
    return (
      <div className={cn("group relative overflow-hidden rounded-lg", className)}>
        {preview}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-md bg-background/90 px-3 py-1.5 text-sm font-medium text-foreground shadow hover:bg-background"
          >
            Trocar
          </button>
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Remover imagem"
              className="rounded-full bg-background/90 p-1.5 text-foreground shadow hover:bg-background"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      disabled={uploading}
      className={cn(
        "flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-center transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-input hover:border-primary/60 hover:bg-accent/50",
        className
      )}
    >
      {uploading ? (
        <>
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Enviando imagem...</span>
        </>
      ) : (
        <>
          <ImagePlus className="size-6 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium">Clique ou arraste uma imagem</span>
          <span className="text-xs text-muted-foreground">PNG ou JPG</span>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => handleFiles(event.target.files)}
      />
    </button>
  );
}
