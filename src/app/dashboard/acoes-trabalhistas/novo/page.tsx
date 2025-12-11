"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload } from "lucide-react";

export default function NovaAcaoTrabalhistaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clientName: "",
    reuName: "",
    numeroProcesso: "",
    resumo: "",
    acompanhamento: "",
    responsavelName: "",
    responsavelDate: "",
    contratado: "Não",
    finalizado: false,
  });
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const handleChange = (key: keyof typeof formData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const formatDateBR = (iso: string) => {
    if (!iso) return "";
    const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
    try {
      const d = new Date(iso);
      return isNaN(d.getTime()) ? "" : d.toLocaleDateString("pt-BR");
    } catch { return ""; }
  };

  const handleSubmit = async () => {
    if (!formData.clientName.trim()) return;
    setSaving(true);
    const lines: string[] = [];
    if (formData.reuName) lines.push(`Réu: ${formData.reuName}`);
    if (formData.numeroProcesso) lines.push(`Número do processo: ${formData.numeroProcesso}`);
    if (formData.responsavelName) lines.push(`Responsável: ${formData.responsavelName}`);
    if (formData.responsavelDate) lines.push(`Data: ${formatDateBR(formData.responsavelDate)}`);
    lines.push(`Contratado: ${formData.contratado}`);
    if (formData.resumo) lines.push(`Resumo: ${formData.resumo}`);
    if (formData.acompanhamento) lines.push(`Acompanhamento: ${formData.acompanhamento}`);
    const notesBlock = `\n[Dados Iniciais]\n${lines.map((l) => `- ${l}`).join("\n")}\n`;
    const status = formData.finalizado ? "Finalizado" : "Em andamento";
    try {
      const res = await fetch("/api/acoes-trabalhistas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: formData.clientName,
          status,
          notes: notesBlock,
          reuName: formData.reuName,
          autorName: formData.clientName,
          numeroProcesso: formData.numeroProcesso,
          responsavelName: formData.responsavelName,
          responsavelDate: formData.responsavelDate,
          resumo: formData.resumo,
          acompanhamento: formData.acompanhamento,
          contratado: formData.contratado
        })
      });
      if (res.ok) {
        const created = await res.json();
        if (pendingFile) {
          setUploading(true);
          const fd = new FormData();
          fd.append("file", pendingFile);
          fd.append("caseId", String(created.id));
          fd.append("moduleType", "acoes_trabalhistas");
          fd.append("fieldName", "fotoNotificacaoDoc");
          fd.append("clientName", formData.clientName);
          await fetch("/api/documents/upload", { method: "POST", body: fd });
          setUploading(false);
        }
        setCreatedSuccess(true);
        setSaving(false);
        setTimeout(() => {
          router.push("/dashboard/acoes-trabalhistas");
        }, 1500);
        return;
      }
    } catch {}
    setSaving(false);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/acoes-trabalhistas">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-3xl font-bold">Nova Ação Trabalhista</h1>
      </div>

      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b">
          <CardTitle className="text-2xl font-semibold">Informações da Ação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nome do Autor da Ação</Label>
              <Input id="clientName" value={formData.clientName} onChange={(e) => handleChange("clientName", e.target.value)} className="h-12 border-2 focus:border-amber-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reuName">Nome do Réu</Label>
              <Input id="reuName" value={formData.reuName} onChange={(e) => handleChange("reuName", e.target.value)} className="h-12 border-2 focus:border-amber-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroProcesso">Número do Processo</Label>
              <Input id="numeroProcesso" value={formData.numeroProcesso} onChange={(e) => handleChange("numeroProcesso", e.target.value)} placeholder="0000000-00.0000.0.00.0000" className="h-12 border-2 focus:border-amber-500" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Documento (Foto da notificação)</Label>
              <div className="flex items-center gap-2">
                <input type="file" id="fotoDoc" className="hidden" accept="image/*,application/pdf" onChange={(e) => { const f = e.target.files?.[0] || null; setPendingFile(f); }} />
                <Button variant="outline" size="sm" onClick={() => document.getElementById("fotoDoc")?.click()} disabled={uploading}>
                  {uploading ? <div className="w-4 h-4 border-2 border-gray-300 border-t-amber-600 rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                  Upload
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsavelName">Responsável</Label>
                <Input id="responsavelName" value={formData.responsavelName} onChange={(e) => handleChange("responsavelName", e.target.value)} className="h-12 border-2 focus:border-amber-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsavelDate">Data</Label>
                <Input id="responsavelDate" type="date" value={formData.responsavelDate} onChange={(e) => handleChange("responsavelDate", e.target.value)} className="h-12 border-2 focus:border-amber-500" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resumo">Resumo</Label>
            <Textarea id="resumo" value={formData.resumo} onChange={(e) => handleChange("resumo", e.target.value)} className="min-h-[120px] border-2 focus:border-amber-500" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acompanhamento">Acompanhamento (cobrar o retorno)</Label>
            <Textarea id="acompanhamento" value={formData.acompanhamento} onChange={(e) => handleChange("acompanhamento", e.target.value)} className="min-h-[120px] border-2 focus:border-amber-500" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contratado">Contratado</Label>
              <Select value={formData.contratado} onValueChange={(v) => handleChange("contratado", v)}>
                <SelectTrigger id="contratado" className="h-12 border-2 focus:border-amber-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sim">Sim</SelectItem>
                  <SelectItem value="Não">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="finalizado">Processo finalizado</Label>
              <div className="flex items-center gap-3">
                <Button type="button" variant={formData.finalizado ? "default" : "outline"} onClick={() => handleChange("finalizado", true)}>Sim</Button>
                <Button type="button" variant={!formData.finalizado ? "default" : "outline"} onClick={() => handleChange("finalizado", false)}>Não</Button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSubmit} className="flex-1" disabled={saving}>{saving ? "Salvando..." : (<span className="flex items-center gap-2"><Save className="h-4 w-4" />Criar Ação</span>)}</Button>
            <Link href="/dashboard/acoes-trabalhistas" className="flex-1">
              <Button type="button" variant="outline" className="w-full" disabled={saving}>Cancelar</Button>
            </Link>
          </div>
          {createdSuccess && (
            <p className="mt-2 text-green-600">Criado com sucesso</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
