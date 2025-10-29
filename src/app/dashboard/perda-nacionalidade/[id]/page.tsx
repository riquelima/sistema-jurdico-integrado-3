"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, Circle, Save, Trash2, FileUp, ChevronDown, ChevronUp, Edit2, Upload } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const WORKFLOW_STEPS = [
  "Cadastro dos Documentos",
  "Fazer Procuração e Pedido de Perda (JESSICA)",
  "Enviar Procuração e Pedido - Cobrar Assinaturas (JESSICA → FANG)",
  "Protocolar com Procuração e Acordo Assinados (JESSICA)",
  "Exigências do Juiz",
  "Processo Deferido - Enviar DOU e Solicitar Passaporte Chinês (JESSICA)",
  "Protocolar Exigência com Passaporte Chinês - Aguardar Portaria (JESSICA)",
  "Processo Ratificado (Finalizado)",
];

export default function PerdaNacionalidadeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Em Andamento");
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({});
  const [stepDialogOpen, setStepDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [pendingStep, setPendingStep] = useState(0);
  
  // Step data states
  const [stepData, setStepData] = useState({
    // Step 0 - Documents
    rnmMae: "",
    rnmMaeFile: "",
    rnmPai: "",
    rnmPaiFile: "",
    cpfMae: "",
    cpfPai: "",
    certidaoNascimento: "",
    certidaoNascimentoFile: "",
    comprovanteEndereco: "",
    comprovanteEnderecoFile: "",
    passaportes: "",
    passaportesFile: "",
    documentoChines: "",
    documentoChinesFile: "",
    traducaoJuramentada: "",
    traducaoJuramentadaFile: "",
    // Step 1 - Procuração e Pedido
    procuracaoPedido: "",
    procuracaoPedidoFile: "",
    // Step 2 - Envio e Assinaturas
    procuracaoAssinada: "",
    procuracaoAssinadaFile: "",
    // Step 3 - Protocolo
    protocoloAnexado: "",
    numeroProtocolo: "",
    protocoloAnexadoFile: "",
    // Step 4 - Exigências
    exigenciasJuiz: "",
    exigenciasJuizFile: "",
    // Step 5 - Deferido
    douEnviado: "",
    douEnviadoFile: "",
    passaporteChinesSolicitado: "",
    // Step 6 - Manifesto
    manifestoProtocolado: "",
    manifestoProtocoladoFile: "",
    passaporteChinesAnexado: "",
    passaporteChinesAnexadoFile: "",
    // Step 7 - Ratificado
    portariaFinal: "",
    portariaFinalFile: "",
    douRatificado: "",
    douRatificadoFile: "",
  });

  useEffect(() => {
    fetchCase();
  }, [params.id]);

  const fetchCase = async () => {
    try {
      const response = await fetch(`/api/perda-nacionalidade?id=${params.id}`);
      const data = await response.json();
      setCaseData(data);
      setNotes(data.notes || "");
      setStatus(data.status);
      
      // Populate step data from database
      setStepData({
        rnmMae: data.rnmMae || "",
        rnmMaeFile: data.rnmMaeFile || "",
        rnmPai: data.rnmPai || "",
        rnmPaiFile: data.rnmPaiFile || "",
        cpfMae: data.cpfMae || "",
        cpfPai: data.cpfPai || "",
        certidaoNascimento: data.certidaoNascimento || "",
        certidaoNascimentoFile: data.certidaoNascimentoFile || "",
        comprovanteEndereco: data.comprovanteEndereco || "",
        comprovanteEnderecoFile: data.comprovanteEnderecoFile || "",
        passaportes: data.passaportes || "",
        passaportesFile: data.passaportesFile || "",
        documentoChines: data.documentoChines || "",
        documentoChinesFile: data.documentoChinesFile || "",
        traducaoJuramentada: data.traducaoJuramentada || "",
        traducaoJuramentadaFile: data.traducaoJuramentadaFile || "",
        procuracaoPedido: data.procuracaoPedido || "",
        procuracaoPedidoFile: data.procuracaoPedidoFile || "",
        procuracaoAssinada: data.procuracaoAssinada || "",
        procuracaoAssinadaFile: data.procuracaoAssinadaFile || "",
        protocoloAnexado: data.protocoloAnexado || "",
        numeroProtocolo: data.numeroProtocolo || "",
        protocoloAnexadoFile: data.protocoloAnexadoFile || "",
        exigenciasJuiz: data.exigenciasJuiz || "",
        exigenciasJuizFile: data.exigenciasJuizFile || "",
        douEnviado: data.douEnviado || "",
        douEnviadoFile: data.douEnviadoFile || "",
        passaporteChinesSolicitado: data.passaporteChinesSolicitado || "",
        manifestoProtocolado: data.manifestoProtocolado || "",
        manifestoProtocoladoFile: data.manifestoProtocoladoFile || "",
        passaporteChinesAnexado: data.passaporteChinesAnexado || "",
        passaporteChinesAnexadoFile: data.passaporteChinesAnexadoFile || "",
        portariaFinal: data.portariaFinal || "",
        portariaFinalFile: data.portariaFinalFile || "",
        douRatificado: data.douRatificado || "",
        douRatificadoFile: data.douRatificadoFile || "",
      });
    } catch (error) {
      console.error("Error fetching case:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFields(prev => ({ ...prev, [fieldName]: true }));
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caseId", params.id as string);
    formData.append("fieldName", fieldName);

    try {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setStepData(prev => ({ ...prev, [fieldName]: data.fileName }));
        
        await fetch(`/api/perda-nacionalidade?id=${params.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [fieldName]: data.fileName }),
        });
        
        alert("✅ Arquivo enviado e salvo com sucesso!");
        await fetchCase();
      } else {
        console.error("Erro no upload:", data);
        alert(
          `❌ Erro ao enviar arquivo:\n\n${data.error}\n\n${
            data.details ? `Detalhes: ${data.details}\n\n` : ""
          }${
            data.hint
              ? `💡 ${data.hint}\n\nConsulte o arquivo SUPABASE_STORAGE_POLICIES.md para configurar as políticas RLS do bucket.`
              : ""
          }`
        );
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(
        "❌ Erro ao enviar arquivo. Verifique:\n\n" +
        "1. Se o bucket 'juridico-documentos' existe no Supabase Storage\n" +
        "2. Se as políticas RLS estão configuradas (consulte SUPABASE_STORAGE_POLICIES.md)\n" +
        "3. Se as variáveis de ambiente estão corretas no arquivo .env\n\n" +
        "Erro: " + (error as Error).message
      );
    } finally {
      setUploadingFields(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleStepClick = async (stepIndex: number) => {
    if (expandedStep === stepIndex) {
      await handleSaveStepData(stepIndex, true);
      setExpandedStep(null);
    } else {
      setExpandedStep(stepIndex);
    }
  };

  const handleCompleteStep = async (stepIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setPendingStep(stepIndex);
    setStepDialogOpen(true);
  };

  const confirmStepChange = async () => {
    try {
      let newCurrentStep: number;
      
      if (pendingStep === caseData.currentStep) {
        newCurrentStep = pendingStep + 1;
      } else if (pendingStep < caseData.currentStep) {
        newCurrentStep = pendingStep;
      } else {
        setStepDialogOpen(false);
        return;
      }
      
      const response = await fetch(`/api/perda-nacionalidade?id=${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentStep: newCurrentStep }),
      });

      if (response.ok) {
        await fetchCase();
        if (pendingStep === caseData.currentStep) {
          alert("Passo marcado como concluído!");
        } else {
          alert("Passo marcado como atual!");
        }
        setStepDialogOpen(false);
      }
    } catch (error) {
      console.error("Error completing step:", error);
      alert("Erro ao marcar passo");
    }
  };

  const handleSaveStepData = async (stepIndex: number, silent = false) => {
    try {
      console.log("💾 Salvando dados no banco:", stepData);
      
      const response = await fetch(`/api/perda-nacionalidade?id=${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stepData),
      });

      if (response.ok) {
        const updated = await response.json();
        console.log("✅ Dados salvos com sucesso:", updated);
        
        if (!silent) {
          alert("Dados salvos com sucesso!");
        }
        await fetchCase();
      } else {
        const error = await response.json();
        console.error("❌ Erro ao salvar:", error);
        if (!silent) {
          alert("Erro ao salvar dados: " + (error.error || "Erro desconhecido"));
        }
      }
    } catch (error) {
      console.error("❌ Error saving step data:", error);
      if (!silent) {
        alert("Erro ao salvar dados: " + (error as Error).message);
      }
    }
  };

  const handleSaveNotes = async () => {
    setSaveDialogOpen(true);
  };

  const confirmSaveNotes = async () => {
    try {
      const response = await fetch(`/api/perda-nacionalidade?id=${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, status }),
      });

      if (response.ok) {
        alert("Informações atualizadas com sucesso!");
        await fetchCase();
        setSaveDialogOpen(false);
      }
    } catch (error) {
      console.error("Error saving notes:", error);
      alert("Erro ao salvar informações");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/perda-nacionalidade?id=${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/dashboard/perda-nacionalidade");
      }
    } catch (error) {
      console.error("Error deleting case:", error);
      alert("Erro ao excluir ação");
    }
  };

  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Cadastro de Documentos
        return (
          <div className="space-y-4 mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-1 gap-4">
              {/* RNM Mãe */}
              <div className="space-y-2">
                <Label htmlFor="rnmMae">RNM Mãe</Label>
                <Input
                  id="rnmMae"
                  value={stepData.rnmMae}
                  onChange={(e) => setStepData({ ...stepData, rnmMae: e.target.value })}
                  placeholder="Digite o RNM da mãe"
                />
                <div className="flex items-center gap-2">
                  <Input
                    id="rnmMaeFile"
                    type="file"
                    onChange={(e) => handleFileUpload(e, "rnmMaeFile")}
                    disabled={uploadingFields.rnmMaeFile}
                    className="flex-1"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  {uploadingFields.rnmMaeFile && (
                    <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {stepData.rnmMaeFile && (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Arquivo anexado: {stepData.rnmMaeFile}
                  </p>
                )}
              </div>

              {/* RNM Pai */}
              <div className="space-y-2">
                <Label htmlFor="rnmPai">RNM Pai</Label>
                <Input
                  id="rnmPai"
                  value={stepData.rnmPai}
                  onChange={(e) => setStepData({ ...stepData, rnmPai: e.target.value })}
                  placeholder="Digite o RNM do pai"
                />
                <div className="flex items-center gap-2">
                  <Input
                    id="rnmPaiFile"
                    type="file"
                    onChange={(e) => handleFileUpload(e, "rnmPaiFile")}
                    disabled={uploadingFields.rnmPaiFile}
                    className="flex-1"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  {uploadingFields.rnmPaiFile && (
                    <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {stepData.rnmPaiFile && (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Arquivo anexado: {stepData.rnmPaiFile}
                  </p>
                )}
              </div>

              {/* CPF Mãe */}
              <div className="space-y-2">
                <Label htmlFor="cpfMae">CPF Mãe</Label>
                <Input
                  id="cpfMae"
                  value={stepData.cpfMae}
                  onChange={(e) => setStepData({ ...stepData, cpfMae: e.target.value })}
                  placeholder="Digite o CPF da mãe"
                />
              </div>

              {/* CPF Pai */}
              <div className="space-y-2">
                <Label htmlFor="cpfPai">CPF Pai</Label>
                <Input
                  id="cpfPai"
                  value={stepData.cpfPai}
                  onChange={(e) => setStepData({ ...stepData, cpfPai: e.target.value })}
                  placeholder="Digite o CPF do pai"
                />
              </div>

              {/* Certidão de Nascimento */}
              <div className="space-y-2">
                <Label htmlFor="certidaoNascimento">Certidão de Nascimento da Criança</Label>
                <Input
                  id="certidaoNascimento"
                  value={stepData.certidaoNascimento}
                  onChange={(e) => setStepData({ ...stepData, certidaoNascimento: e.target.value })}
                  placeholder="Número ou observações"
                />
                <div className="flex items-center gap-2">
                  <Input
                    id="certidaoNascimentoFile"
                    type="file"
                    onChange={(e) => handleFileUpload(e, "certidaoNascimentoFile")}
                    disabled={uploadingFields.certidaoNascimentoFile}
                    className="flex-1"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  {uploadingFields.certidaoNascimentoFile && (
                    <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {stepData.certidaoNascimentoFile && (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Arquivo anexado: {stepData.certidaoNascimentoFile}
                  </p>
                )}
              </div>

              {/* Comprovante de Endereço */}
              <div className="space-y-2">
                <Label htmlFor="comprovanteEndereco">Comprovante de Endereço</Label>
                <Input
                  id="comprovanteEndereco"
                  value={stepData.comprovanteEndereco}
                  onChange={(e) => setStepData({ ...stepData, comprovanteEndereco: e.target.value })}
                  placeholder="Observações"
                />
                <div className="flex items-center gap-2">
                  <Input
                    id="comprovanteEnderecoFile"
                    type="file"
                    onChange={(e) => handleFileUpload(e, "comprovanteEnderecoFile")}
                    disabled={uploadingFields.comprovanteEnderecoFile}
                    className="flex-1"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  {uploadingFields.comprovanteEnderecoFile && (
                    <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {stepData.comprovanteEnderecoFile && (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Arquivo anexado: {stepData.comprovanteEnderecoFile}
                  </p>
                )}
              </div>

              {/* Passaportes */}
              <div className="space-y-2">
                <Label htmlFor="passaportes">Passaportes</Label>
                <Input
                  id="passaportes"
                  value={stepData.passaportes}
                  onChange={(e) => setStepData({ ...stepData, passaportes: e.target.value })}
                  placeholder="Números dos passaportes"
                />
                <div className="flex items-center gap-2">
                  <Input
                    id="passaportesFile"
                    type="file"
                    onChange={(e) => handleFileUpload(e, "passaportesFile")}
                    disabled={uploadingFields.passaportesFile}
                    className="flex-1"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  {uploadingFields.passaportesFile && (
                    <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {stepData.passaportesFile && (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Arquivo anexado: {stepData.passaportesFile}
                  </p>
                )}
              </div>

              {/* Documento Chinês */}
              <div className="space-y-2">
                <Label htmlFor="documentoChines">Documento Chinês</Label>
                <Input
                  id="documentoChines"
                  value={stepData.documentoChines}
                  onChange={(e) => setStepData({ ...stepData, documentoChines: e.target.value })}
                  placeholder="Número ou observações"
                />
                <div className="flex items-center gap-2">
                  <Input
                    id="documentoChinesFile"
                    type="file"
                    onChange={(e) => handleFileUpload(e, "documentoChinesFile")}
                    disabled={uploadingFields.documentoChinesFile}
                    className="flex-1"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  {uploadingFields.documentoChinesFile && (
                    <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {stepData.documentoChinesFile && (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Arquivo anexado: {stepData.documentoChinesFile}
                  </p>
                )}
              </div>

              {/* Tradução Juramentada */}
              <div className="space-y-2">
                <Label htmlFor="traducaoJuramentada">Tradução Juramentada</Label>
                <Input
                  id="traducaoJuramentada"
                  value={stepData.traducaoJuramentada}
                  onChange={(e) => setStepData({ ...stepData, traducaoJuramentada: e.target.value })}
                  placeholder="Observações"
                />
                <div className="flex items-center gap-2">
                  <Input
                    id="traducaoJuramentadaFile"
                    type="file"
                    onChange={(e) => handleFileUpload(e, "traducaoJuramentadaFile")}
                    disabled={uploadingFields.traducaoJuramentadaFile}
                    className="flex-1"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  {uploadingFields.traducaoJuramentadaFile && (
                    <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {stepData.traducaoJuramentadaFile && (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Arquivo anexado: {stepData.traducaoJuramentadaFile}
                  </p>
                )}
              </div>
            </div>
            <Button onClick={() => handleSaveStepData(stepIndex)} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        );

      case 1: // Fazer Procuração e Pedido
        return (
          <div className="space-y-4 mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="procuracaoPedido">Procuração e Pedido de Perda</Label>
              <Textarea
                id="procuracaoPedido"
                value={stepData.procuracaoPedido}
                onChange={(e) => setStepData({ ...stepData, procuracaoPedido: e.target.value })}
                placeholder="Observações sobre a procuração e pedido"
                rows={3}
              />
              <div className="flex items-center gap-2">
                <Input
                  id="procuracaoPedidoFile"
                  type="file"
                  onChange={(e) => handleFileUpload(e, "procuracaoPedidoFile")}
                  disabled={uploadingFields.procuracaoPedidoFile}
                  className="flex-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploadingFields.procuracaoPedidoFile && (
                  <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {stepData.procuracaoPedidoFile && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Arquivo anexado: {stepData.procuracaoPedidoFile}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Responsável: JESSICA
              </p>
            </div>
            <Button onClick={() => handleSaveStepData(stepIndex)} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar Informações
            </Button>
          </div>
        );

      case 2: // Enviar Procuração e Cobrar Assinaturas
        return (
          <div className="space-y-4 mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="procuracaoAssinada">Procuração Assinada</Label>
              <Textarea
                id="procuracaoAssinada"
                value={stepData.procuracaoAssinada}
                onChange={(e) => setStepData({ ...stepData, procuracaoAssinada: e.target.value })}
                placeholder="Status das assinaturas e observações"
                rows={3}
              />
              <div className="flex items-center gap-2">
                <Input
                  id="procuracaoAssinadaFile"
                  type="file"
                  onChange={(e) => handleFileUpload(e, "procuracaoAssinadaFile")}
                  disabled={uploadingFields.procuracaoAssinadaFile}
                  className="flex-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploadingFields.procuracaoAssinadaFile && (
                  <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {stepData.procuracaoAssinadaFile && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Arquivo anexado: {stepData.procuracaoAssinadaFile}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Fluxo: JESSICA → FANG
              </p>
            </div>
            <Button onClick={() => handleSaveStepData(stepIndex)} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar Informações
            </Button>
          </div>
        );

      case 3: // Protocolar
        return (
          <div className="space-y-4 mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="protocoloAnexado">Protocolo</Label>
                <Input
                  id="protocoloAnexado"
                  value={stepData.protocoloAnexado}
                  onChange={(e) => setStepData({ ...stepData, protocoloAnexado: e.target.value })}
                  placeholder="Observações"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numeroProtocolo">Número do Protocolo</Label>
                <Input
                  id="numeroProtocolo"
                  value={stepData.numeroProtocolo}
                  onChange={(e) => setStepData({ ...stepData, numeroProtocolo: e.target.value })}
                  placeholder="Digite o número"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="protocoloAnexadoFile">Upload do Protocolo</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="protocoloAnexadoFile"
                  type="file"
                  onChange={(e) => handleFileUpload(e, "protocoloAnexadoFile")}
                  disabled={uploadingFields.protocoloAnexadoFile}
                  className="flex-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploadingFields.protocoloAnexadoFile && (
                  <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {stepData.protocoloAnexadoFile && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Arquivo anexado: {stepData.protocoloAnexadoFile}
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Responsável: JESSICA
            </p>
            <Button onClick={() => handleSaveStepData(stepIndex)} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar Protocolo
            </Button>
          </div>
        );

      case 4: // Exigências do Juiz
        return (
          <div className="space-y-4 mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="exigenciasJuiz">Exigências do Juiz</Label>
              <Textarea
                id="exigenciasJuiz"
                value={stepData.exigenciasJuiz}
                onChange={(e) => setStepData({ ...stepData, exigenciasJuiz: e.target.value })}
                placeholder="Descreva as exigências solicitadas pelo juiz"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exigenciasJuizFile">Upload de Documentos</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="exigenciasJuizFile"
                  type="file"
                  onChange={(e) => handleFileUpload(e, "exigenciasJuizFile")}
                  disabled={uploadingFields.exigenciasJuizFile}
                  className="flex-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploadingFields.exigenciasJuizFile && (
                  <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {stepData.exigenciasJuizFile && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Arquivo anexado: {stepData.exigenciasJuizFile}
                </p>
              )}
            </div>
            <Button onClick={() => handleSaveStepData(stepIndex)} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar Exigências
            </Button>
          </div>
        );

      case 5: // Deferido
        return (
          <div className="space-y-4 mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="douEnviado">D.O.U Enviado para FANG</Label>
              <Textarea
                id="douEnviado"
                value={stepData.douEnviado}
                onChange={(e) => setStepData({ ...stepData, douEnviado: e.target.value })}
                placeholder="Observações sobre o envio do DOU"
                rows={3}
              />
              <div className="flex items-center gap-2">
                <Input
                  id="douEnviadoFile"
                  type="file"
                  onChange={(e) => handleFileUpload(e, "douEnviadoFile")}
                  disabled={uploadingFields.douEnviadoFile}
                  className="flex-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploadingFields.douEnviadoFile && (
                  <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {stepData.douEnviadoFile && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Arquivo anexado: {stepData.douEnviadoFile}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="passaporteChinesSolicitado">Passaporte Chinês Solicitado</Label>
              <Input
                id="passaporteChinesSolicitado"
                value={stepData.passaporteChinesSolicitado}
                onChange={(e) => setStepData({ ...stepData, passaporteChinesSolicitado: e.target.value })}
                placeholder="Status da solicitação"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              ⚠️ Processo marcado como DEFERIDO (ainda não RATIFICADO)
            </p>
            <p className="text-xs text-muted-foreground">
              Responsável: JESSICA
            </p>
            <Button onClick={() => handleSaveStepData(stepIndex)} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar Informações
            </Button>
          </div>
        );

      case 6: // Manifesto e Passaporte Chinês
        return (
          <div className="space-y-4 mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="passaporteChinesAnexado">Passaporte Chinês Recebido</Label>
              <Input
                id="passaporteChinesAnexado"
                value={stepData.passaporteChinesAnexado}
                onChange={(e) => setStepData({ ...stepData, passaporteChinesAnexado: e.target.value })}
                placeholder="Número ou observações"
              />
              <div className="flex items-center gap-2">
                <Input
                  id="passaporteChinesAnexadoFile"
                  type="file"
                  onChange={(e) => handleFileUpload(e, "passaporteChinesAnexadoFile")}
                  disabled={uploadingFields.passaporteChinesAnexadoFile}
                  className="flex-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploadingFields.passaporteChinesAnexadoFile && (
                  <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {stepData.passaporteChinesAnexadoFile && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Arquivo anexado: {stepData.passaporteChinesAnexadoFile}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="manifestoProtocolado">Manifesto Protocolado</Label>
              <Textarea
                id="manifestoProtocolado"
                value={stepData.manifestoProtocolado}
                onChange={(e) => setStepData({ ...stepData, manifestoProtocolado: e.target.value })}
                placeholder="Observações sobre o manifesto e protocolo"
                rows={3}
              />
              <div className="flex items-center gap-2">
                <Input
                  id="manifestoProtocoladoFile"
                  type="file"
                  onChange={(e) => handleFileUpload(e, "manifestoProtocoladoFile")}
                  disabled={uploadingFields.manifestoProtocoladoFile}
                  className="flex-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploadingFields.manifestoProtocoladoFile && (
                  <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {stepData.manifestoProtocoladoFile && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Arquivo anexado: {stepData.manifestoProtocoladoFile}
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Responsável: JESSICA
            </p>
            <Button onClick={() => handleSaveStepData(stepIndex)} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar Informações
            </Button>
          </div>
        );

      case 7: // Ratificado
        return (
          <div className="space-y-4 mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="portariaFinal">Portaria Final</Label>
              <Textarea
                id="portariaFinal"
                value={stepData.portariaFinal}
                onChange={(e) => setStepData({ ...stepData, portariaFinal: e.target.value })}
                placeholder="Observações sobre a portaria"
                rows={3}
              />
              <div className="flex items-center gap-2">
                <Input
                  id="portariaFinalFile"
                  type="file"
                  onChange={(e) => handleFileUpload(e, "portariaFinalFile")}
                  disabled={uploadingFields.portariaFinalFile}
                  className="flex-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploadingFields.portariaFinalFile && (
                  <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {stepData.portariaFinalFile && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Arquivo anexado: {stepData.portariaFinalFile}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="douRatificado">D.O.U com Processo Ratificado</Label>
              <Textarea
                id="douRatificado"
                value={stepData.douRatificado}
                onChange={(e) => setStepData({ ...stepData, douRatificado: e.target.value })}
                placeholder="Observações sobre o DOU ratificado enviado para FANG"
                rows={3}
              />
              <div className="flex items-center gap-2">
                <Input
                  id="douRatificadoFile"
                  type="file"
                  onChange={(e) => handleFileUpload(e, "douRatificadoFile")}
                  disabled={uploadingFields.douRatificadoFile}
                  className="flex-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploadingFields.douRatificadoFile && (
                  <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {stepData.douRatificadoFile && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Arquivo anexado: {stepData.douRatificadoFile}
                </p>
              )}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              ✅ Processo RATIFICADO e FINALIZADO
            </p>
            <Button onClick={() => handleSaveStepData(stepIndex)} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar Informações
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!caseData) {
    return <div>Ação não encontrada</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/perda-nacionalidade">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{caseData.clientName}</h1>
            <p className="text-muted-foreground">Perda de Nacionalidade Brasileira</p>
          </div>
        </div>
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
                Tem certeza que deseja excluir esta ação? Esta ação não pode ser desfeita.
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

      {/* Step Change Confirmation Dialog */}
      <AlertDialog open={stepDialogOpen} onOpenChange={setStepDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar mudança de passo</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingStep === caseData?.currentStep 
                ? "Tem certeza que deseja marcar este passo como concluído e avançar para o próximo?"
                : "Tem certeza que deseja voltar para este passo?"}
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

      {/* Save Notes Confirmation Dialog */}
      <AlertDialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar alterações</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja salvar as alterações de status e observações?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSaveNotes}>
              Salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Workflow Steps */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fluxo do Processo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {WORKFLOW_STEPS.map((step, index) => (
                <Collapsible
                  key={index}
                  open={expandedStep === index}
                  onOpenChange={() => handleStepClick(index)}
                >
                  <div
                    className={`flex items-start gap-3 p-4 rounded-lg transition-colors ${
                      index === caseData.currentStep
                        ? "bg-primary/10 border-2 border-primary"
                        : index < caseData.currentStep
                        ? "bg-green-50 dark:bg-green-950/20"
                        : "bg-muted/50"
                    }`}
                  >
                    <button
                      onClick={(e) => handleCompleteStep(index, e)}
                      className="shrink-0 mt-0.5 hover:scale-110 transition-transform cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={index > caseData.currentStep}
                      title={
                        index === caseData.currentStep 
                          ? "Clique para marcar como concluído" 
                          : index < caseData.currentStep 
                          ? "Clique para marcar como atual" 
                          : "Aguardando passo anterior"
                      }
                    >
                      {index < caseData.currentStep ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle
                          className={`h-6 w-6 ${
                            index === caseData.currentStep
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <CollapsibleTrigger className="w-full text-left">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">Passo {index + 1}</span>
                            {index === caseData.currentStep && (
                              <Badge>Atual</Badge>
                            )}
                            {index < caseData.currentStep && (
                              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">
                                Concluído
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {index < 7 && (
                              <Edit2 className="h-4 w-4 text-muted-foreground" />
                            )}
                            {expandedStep === index ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm mt-1 text-left">{step}</p>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        {renderStepContent(index)}
                      </CollapsibleContent>
                    </div>
                  </div>
                </Collapsible>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status do Processo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Deferido">Deferido</SelectItem>
                    <SelectItem value="Ratificado">Ratificado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Passo Atual</label>
                <div className="text-2xl font-bold">{caseData.currentStep + 1}</div>
                <p className="text-xs text-muted-foreground">
                  de {WORKFLOW_STEPS.length} passos
                </p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Criado em</p>
                <p className="text-sm font-medium">
                  {new Date(caseData.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Última atualização</p>
                <p className="text-sm font-medium">
                  {new Date(caseData.updatedAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                placeholder="Adicione observações..."
              />
              <Button onClick={handleSaveNotes} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}