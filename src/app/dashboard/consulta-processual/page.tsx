"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { 
  Search, 
  Loader2, 
  Scale, 
  Clock, 
  FileText, 
  AlertCircle,
  Building2,
  Calendar,
  Briefcase,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

export default function ConsultaProcessualPage() {
  const [npu, setNpu] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const initialNpu = params.get("npu");
      if (initialNpu) {
        const cleanNpu = initialNpu.replace(/\D/g, "");
        
        // Format as NNNNNNN-DD.AAAA.J.TR.OOOO
        let formatted = cleanNpu;
        if (cleanNpu.length > 7) formatted = cleanNpu.substring(0, 7) + "-" + cleanNpu.substring(7);
        if (cleanNpu.length > 9) formatted = formatted.substring(0, 10) + "." + formatted.substring(10);
        if (cleanNpu.length > 13) formatted = formatted.substring(0, 15) + "." + formatted.substring(15);
        if (cleanNpu.length > 14) formatted = formatted.substring(0, 17) + "." + formatted.substring(17);
        if (cleanNpu.length > 16) formatted = formatted.substring(0, 20) + "." + formatted.substring(20);
        setNpu(formatted);

        if (cleanNpu.length === 20) {
          const runSearch = async () => {
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
          runSearch();
        }
      }
    }
  }, []);

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
      return format(parseISO(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-sky-200">
      
      {/* Navbar / Header */}
      <header className="px-8 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-[#FDFDFD]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 text-sm font-medium">
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div className="w-px h-4 bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-sky-700" />
            <h1 className="text-lg font-semibold tracking-tight text-slate-800">Consulta Pública Integrada</h1>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center min-h-[calc(100vh-80px)]">
        
        {/* Search Header Container - Transitions up when result is present */}
        <div className={`w-full max-w-3xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${result || loading || error ? 'mb-12 scale-100' : 'mt-[15vh] scale-105'}`}>
          {!result && !loading && !error && (
             <div className="text-center mb-10 opacity-100 animate-in fade-in slide-in-from-bottom-4 duration-1000">
               <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                 Dossiê Processual
               </h2>
               <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
                 Consulte dados públicos do Judiciário em tempo real utilizando a base oficial do CNJ.
               </p>
             </div>
          )}

          <form 
            onSubmit={handleSearch} 
            className="flex items-center w-full shadow-2xl shadow-sky-900/5 rounded-2xl bg-white border border-slate-200/60 focus-within:ring-4 focus-within:ring-sky-500/20 focus-within:border-sky-300 transition-all duration-300 p-2"
          >
            <div className="pl-4 text-slate-400 shrink-0">
              <Search className="w-6 h-6" />
            </div>
            <input
              type="text"
              placeholder="0000000-00.0000.0.00.0000"
              value={npu}
              onChange={handleNpuChange}
              disabled={loading}
              className="flex-1 bg-transparent text-xl sm:text-2xl tracking-[0.05em] py-4 px-4 outline-none text-slate-800 placeholder:text-slate-300 font-medium min-w-0"
            />
            <button 
              type="submit" 
              disabled={loading || npu.replace(/\D/g, "").length !== 20}
              className="bg-slate-900 hover:bg-sky-700 disabled:bg-slate-100 disabled:text-slate-400 text-white px-8 py-4 rounded-xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center min-w-[120px] self-stretch shrink-0"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Buscar"}
            </button>
          </form>

          {error && (
            <div className="mt-8 p-6 bg-red-50/50 border border-red-100 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="p-3 bg-red-100 rounded-full text-red-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-red-900 font-bold text-lg">Consulta Indisponível</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="w-full max-w-5xl flex gap-8 animate-pulse mt-8">
            <div className="w-1/3 space-y-4">
              <div className="h-40 bg-slate-100 rounded-2xl"></div>
              <div className="h-60 bg-slate-100 rounded-2xl"></div>
            </div>
            <div className="w-2/3 space-y-6">
              <div className="h-10 bg-slate-100 rounded-lg w-1/2"></div>
              <div className="h-24 bg-slate-100 rounded-2xl"></div>
              <div className="h-24 bg-slate-100 rounded-2xl"></div>
              <div className="h-24 bg-slate-100 rounded-2xl"></div>
            </div>
          </div>
        )}

        {/* Results View - Editorial Layout */}
        {result && !loading && (
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Sidebar Summary */}
            <div className="md:col-span-4 space-y-8">
              <div className="pb-8 border-b border-slate-100">
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Processo Nº</p>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">
                  {npu}
                </h2>
                <div className="mt-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-md border border-sky-100">
                    {result.formato?.nome || "Eletrônico"}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-md">
                    {result.sistema?.nome || "PJe"}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <Briefcase className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Classe</p>
                    <p className="text-sm font-semibold text-slate-800 mt-1">{result.classe?.nome || "Não informada"}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Building2 className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Órgão Julgador</p>
                    <p className="text-sm font-semibold text-slate-800 mt-1 leading-snug">{result.orgaoJulgador?.nome || "Não informado"}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Calendar className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Autuação</p>
                    <p className="text-sm font-semibold text-slate-800 mt-1">{formatDate(result.dataAjuizamento)}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Scale className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tribunal</p>
                    <p className="text-sm font-semibold text-slate-800 mt-1">{result.tribunal || "Não informado"}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <FileText className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Instância / Grau</p>
                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {result.grau === "G1" ? "1ª Instância (Grau 1)" : result.grau === "G2" ? "2ª Instância (Grau 2)" : result.grau || "Não informado"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Última Atualização CNJ</p>
                    <p className="text-sm font-semibold text-slate-800 mt-1">{formatDate(result.dataHoraUltimaAtualizacao)}</p>
                  </div>
                </div>
              </div>

              {result.assuntos && result.assuntos.length > 0 && (
                <div className="pt-8 border-t border-slate-100">
                   <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Assuntos</p>
                   <div className="flex flex-wrap gap-2">
                     {result.assuntos.map((assunto: any, idx: number) => (
                       <span key={idx} className="bg-slate-50 text-slate-600 border border-slate-200 text-xs px-3 py-1.5 rounded-full font-medium">
                         {assunto.nome}
                       </span>
                     ))}
                   </div>
                </div>
              )}
            </div>

            {/* Main Timeline */}
            <div className="md:col-span-8">
               <h3 className="text-2xl font-extrabold text-slate-900 mb-10 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-sky-600" />
                  Linha do Tempo
               </h3>

               {(!result.movimentos || result.movimentos.length === 0) ? (
                  <p className="text-slate-500 italic">O processo não possui movimentações registradas publicamente.</p>
               ) : (
                  <div className="relative border-l-2 border-slate-100 ml-4 pb-12">
                    {result.movimentos
                      .sort((a: any, b: any) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())
                      .map((mov: any, idx: number) => (
                        <div key={idx} className="mb-10 relative pl-8 group">
                          {/* Timeline Node */}
                          <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm ${idx === 0 ? 'bg-sky-500 scale-125' : 'bg-slate-300 group-hover:bg-slate-400 transition-colors'}`}></div>
                          
                          {/* Date label */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-bold tracking-wider uppercase ${idx === 0 ? 'text-sky-600' : 'text-slate-400'}`}>
                              {formatDate(mov.dataHora)}
                            </span>
                            {idx === 0 && <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Mais Recente</span>}
                          </div>
                          
                          {/* Content */}
                          <div className={`p-5 rounded-2xl border ${idx === 0 ? 'border-sky-100 bg-sky-50/30' : 'border-slate-100 bg-white shadow-sm shadow-slate-100/50'}`}>
                            <p className={`font-semibold ${idx === 0 ? 'text-lg text-slate-900' : 'text-base text-slate-800'}`}>
                              {mov.nome}
                            </p>
                            
                            {mov.complementosTabelados && mov.complementosTabelados.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-slate-100/80 space-y-2">
                                {mov.complementosTabelados.map((comp: any, cidx: number) => (
                                  <div key={cidx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider min-w-[100px]">{comp.nome}:</span> 
                                    <span className="text-sm font-medium text-slate-700">{comp.valor}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                    ))}
                  </div>
               )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
