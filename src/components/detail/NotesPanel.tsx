"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface NotesPanelProps {
  notes: string;
  onChange: (v: string) => void;
  onSave: () => void;
}

export function NotesPanel({ notes, onChange, onSave }: NotesPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Observações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Textarea rows={6} placeholder="Adicione observações..." value={notes} onChange={(e) => onChange(e.target.value)} />
        <Button className="bg-slate-900 text-white shadow-md hover:bg-slate-800 hover:shadow-lg transform hover:scale-105 active:scale-95 w-full" onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </CardContent>
    </Card>
  );
}
