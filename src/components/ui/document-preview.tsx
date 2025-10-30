"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Image, Download, Eye, X } from "lucide-react";

interface DocumentPreviewProps {
  fileUrl: string;
  fileName?: string;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

export function DocumentPreview({ 
  fileUrl, 
  fileName, 
  onRemove, 
  showRemoveButton = true 
}: DocumentPreviewProps) {
  const [showFullPreview, setShowFullPreview] = useState(false);

  // Função para detectar o tipo de arquivo pela URL ou extensão
  const getFileType = (url: string): 'pdf' | 'image' | 'document' => {
    const extension = url.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return 'image';
    }
    
    if (extension === 'pdf') {
      return 'pdf';
    }
    
    return 'document';
  };

  const fileType = getFileType(fileUrl);
  const displayName = fileName || fileUrl.split('/').pop() || 'Documento';

  const handleDownload = () => {
    if (typeof window !== 'undefined') {
      window.open(fileUrl, '_blank');
    }
  };

  const renderPreview = () => {
    switch (fileType) {
      case 'image':
        return (
          <div className="relative">
            <img
              src={fileUrl}
              alt={displayName}
              className="w-full h-32 object-cover rounded-md border"
              onError={(e) => {
                // Fallback se a imagem não carregar
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden flex items-center justify-center w-full h-32 bg-muted rounded-md border">
              <Image className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
        );
      
      case 'pdf':
        return (
          <div className="flex items-center justify-center w-full h-32 bg-muted rounded-md border">
            <div className="text-center">
              <FileText className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">PDF Document</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center w-full h-32 bg-muted rounded-md border">
            <div className="text-center">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Documento</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="mt-2">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Eye className="h-4 w-4" />
            <span className="font-medium">Documento Enviado</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-6 w-6 p-0"
              title="Visualizar documento"
            >
              <Download className="h-3 w-3" />
            </Button>
            {showRemoveButton && onRemove && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                title="Remover documento"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        
        {renderPreview()}
        
        <p className="text-xs text-muted-foreground mt-2 truncate" title={displayName}>
          {displayName}
        </p>
      </CardContent>
    </Card>
  );
}