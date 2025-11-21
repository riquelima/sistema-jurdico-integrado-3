"use client";

import { Button } from "@/components/ui/button";
import { FileText, Download, X } from "lucide-react";

interface DocumentPreviewProps {
  fileUrl: string;
  fileName?: string;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

export function DocumentPreview({ fileUrl, fileName, onRemove, showRemoveButton = true }: DocumentPreviewProps) {
  const displayName = fileName || fileUrl.split('/').pop() || 'Documento';
  const handleOpen = () => {
    if (typeof window !== 'undefined') window.open(fileUrl, '_blank');
  };

  return (
    <div className="mt-2 p-2 rounded-md border bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 text-blue-600" />
          <button type="button" onClick={handleOpen} className="text-sm font-medium text-blue-600 hover:underline truncate" title={displayName}>
            {displayName}
          </button>
        </div>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={handleOpen} className="h-7 w-7 p-0" title="Abrir">
            <Download className="h-4 w-4" />
          </Button>
          {showRemoveButton && onRemove && (
            <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="h-7 w-7 p-0 text-destructive" title="Remover">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}