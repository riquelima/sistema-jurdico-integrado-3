"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react";

function normalize(label: string) {
  const s = (label || "").toLowerCase();
  if (s === "em andamento") return "Em andamento";
  if (s === "finalizado") return "Finalizado";
  if (s === "deferido") return "Deferido";
  if (s === "ratificado") return "Ratificado";
  return label;
}

function getClasses(label: string) {
  const s = (label || "").toLowerCase();
  if (s === "em andamento") return "bg-blue-500 text-white";
  if (s === "finalizado") return "bg-emerald-500 text-white";
  if (s === "deferido") return "bg-amber-500 text-white";
  if (s === "ratificado") return "bg-violet-500 text-white";
  return "bg-slate-500 text-white";
}

function getIcon(label: string) {
  const s = (label || "").toLowerCase();
  if (s === "em andamento") return <Clock className="h-4 w-4" />;
  if (s === "finalizado") return <CheckCircle2 className="h-4 w-4" />;
  if (s === "deferido") return <AlertCircle className="h-4 w-4" />;
  return <FileText className="h-4 w-4" />;
}

export function StatusBadge({ status }: { status: string | undefined }) {
  const label = normalize(status || "");
  return (
    <Badge className={`flex items-center gap-1.5 px-3 py-1 shadow-md text-xs ${getClasses(label)}`}>
      {getIcon(label)}
      {label || "Em andamento"}
    </Badge>
  );
}

