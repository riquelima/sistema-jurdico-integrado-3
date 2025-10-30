"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Home,
  CheckCircle2,
  Circle,
  Upload,
  FileText,
  Calendar,
  AlertTriangle,
  Save,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const WORKFLOW_STEPS = [
  {
    id: 1,
    title: "Cadastro",
    description: "Informações de cadastro",
  },
  {
    id: 2,
    title: "Emitir Certidões",
    description: "Emissão de documentos",
  },
  {
    id: 3,
    title: "Fazer/Analisar Contrato",
    description: "Elaboração e análise contratual",
  },
  {
    id: 4,
    title: "Assinatura de Contrato",
    description: "Coleta de assinaturas",
  },
  {
    id: 5,
    title: "Escritura",
    description: "Prazos para escritura e pagamentos",
  },
  {
    id: 6,
    title: "Cobrar Matrícula do Cartório",
    description: "Finalização do processo",
  },
];

export default function CompraVendaDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepNotes, setStepNotes] = useState<{ [key: number]: string }>({});
  const [uploading, setUploading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [status, setStatus] = useState("Em Andamento");
  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState(true);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [stepDialogOpen, setStepDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");
  const [pendingStep, setPendingStep] = useState(0);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/compra-venda-imoveis?id=${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setProperty(null);
          return;
        }
        throw new Error("Erro ao buscar transação");
      }
      
      const data = await response.json();
      setProperty(data);
      setCurrentStep(data.currentStep || 1);
      setStatus(data.status || "Em Andamento");
      if (data.stepNotes) {
        try {
          setStepNotes(JSON.parse(data.stepNotes));
        } catch (e) {
          setStepNotes({});
        }
      }
      if (data.completedSteps) {
        try {
          setCompletedSteps(JSON.parse(data.completedSteps));
        } catch (e) {
          setCompletedSteps([]);
        }
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      toast.error("Erro ao carregar dados da transação");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setPendingStatus(newStatus);
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    try {
      const response = await fetch(`/api/compra-venda-imoveis?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: pendingStatus }),
      });

      if (response.ok) {
        setStatus(pendingStatus);
        toast.success("Status atualizado com sucesso");
        setStatusDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const handleStepChange = async (step: number) => {
    setPendingStep(step);
    setStepDialogOpen(true);
  };

  const confirmStepChange = async () => {
    try {
      const response = await fetch(`/api/compra-venda-imoveis?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentStep: pendingStep,
        }),
      });

      if (response.ok) {
        setCurrentStep(pendingStep);
        toast.success("Etapa atualizada com sucesso");
        setStepDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating step:", error);
      toast.error("Erro ao atualizar etapa");
    }
  };

  const toggleStepCompletion = async (stepId: number) => {
    const newCompletedSteps = completedSteps.includes(stepId)
      ? completedSteps.filter(s => s !== stepId)
      : [...completedSteps, stepId];
    
    setCompletedSteps(newCompletedSteps);

    try {
      await fetch(`/api/compra-venda-imoveis?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completedSteps: JSON.stringify(newCompletedSteps),
        }),
      });
      toast.success(completedSteps.includes(stepId) ? "Etapa desmarcada" : "Etapa concluída!");
    } catch (error) {
      console.error("Error updating completed steps:", error);
      toast.error("Erro ao atualizar etapa");
    }
  };

  const handleNotesChange = async (step: number, notes: string) => {
    const updatedNotes = { ...stepNotes, [step]: notes };
    setStepNotes(updatedNotes);

    try {
      await fetch(`/api/compra-venda-imoveis?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepNotes: JSON.stringify(updatedNotes),
        }),
      });
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("entityType", "compra-venda");
    formData.append("entityId", id);
    formData.append("fieldName", fieldName);

    try {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Documento enviado com sucesso");
        fetchProperty();
      } else {
        toast.error("Erro ao enviar documento");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Erro ao enviar documento");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/compra-venda-imoveis?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Transação excluída com sucesso");
        router.push("/dashboard/compra-venda");
      } else {
        toast.error("Erro ao excluir transação");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Erro ao excluir transação");
    }
  };

  const getDaysUntil = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineColor = (days: number | null) => {
    if (days === null) return "";
    if (days < 0) return "text-red-600 dark:text-red-400";
    if (days <= 7) return "text-orange-600 dark:text-orange-400";
    return "text-green-600 dark:text-green-400";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/compra-venda">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Home className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Transação não encontrada</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const daysUntilSinal = getDaysUntil(property.prazoSinal);
  const daysUntilEscritura = getDaysUntil(property.prazoEscritura);

  // Parse sellers data
  let sellers = [];
  try {
    sellers = property.sellers ? JSON.parse(property.sellers) : [];
  } catch (e) {
    sellers = [];
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/compra-venda">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              {property.enderecoImovel || "Transação Imobiliária"}
            </h1>
            <p className="text-muted-foreground">
              Matrícula: {property.numeroMatricula || "N/A"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={
              property.status === "Finalizado"
                ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
                : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
            }
          >
            {status}
          </Badge>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar mudança de status</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja alterar o status para "{pendingStatus}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Step Change Confirmation Dialog */}
      <AlertDialog open={stepDialogOpen} onOpenChange={setStepDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar mudança de etapa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja ir para a etapa {pendingStep}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStepChange}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Collapsible Details Section */}
          <Card>
            <CardHeader 
              className="cursor-pointer hover:bg-muted transition-colors"
              onClick={() => setIsDetailsCollapsed(!isDetailsCollapsed)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Detalhes da Transação</CardTitle>
                {isDetailsCollapsed ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            {!isDetailsCollapsed && (
              <CardContent className="space-y-6 pt-0">
                {/* Property Info */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Informações da Transação</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Endereço</p>
                      <p className="font-medium">{property.enderecoImovel || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Matrícula</p>
                      <p className="font-medium">{property.numeroMatricula || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cadastro Contribuinte</p>
                      <p className="font-medium">{property.cadastroContribuinte || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">RNM Comprador</p>
                      <p className="font-medium">{property.rnmComprador || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CPF Comprador</p>
                      <p className="font-medium">{property.cpfComprador || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Endereço Comprador</p>
                      <p className="font-medium">{property.enderecoComprador || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Deadlines */}
                {(property.prazoSinal || property.prazoEscritura) && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Prazos Importantes
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      {property.prazoSinal && (
                        <div className="flex items-start gap-3">
                          {daysUntilSinal !== null && daysUntilSinal <= 7 && (
                            <AlertTriangle className="h-5 w-5 text-orange-600 mt-1" />
                          )}
                          <div>
                            <p className="text-sm text-muted-foreground">Prazo para Sinal</p>
                            <p
                              className={`text-lg font-semibold ${getDeadlineColor(
                                daysUntilSinal
                              )}`}
                            >
                              {new Date(property.prazoSinal).toLocaleDateString("pt-BR")}
                              {daysUntilSinal !== null && (
                                <span className="text-sm ml-2">
                                  ({daysUntilSinal > 0 ? `${daysUntilSinal} dias` : "Vencido"})
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                      {property.prazoEscritura && (
                        <div className="flex items-start gap-3">
                          {daysUntilEscritura !== null && daysUntilEscritura <= 7 && (
                            <AlertTriangle className="h-5 w-5 text-orange-600 mt-1" />
                          )}
                          <div>
                            <p className="text-sm text-muted-foreground">Prazo para Escritura</p>
                            <p
                              className={`text-lg font-semibold ${getDeadlineColor(
                                daysUntilEscritura
                              )}`}
                            >
                              {new Date(property.prazoEscritura).toLocaleDateString("pt-BR")}
                              {daysUntilEscritura !== null && (
                                <span className="text-sm ml-2">
                                  ({daysUntilEscritura > 0 ? `${daysUntilEscritura} dias` : "Vencido"})
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Contract Notes */}
                {property.contractNotes && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Observações do Contrato
                    </h4>
                    <p className="text-sm whitespace-pre-wrap">{property.contractNotes}</p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Workflow Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Fluxo de Trabalho</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Steps Progress */}
              <div className="flex flex-wrap gap-2">
                {WORKFLOW_STEPS.map((step) => (
                  <Button
                    key={step.id}
                    variant={currentStep === step.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStepChange(step.id)}
                    className="flex items-center gap-2"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStepCompletion(step.id);
                      }}
                      className="flex items-center"
                    >
                      {completedSteps.includes(step.id) ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </button>
                    <span>Etapa {step.id}</span>
                  </Button>
                ))}
              </div>

              {/* Current Step Details */}
              <div className="border-t pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      Etapa {currentStep}: {WORKFLOW_STEPS[currentStep - 1].title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {WORKFLOW_STEPS[currentStep - 1].description}
                    </p>
                  </div>

                  {/* Step Content */}
                  <div className="space-y-4 mt-6">
                    {/* Step 1: Cadastro */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg">Matrícula do Imóvel</h4>
                          <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                            <div>
                              <p className="text-xs text-muted-foreground">Nº Matrícula</p>
                              <p className="text-sm font-medium">{property.numeroMatricula || "-"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Cadastro Contribuinte</p>
                              <p className="text-sm font-medium">{property.cadastroContribuinte || "-"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Endereço do Imóvel</p>
                              <p className="text-sm font-medium">{property.enderecoImovel || "-"}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg">Informações dos Vendedores</h4>
                          {sellers.length > 0 ? (
                            <div className="space-y-3">
                              {sellers.map((seller: any, index: number) => (
                                <div key={index} className="p-4 bg-muted rounded-lg">
                                  <p className="text-sm font-semibold mb-3">Vendedor {index + 1}</p>
                                  <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                      <p className="text-xs text-muted-foreground">RG ou CNH</p>
                                      <p className="text-sm font-medium">{seller.rg || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">CPF</p>
                                      <p className="text-sm font-medium">{seller.cpf || "-"}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Data de Nascimento</p>
                                      <p className="text-sm font-medium">
                                        {seller.dataNascimento 
                                          ? new Date(seller.dataNascimento).toLocaleDateString("pt-BR")
                                          : "-"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Nenhum vendedor cadastrado</p>
                          )}
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg">Informações do Comprador</h4>
                          <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                            <div>
                              <p className="text-xs text-muted-foreground">RNM Comprador</p>
                              <p className="text-sm font-medium">{property.rnmComprador || "-"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">CPF Comprador</p>
                              <p className="text-sm font-medium">{property.cpfComprador || "-"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Endereço Comprador</p>
                              <p className="text-sm font-medium">{property.enderecoComprador || "-"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Emitir Certidões */}
                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="certidoes-upload">Upload de Certidões</Label>
                          <Input
                            id="certidoes-upload"
                            type="file"
                            onChange={(e) => handleFileUpload(e, "certidoes")}
                            disabled={uploading}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 3: Fazer/Analisar Contrato */}
                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="contrato-upload">Upload do Contrato</Label>
                          <Input
                            id="contrato-upload"
                            type="file"
                            onChange={(e) => handleFileUpload(e, "contrato")}
                            disabled={uploading}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contract-notes">Observações do Contrato</Label>
                          <Textarea
                            id="contract-notes"
                            placeholder="Adicione observações importantes sobre o contrato..."
                            value={property.contractNotes || ""}
                            className="mt-2"
                            rows={4}
                            disabled
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Edite no formulário principal
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Assinatura de Contrato */}
                    {currentStep === 4 && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="contrato-assinado-upload">
                            Upload do Contrato Assinado
                          </Label>
                          <Input
                            id="contrato-assinado-upload"
                            type="file"
                            onChange={(e) => handleFileUpload(e, "contrato-assinado")}
                            disabled={uploading}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 5: Escritura */}
                    {currentStep === 5 && (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                          <div>
                            <p className="text-xs text-muted-foreground">Prazo para Sinal</p>
                            <p className="text-sm font-medium">
                              {property.prazoSinal
                                ? new Date(property.prazoSinal).toLocaleDateString("pt-BR")
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Prazo para Escritura</p>
                            <p className="text-sm font-medium">
                              {property.prazoEscritura
                                ? new Date(property.prazoEscritura).toLocaleDateString("pt-BR")
                                : "-"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="escritura-upload">Upload da Escritura</Label>
                          <Input
                            id="escritura-upload"
                            type="file"
                            onChange={(e) => handleFileUpload(e, "escritura")}
                            disabled={uploading}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 6: Cobrar Matrícula */}
                    {currentStep === 6 && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="matricula-cartorio-upload">
                            Upload da Matrícula do Cartório
                          </Label>
                          <Input
                            id="matricula-cartorio-upload"
                            type="file"
                            onChange={(e) => handleFileUpload(e, "matricula-cartorio")}
                            disabled={uploading}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    )}

                    {/* Notes for current step */}
                    <div className="mt-6">
                      <Label htmlFor="step-notes">Notas da Etapa {currentStep}</Label>
                      <Textarea
                        id="step-notes"
                        placeholder="Adicione notas sobre esta etapa..."
                        value={stepNotes[currentStep] || ""}
                        onChange={(e) => handleNotesChange(currentStep, e.target.value)}
                        className="mt-2"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => handleStepChange(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Etapa Anterior
            </Button>
            <Button
              onClick={() =>
                handleStepChange(Math.min(WORKFLOW_STEPS.length, currentStep + 1))
              }
              disabled={currentStep === WORKFLOW_STEPS.length}
            >
              Próxima Etapa
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status da Transação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Aguardando">Aguardando</SelectItem>
                    <SelectItem value="Finalizado">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Etapa Atual</Label>
                <div className="text-2xl font-bold">{currentStep}</div>
                <p className="text-xs text-muted-foreground">
                  de {WORKFLOW_STEPS.length} etapas
                </p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Criado em</p>
                <p className="text-sm font-medium">
                  {new Date(property.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Última atualização</p>
                <p className="text-sm font-medium">
                  {new Date(property.updatedAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}