"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, icon, children, className }: PageHeaderProps) {
  return (
    <div className={`rounded-xl p-8 border ${className || "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-700"}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="h-12 w-12 rounded-lg flex items-center justify-center overflow-hidden">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">{title}</h1>
              {description && <p className="text-slate-300 mt-1">{description}</p>}
            </div>
          </div>
        </div>
        {action}
      </div>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

