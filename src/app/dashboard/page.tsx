"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Briefcase, AlertCircle, Home, Globe, Bell, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    acoesCiveis: 0,
    acoesTrabalhistas: 0,
    acoesCriminais: 0,
    compraVenda: 0,
    perdaNacionalidade: 0,
    vistos: 0,
  });
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          acoesCiveisRes,
          acoesTrabalhistasRes,
          acoesCriminaisRes,
          compraVendaRes,
          perdaNacionalidadeRes,
          vistosRes,
          alertsRes,
        ] = await Promise.all([
          fetch("/api/acoes-civeis?limit=1000"),
          fetch("/api/acoes-trabalhistas?limit=1000"),
          fetch("/api/acoes-criminais?limit=1000"),
          fetch("/api/compra-venda-imoveis?limit=1000"),
          fetch("/api/perda-nacionalidade?limit=1000"),
          fetch("/api/vistos?limit=1000"),
          fetch("/api/alerts?isRead=false&limit=10"),
        ]);

        const [
          acoesCiveis,
          acoesTrabalhistas,
          acoesCriminais,
          compraVenda,
          perdaNacionalidade,
          vistos,
          alertsData,
        ] = await Promise.all([
          acoesCiveisRes.json(),
          acoesTrabalhistasRes.json(),
          acoesCriminaisRes.json(),
          compraVendaRes.json(),
          perdaNacionalidadeRes.json(),
          vistosRes.json(),
          alertsRes.json(),
        ]);

        setStats({
          acoesCiveis: acoesCiveis.length,
          acoesTrabalhistas: acoesTrabalhistas.length,
          acoesCriminais: acoesCriminais.length,
          compraVenda: compraVenda.length,
          perdaNacionalidade: perdaNacionalidade.length,
          vistos: vistos.length,
        });

        setAlerts(alertsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const modules = [
    {
      title: "Ações Cíveis",
      count: stats.acoesCiveis,
      icon: FileText,
      href: "/dashboard/acoes-civeis",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      hoverBorder: "hover:border-blue-400",
    },
    {
      title: "Ações Trabalhistas",
      count: stats.acoesTrabalhistas,
      icon: Briefcase,
      href: "/dashboard/acoes-trabalhistas",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      hoverBorder: "hover:border-purple-400",
    },
    {
      title: "Ações Criminais",
      count: stats.acoesCriminais,
      icon: AlertCircle,
      href: "/dashboard/acoes-criminais",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      hoverBorder: "hover:border-red-400",
    },
    {
      title: "Compra e Venda",
      count: stats.compraVenda,
      icon: Home,
      href: "/dashboard/compra-venda",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      hoverBorder: "hover:border-emerald-400",
    },
    {
      title: "Perda de Nacionalidade",
      count: stats.perdaNacionalidade,
      icon: Globe,
      href: "/dashboard/perda-nacionalidade",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      hoverBorder: "hover:border-orange-400",
    },
    {
      title: "Vistos",
      count: stats.vistos,
      icon: Globe,
      href: "/dashboard/vistos",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      hoverBorder: "hover:border-cyan-400",
    },
  ];

  const totalProcessos = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-slate-100 p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 shadow-xl border border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-slate-300 text-lg">Visão geral do sistema jurídico</p>
          </div>
          <div className="bg-amber-500 p-6 rounded-2xl shadow-xl">
            <div className="text-center">
              <p className="text-slate-900 text-sm font-semibold mb-1">Total de Processos</p>
              <p className="text-slate-900 text-4xl font-bold">{loading ? "..." : totalProcessos}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Link key={module.href} href={module.href}>
            <Card className={`bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 ${module.borderColor} ${module.hoverBorder} h-full`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold text-slate-800">
                    {module.title}
                  </CardTitle>
                  <div className={`p-3 rounded-xl ${module.bgColor}`}>
                    <module.icon className={`h-6 w-6 ${module.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-12 w-24 bg-slate-200" />
                ) : (
                  <div className="space-y-2">
                    <div className={`text-4xl font-bold ${module.color}`}>
                      {module.count}
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-slate-500" />
                      <p className="text-sm text-slate-600 font-medium">
                        processos ativos
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Alerts Section */}
      <Card className="bg-white border-2 border-slate-200 shadow-xl">
        <CardHeader className="bg-slate-50 border-b-2 border-slate-200">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-3 rounded-xl bg-amber-500 shadow-lg">
              <Bell className="h-6 w-6 text-slate-900" />
            </div>
            <span className="text-slate-900 font-bold">
              Alertas Recentes
            </span>
            {alerts.length > 0 && (
              <Badge className="bg-red-600 text-white border-0 shadow-md px-3 py-1 text-sm">
                {alerts.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full bg-slate-200" />
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-600 mb-4 shadow-xl">
                <Bell className="h-10 w-10 text-white" />
              </div>
              <p className="text-lg text-slate-600 font-medium">
                Nenhum alerta pendente
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Todos os alertas foram processados
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 p-5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all duration-300 border-l-4 border-amber-500 shadow-md hover:shadow-lg"
                >
                  <div className="p-3 rounded-xl bg-amber-500 shadow-md flex-shrink-0">
                    <Bell className="h-5 w-5 text-slate-900" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <p className="text-sm font-semibold text-slate-900 leading-relaxed">{alert.message}</p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className="text-xs bg-slate-800 text-white border-0 px-3 py-1">
                        {alert.alertFor}
                      </Badge>
                      <Badge className="text-xs bg-slate-600 text-white border-0 px-3 py-1">
                        {alert.moduleType}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}