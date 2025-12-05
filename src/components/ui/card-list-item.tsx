"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

interface CardListItemProps {
  icon?: ReactNode;
  title: string;
  status?: string;
  rightActions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function CardListItem({ icon, title, status, rightActions, children, className }: CardListItemProps) {
  return (
    <Card className={`border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 relative ${className || ""}`}>
      <div className="absolute top-2 right-2 flex items-center gap-2">{rightActions}</div>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-md flex-shrink-0">{icon}</div>
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title || "—"}</h3>
                {typeof status !== "undefined" && <StatusBadge status={status} />}
              </div>
              {children}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

