"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Globe, Eye, Plane, Briefcase, Building2, Clock, CheckCircle2, AlertCircle, FileText, CreditCard } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingState } from "@/components/loading-state";
import { useDataCache } from "@/hooks/useDataCache";
import { usePrefetch } from "@/hooks/usePrefetch";
import { OptimizedLink } from "@/components/optimized-link";
import { prefetchVistoById } from "@/utils/prefetch-functions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Visto {
  id: string;
  clientName: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  cpf?: string;
  rnm?: string;
  passaporte?: string;
}

export default function VistosPage() {
  const { data: vistosData, isLoading, error, refetch } = useDataCache(
    "vistos",
    async () => {
      const response = await fetch("/api/vistos?limit=100");
      return response.json();
    }
  );
  const vistos = Array.isArray(vistosData) ? vistosData : [];
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  useEffect(() => {
    // Prefetch disponível para navegação futura
  }, []);

  const filteredVistos = vistos.filter((v) => {
    const matchesSearch = v.clientName?.toLowerCase().includes(search.toLowerCase()) ?? false;
    const matchesType = typeFilter === "all" || v.type === typeFilter;
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: vistos.length,
    emAndamento: vistos.filter(v => v.status === "Em andamento").length,
    finalizado: vistos.filter(v => v.status === "Finalizado").length,
    aguardando: vistos.filter(v => v.status === "Aguardando").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em andamento":
        return "bg-blue-500 text-white hover:bg-blue-600";
      case "Finalizado":
        return "bg-emerald-500 text-white hover:bg-emerald-600";
      case "Aguardando":
        return "bg-amber-500 text-white hover:bg-amber-600";
      default:
        return "bg-slate-500 text-white hover:bg-slate-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Turismo":
        return <Plane className="h-6 w-6 text-white" />;
      case "Trabalho":
        return <Briefcase className="h-6 w-6 text-white" />;
      case "Investidor":
        return <Building2 className="h-6 w-6 text-white" />;
      default:
        return <Globe className="h-6 w-6 text-white" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Em andamento":
        return <Clock className="h-4 w-4" />;
      case "Finalizado":
        return <CheckCircle2 className="h-4 w-4" />;
      case "Aguardando":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl p-8 shadow-lg border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500 rounded-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Vistos</h1>
                <p className="text-slate-300 mt-1">
                  Gerencie processos de vistos internacionais
                </p>
              </div>
            </div>
          </div>
          <Link href="/dashboard/vistos/novo">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold shadow-lg">
              <Plus className="h-5 w-5 mr-2" />
              Novo Visto
            </Button>
          </Link>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total de Processos</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-slate-700 rounded-lg">
                <CreditCard className="h-6 w-6 text-slate-300" />
              </div>
            </div>
          </div>

          <div className="bg-blue-900 rounded-lg p-4 border border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Em andamento</p>
                <p className="text-3xl font-bold text-blue-400 mt-1">{stats.emAndamento}</p>
              </div>
              <div className="p-3 bg-blue-800 rounded-lg">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-amber-900 rounded-lg p-4 border border-amber-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-300 text-sm font-medium">Aguardando</p>
                <p className="text-3xl font-bold text-amber-400 mt-1">{stats.aguardando}</p>
              </div>
              <div className="p-3 bg-amber-800 rounded-lg">
                <AlertCircle className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </div>

          <div className="bg-emerald-900 rounded-lg p-4 border border-emerald-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm font-medium">Aprovados</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">{stats.aprovado}</p>
              </div>
              <div className="p-3 bg-emerald-800 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <Card className="border-slate-200 dark:border-slate-700 shadow-md">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Search className="h-5 w-5 text-amber-500" />
            Filtros de Busca
          </h2>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-slate-300 dark:border-slate-600 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="border-slate-300 dark:border-slate-600 focus:border-amber-500 focus:ring-amber-500">
                <SelectValue placeholder="Tipo de visto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="Turismo">Turismo</SelectItem>
                <SelectItem value="Trabalho">Trabalho</SelectItem>
                <SelectItem value="Investidor">Investidor</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-slate-300 dark:border-slate-600 focus:border-amber-500 focus:ring-amber-500">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Em andamento">Em andamento</SelectItem>
                <SelectItem value="Finalizado">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de processos */}
      <div className="grid gap-4">
        {isLoading ? (
          <LoadingState count={3} type="card" />
        ) : filteredVistos.length === 0 ? (
          <Card className="border-slate-200 dark:border-slate-700 shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                <Globe className="h-12 w-12 text-slate-400" />
              </div>
              <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Nenhum visto encontrado
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 mt-2">
                {search || typeFilter !== "all" || statusFilter !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Comece criando um novo processo de visto"}
              </p>
              <Link href="/dashboard/vistos/novo">
                <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Visto
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredVistos.map((visto) => (
            <Card 
              key={visto.id} 
              className="border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-amber-500/50 transition-all duration-200 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Ícone do processo */}
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-md flex-shrink-0">
                      {getTypeIcon(visto.type)}
                    </div>

                    {/* Informações do processo */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {visto.clientName}
                        </h3>
                        <Badge className={`${getStatusColor(visto.status)} flex items-center gap-1.5 px-3 py-1 shadow-md`}>
                          {getStatusIcon(visto.status)}
                          {visto.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm flex-wrap">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <div className="p-1.5 bg-purple-100 dark:bg-purple-900 rounded">
                            <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="font-medium">Tipo: {visto.type}</span>
                        </div>
                        
                        {visto.cpf && (
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <span className="font-semibold">CPF:</span>
                            <span>{visto.cpf}</span>
                          </div>
                        )}

                        {visto.rnm && (
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <span className="font-semibold">RNM:</span>
                            <span>{visto.rnm}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <div className="p-1.5 bg-slate-100 dark:bg-slate-700 rounded">
                            <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          </div>
                          <span>
                            {new Date(visto.createdAt).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Barra de progresso */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400 font-medium">Progresso do Processo</span>
                          <span className="text-slate-700 dark:text-slate-300 font-semibold">
                            {visto.status === "Finalizado" ? "100%" : visto.status === "Em Andamento" ? "50%" : "25%"}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              visto.status === "Finalizado" 
                                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 w-full" 
                                : visto.status === "Em Andamento"
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 w-1/2"
                                : "bg-gradient-to-r from-amber-500 to-amber-600 w-1/4"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botão de ação */}
                  <OptimizedLink 
                    href={`/dashboard/vistos/${visto.id}`}
                    prefetchData={() => prefetchVistoById(visto.id)}
                  >
                    <Button 
                      size="lg"
                      className="bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-900 text-white font-semibold shadow-md"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </OptimizedLink>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}