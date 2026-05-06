"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, Scale, Clock, User, AlertCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DatajudSearchProps {
  initialNpu?: string;
  children?: React.ReactNode;
}

export function DatajudSearch({ initialNpu, children }: DatajudSearchProps) {
  const [open, setOpen] = useState(false);
  const [npu, setNpu] = useState(initialNpu || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Format NPU while typing
  const handleNpuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 20) value = value.substring(0, 20);
    
    // Format as NNNNNNN-DD.AAAA.J.TR.OOOO
    let formatted = value;
    if (value.length > 7) formatted = value.substring(0, 7) + "-" + value.substring(7);
    if (value.length > 9) formatted = formatted.substring(0, 10) + "." + formatted.substring(10);
    if (value.length > 13) formatted = formatted.substring(0, 15) + "." + formatted.substring(15);
    if (value.length > 14) formatted = formatted.substring(0, 17) + "." + formatted.substring(17);
    if (value.length > 16) formatted = formatted.substring(0, 20) + "." + formatted.substring(20);

    setNpu(formatted);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const cleanNpu = npu.replace(/\D/g, "");
    if (cleanNpu.length !== 20) {
      toast.error("O número do processo deve conter 20 dígitos.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/datajud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeroProcesso: cleanNpu }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data.processo);
      } else {
        setError(data.message || data.error || "Processo não encontrado. Pode estar em segredo de justiça.");
      }
    } catch (err) {
      setError("Erro de conexão ao consultar a API do Datajud.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Data não informada";
    try {
      // O Datajud retorna formato ISO "2023-11-20T14:30:00.000Z"
      return format(parseISO(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? children : (
          <Button variant="outline" className="gap-2 border-sky-200 text-sky-700 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-300 dark:hover:bg-sky-900/30">
            <Scale className="h-4 w-4" />
            Consulta Datajud
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Scale className="h-5 w-5 text-sky-600" />
            Consulta Processual Pública (CNJ)
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSearch} className="flex gap-3 my-4">
          <div className="flex-1 space-y-1">
            <Input
              placeholder="0000000-00.0000.0.00.0000"
              value={npu}
              onChange={handleNpuChange}
              disabled={loading}
              className="text-lg py-6"
            />
          </div>
          <Button type="submit" disabled={loading} className="h-[52px] px-8 bg-sky-600 hover:bg-sky-700 text-white">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          </Button>
        </form>

        {error && (
          <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 p-4 rounded-lg flex items-start gap-3 border border-amber-200 dark:border-amber-800/50">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Não foi possível consultar os dados</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <Tabs defaultValue="resumo" className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="resumo">Resumo do Processo</TabsTrigger>
              <TabsTrigger value="movimentacoes">Movimentações ({result.movimentos?.length || 0})</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 mt-4 rounded-md border border-slate-200 dark:border-slate-800 p-4">
              <TabsContent value="resumo" className="space-y-6 m-0">
                
                {/* Header Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Classe Processual</p>
                    <p className="text-sm font-medium mt-1 text-slate-900 dark:text-slate-100">{result.classe?.nome || "Não informada"}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Órgão Julgador</p>
                    <p className="text-sm font-medium mt-1 text-slate-900 dark:text-slate-100">{result.orgaoJulgador?.nome || "Não informado"}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Data de Autuação</p>
                    <p className="text-sm font-medium mt-1 text-slate-900 dark:text-slate-100">{formatDate(result.dataAjuizamento)}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Formato</p>
                    <p className="text-sm font-medium mt-1 text-slate-900 dark:text-slate-100">{result.formato?.nome || "Eletrônico"} ({result.sistema?.nome})</p>
                  </div>
                </div>

                {/* Assuntos */}
                {result.assuntos && result.assuntos.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-500" /> Assuntos
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.assuntos.map((assunto: any, idx: number) => (
                        <span key={idx} className="bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300 text-xs px-2.5 py-1 rounded-full font-medium">
                          {assunto.nome}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </TabsContent>

              <TabsContent value="movimentacoes" className="m-0">
                {(!result.movimentos || result.movimentos.length === 0) ? (
                  <p className="text-center text-slate-500 py-8">Nenhuma movimentação encontrada.</p>
                ) : (
                  <div className="space-y-6">
                    {result.movimentos.sort((a: any, b: any) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()).map((mov: any, idx: number) => (
                      <div key={idx} className="flex gap-4 relative">
                        {/* Timeline dot/line */}
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-sky-500 z-10" />
                          {idx !== result.movimentos.length - 1 && (
                            <div className="w-px h-full bg-slate-200 dark:bg-slate-700 -mt-1" />
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="pb-6 -mt-1.5 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              {formatDate(mov.dataHora)}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{mov.nome}</p>
                          {mov.complementosTabelados && mov.complementosTabelados.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {mov.complementosTabelados.map((comp: any, cidx: number) => (
                                <p key={cidx} className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-800">
                                  <span className="font-semibold">{comp.nome}:</span> {comp.valor}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
