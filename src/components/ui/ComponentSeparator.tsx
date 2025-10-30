"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Component separator for spacing between major sections
function ComponentSeparator({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("w-full py-20 flex items-center justify-center", className)}
      {...props}
    >
      <div className="flex items-center justify-center space-x-4">
        {/* Linha esquerda */}
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent to-primary" />
        
        {/* Elemento central */}
        <div className="relative">
          {/* Círculo principal */}
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary-foreground" />
          </div>
          
          {/* Pontos decorativos */}
          <div className="absolute -top-1 -left-1 w-1 h-1 rounded-full bg-primary" />
          <div className="absolute -top-1 -right-1 w-1 h-1 rounded-full bg-primary" />
          <div className="absolute -bottom-1 -left-1 w-1 h-1 rounded-full bg-primary" />
          <div className="absolute -bottom-1 -right-1 w-1 h-1 rounded-full bg-primary" />
        </div>
        
        {/* Linha direita */}
        <div className="w-24 h-0.5 bg-gradient-to-l from-transparent to-primary" />
      </div>
    </div>
  )
}

export { ComponentSeparator }
