"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, Circle, Save, Trash2, FileUp, ChevronDown, ChevronUp, Upload, FileText, Download, Edit2 } from "lucide-react";
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

// Workflow steps for Ações Trabalhistas
const WORKFLOWS = {
  "Ação Trabalhista": [
    "Análise Inicial",
    "Petição Inicial",
    "Citação",
    "Contestação",
    "Audiência Inicial",
    "Instrução Processual",
    "Alegações Finais",
    "Sentença",
    "Execução/Recurso",
  ],
};

export default function AcaoTrabalhistaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Em Andamento");
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({});
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [stepDialogOpen, setStepDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");
  const [pendingStep, setPendingStep] = useState(0);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<any>(null);
  const [deletingDocument, setDeletingDocument] = useState(false);
  
  // Document editing states
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [editingDocumentName, setEditingDocumentName] = useState("");
  
  // Step data states
  const [stepData, setStepData] = useState({
    // Step 0 - Análise Inicial
    documentosIniciais: "",
    documentosIniciaisFile: "",
    contratoTrabalho: "",
    contratoTrabalhoFile: "",
    carteiraTrabalhista: "",
    carteiraTrabalhistaFile: "",
    comprovantesSalariais: "",
    comprovantesSalariaisFile: "",
    // Step 1 - Petição Inicial
    peticaoInicial: "",
    peticaoInicialFile: "",
    procuracaoTrabalhista: "",
    procuracaoTrabalhistaFile: "",
    // Step 2 - Citação
    citacaoEmpregador: "",
    citacaoEmpregadorFile: "",
    // Step 3 - Contestação
    contestacaoRecebida: "",
    contestacaoRecebidaFile: "",
    // Step 4 - Audiência Inicial
    ataAudienciaInicial: "",
    ataAudienciaInicialFile: "",
    // Step 5 - Instrução Processual
    provasTestemunhas: "",
    provasTestemunhasFile: "",
    // Step 6 - Alegações Finais
    alegacoesFinais: "",
    alegacoesFinaisFile: "",
    // Step 7 - Sentença
    sentencaTrabalhista: "",
    sentencaTrabalhistaFile: "",
    // Step 8 - Execução/Recurso
    execucaoRecurso: "",
    execucaoRecursoFile: "",
  });

  useEffect(() => {
    fetchCase();
    fetchDocuments();
  }, [params.id]);

  const fetchCase = async () => {
    try {
      const response = await fetch(`/api/acoes-trabalhistas?id=${params.id}`);
      const data = await response.json();
      setCaseData(data);
      setNotes(data.notes || "");
      setStatus(data.status);
      
      // Populate step data from database
      setStepData({
        documentosIniciais: data.documentosIniciais || "",
        documentosIniciaisFile: data.documentosIniciaisFile || "",
        contratoTrabalho: data.contratoTrabalho || "",
        contratoTrabalhoFile: data.contratoTrabalhoFile || "",
        carteiraTrabalhista: data.carteiraTrabalhista || "",
        carteiraTrabalhistaFile: data.carteiraTrabalhistaFile || "",
        comprovantesSalariais: data.comprovantesSalariais || "",
        comprovantesSalariaisFile: data.comprovantesSalariaisFile || "",
        peticaoInicial: data.peticaoInicial || "",
        peticaoInicialFile: data.peticaoInicialFile || "",
        procuracaoTrabalhista: data.procuracaoTrabalhista || "",
        procuracaoTrabalhistaFile: data.procuracaoTrabalhistaFile || "",
        citacaoEmpregador: data.citacaoEmpregador || "",
        citacaoEmpregadorFile: data.citacaoEmpregadorFile || "",
        contestacaoRecebida: data.contestacaoRecebida || "",
        contestacaoRecebidaFile: data.contestacaoRecebidaFile || "",
        ataAudienciaInicial: data.ataAudienciaInicial || "",
        ataAudienciaInicialFile: data.ataAudienciaInicialFile || "",
        provasTestemunhas: data.provasTestemunhas || "",
        provasTestemunhasFile: data.provasTestemunhasFile || "",
        alegacoesFinais: data.alegacoesFinais || "",
        alegacoesFinaisFile: data.alegacoesFinaisFile || "",
        sentencaTrabalhista: data.sentencaTrabalhista || "",
        sentencaTrabalhistaFile: data.sentencaTrabalhistaFile || "",
        execucaoRecurso: data.execucaoRecurso || "",
        execucaoRecursoFile: data.execucaoRecursoFile || "",
      });
    } catch (error) {
      console.error("Error fetching case:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      setLoadingDocuments(true);
      const response = await fetch(`/api/documents/${params.id}?moduleType=acoes_trabalhistas`);
      const data = await response.json();
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleDeleteDocument = async (documentId: number) => {
    try {
      setDeletingDocument(true);
      const response = await fetch(`/api/documents/delete/${documentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove document from state
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
        setDeleteDialogOpen(false);
        setDocumentToDelete(null);
      } else {
        console.error('Erro ao excluir documento');
      }
    } catch (error) {
      console.error('Erro ao excluir documento:', error);
    } finally {
      setDeletingDocument(false);
    }
  };

  const handleDocumentDoubleClick = (doc: any) => {
    setEditingDocumentId(doc.id);
    setEditingDocumentName(doc.document_name || doc.file_name);
  };

  const handleDocumentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingDocumentName(e.target.value);
  };

  const handleDocumentNameSave = async (documentId: string) => {
    if (!editingDocumentName.trim()) {
      setEditingDocumentId(null);
      setEditingDocumentName("");
      return;
    }

    try {
      const response = await fetch(`/api/documents/rename/${documentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_name: editingDocumentName.trim() }),
      });

      if (response.ok) {
        // Update document in state
        setDocuments(prev => prev.map(doc => 
          doc.id === parseInt(documentId) 
            ? { ...doc, document_name: editingDocumentName.trim() }
            : doc
        ));
        setEditingDocumentId(null);
        setEditingDocumentName("");
      } else {
        console.error('Erro ao renomear documento');
        alert('Erro ao renomear documento');
      }
    } catch (error) {
      console.error('Erro ao renomear documento:', error);
      alert('Erro ao renomear documento');
    }
  };

  const handleDocumentNameCancel = () => {
    setEditingDocumentId(null);
    setEditingDocumentName("");
  };

  const handleDocumentNameKeyPress = (e: React.KeyboardEvent, documentId: string) => {
    if (e.key === 'Enter') {
      handleDocumentNameSave(documentId);
    } else if (e.key === 'Escape') {
      handleDocumentNameCancel();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    for (const file of files) {
      await uploadDroppedFile(file);
    }
  };

  const uploadDroppedFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caseId", params.id as string);
    formData.append("fieldName", "documentoAnexado");

    try {
      setUploadingFile(true);
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Refresh documents list
        await fetchDocuments();
        alert("✅ Arquivo enviado com sucesso!");
      } else {
        const data = await response.json();
        console.error('Erro ao fazer upload do arquivo:', data);
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
      console.error('Erro ao fazer upload:', error);
      alert(
        "❌ Erro ao enviar arquivo. Verifique:\n\n" +
        "1. Se o bucket 'juridico-documentos' existe no Supabase Storage\n" +
        "2. Se as políticas RLS estão configuradas (consulte SUPABASE_STORAGE_POLICIES.md)\n" +
        "3. Se as variáveis de ambiente estão corretas no arquivo .env\n\n" +
        "Erro: " + (error as Error).message
      );
    } finally {
      setUploadingFile(false);
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
        // Update stepData with the file URL
        setStepData(prev => ({ ...prev, [fieldName]: data.fileName }));
        
        // Save to database immediately after upload
        await fetch(`/api/acoes-trabalhistas?id=${params.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [fieldName]: data.fileName }),
        });
        
        alert("✅ Arquivo enviado e salvo com sucesso!");
        await fetchCase(); // Refresh data
        await fetchDocuments(); // Refresh documents list
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
    // Se está fechando o passo (expandedStep === stepIndex), salvar dados primeiro
    if (expandedStep === stepIndex) {
      await handleSaveStepData(stepIndex, true); // true = silencioso, sem alert
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
      
      const response = await fetch(`/api/acoes-trabalhistas?id=${params.id}`, {
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
      
      const response = await fetch(`/api/acoes-trabalhistas?id=${params.id}`, {
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
      const response = await fetch(`/api/acoes-trabalhistas?id=${params.id}`, {
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

  const handleStatusChange = async (newStatus: string) => {
    try {
      // Update local state immediately for better UX
      setStatus(newStatus);
      
      // Update in database
      const response = await fetch(`/api/acoes-trabalhistas?id=${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update the case data to reflect the change
      const updatedAt = new Date().toISOString();
      setCaseData((prev: any) => ({
        ...prev,
        status: newStatus,
        updatedAt: updatedAt,
      }));

      // Notify other pages about the status change
      const updateData = {
        id: parseInt(params.id),
        status: newStatus,
        updatedAt: updatedAt,
      };

      // Store in localStorage for cross-tab communication
      localStorage.setItem('acoes-trabalhistas-status-update', JSON.stringify(updateData));

      // Dispatch custom event for same-tab communication
      window.dispatchEvent(new CustomEvent('acoes-trabalhistas-status-updated', {
        detail: updateData
      }));

      // Show success message (optional, can be removed for silent update)
      console.log("Status atualizado com sucesso!");
    } catch (error) {
      console.error("Error updating status:", error);
      // Revert the status change if the API call failed
      setStatus(caseData?.status || "Em Andamento");
      alert("Erro ao atualizar status");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/acoes-trabalhistas?id=${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/dashboard/acoes-trabalhistas");
      }
    } catch (error) {
      console.error("Error deleting case:", error);
      alert("Erro ao excluir ação");
    }
  };

  const renderStepContent = (stepIndex: number) => {
    return renderTrabalhistaStepContent(stepIndex);
  };

  const renderTrabalhistaStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Análise Inicial
        return (
          <div className="space-y-4 mt-4 p-4 bg-muted rounded-lg">
            <div className="grid grid-cols-1 gap-4">
              {/* Documentos Iniciais */}
              <div className="space-y-2">
                <Label htmlFor="documentosIniciais">Documentos Iniciais</Label>
                <Input
                  id="documentosIniciais"
                  value={stepData.documentosIniciais}
                  onChange={(e) => setStepData({ ...stepData, documentosIniciais: e.target.value })}
                  placeholder="Status dos documentos iniciais"
                />
                <div className="flex items-center gap-2">
                  <Input
                    id="documentosIniciaisFile"
                    type="file"
                    onChange={(e) => handleFileUpload(e, "documentosIniciaisFile")}
                    disabled={uploadingFields.documentosIniciaisFile}
                    className="flex-1"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  {uploadingFields.documentosIniciaisFile && (
                    <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {stepData.documentosIniciaisFile && (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Arquivo anexado: {stepData.documentosIniciaisFile}
                  </p>
                )}
              </div>

              {/* Contrato de Trabalho */}
              <div className="space-y-2">
                <Label htmlFor="contratoTrabalho">Contrato de Trabalho</Label>
                <Input
                  id="contratoTrabalho"
                  value={stepData.contratoTrabalho}
                  onChange={(e) => setStepData({ ...stepData, contratoTrabalho: e.target.value })}
                  placeholder="Status do contrato de trabalho"
                />
                <div className="flex items-center gap-2">
                  <Input
                    id="contratoTrabalhoFile"
                    type="file"
                    onChange={(e) => handleFileUpload(e, "contratoTrabalhoFile")}
                    disabled={uploadingFields.contratoTrabalhoFile}
                    className="flex-1"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  {uploadingFields.contratoTrabalhoFile && (
                    <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {stepData.contratoTrabalhoFile && (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Arquivo anexado: {stepData.contratoTrabalhoFile}
                  </p>
                )}
              </div>

              {/* Carteira de Trabalho */}
              <div className="space-y-2">
                <Label htmlFor="carteiraTrabalhista">Carteira de Trabalho</Label>
                <Input
                  id="carteiraTrabalhista"
                  value={stepData.carteiraTrabalhista}
                  onChange={(e) => setStepData({ ...stepData, carteiraTrabalhista: e.target.value })}
                  placeholder="Status da carteira de trabalho"
                />
                <div className="flex items-center gap-2">
                  <Input
                    id="carteiraTrabalhistaFile"
                    type="file"
                    onChange={(e) => handleFileUpload(e, "carteiraTrabalhistaFile")}
                    disabled={uploadingFields.carteiraTrabalhistaFile}
                    className="flex-1"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  {uploadingFields.carteiraTrabalhistaFile && (
                    <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {stepData.carteiraTrabalhistaFile && (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Arquivo anexado: {stepData.carteiraTrabalhistaFile}
                  </p>
                )}
              </div>

              {/* Comprovantes Salariais */}
              <div className="space-y-2">
                <Label htmlFor="comprovantesSalariais">Comprovantes Salariais</Label>
                <Input
                  id="comprovantesSalariais"
                  value={stepData.comprovantesSalariais}
                  onChange={(e) => setStepData({ ...stepData, comprovantesSalariais: e.target.value })}
                  placeholder="Status dos comprovantes salariais"
                />
                <div className="flex items-center gap-2">
                  <Input
                    id="comprovantesSalariaisFile"
                    type="file"
                    onChange={(e) => handleFileUpload(e, "comprovantesSalariaisFile")}
                    disabled={uploadingFields.comprovantesSalariaisFile}
                    className="flex-1"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  {uploadingFields.comprovantesSalariaisFile && (
                    <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {stepData.comprovantesSalariaisFile && (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Arquivo anexado: {stepData.comprovantesSalariaisFile}
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

      case 1: // Petição Inicial
        return (
          <div className="space-y-4 mt-4 p-4 bg-muted rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="peticaoInicial">Petição Inicial</Label>
              <Input
                id="peticaoInicial"
                value={stepData.peticaoInicial}
                onChange={(e) => setStepData({ ...stepData, peticaoInicial: e.target.value })}
                placeholder="Status da petição inicial"
              />
              <div className="flex items-center gap-2">
                <Input
                  id="peticaoInicialFile"
                  type="file"
                  onChange={(e) => handleFileUpload(e, "peticaoInicialFile")}
                  disabled={uploadingFields.peticaoInicialFile}
                  className="flex-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploadingFields.peticaoInicialFile && (
                  <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {stepData.peticaoInicialFile && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Arquivo anexado: {stepData.peticaoInicialFile}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="procuracaoTrabalhista">Procuração</Label>
              <Input
                id="procuracaoTrabalhista"
                value={stepData.procuracaoTrabalhista}
                onChange={(e) => setStepData({ ...stepData, procuracaoTrabalhista: e.target.value })}
                placeholder="Status da procuração"
              />
              <div className="flex items-center gap-2">
                <Input
                  id="procuracaoTrabalhistaFile"
                  type="file"
                  onChange={(e) => handleFileUpload(e, "procuracaoTrabalhistaFile")}
                  disabled={uploadingFields.procuracaoTrabalhistaFile}
                  className="flex-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploadingFields.procuracaoTrabalhistaFile && (
                  <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {stepData.procuracaoTrabalhistaFile && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Arquivo anexado: {stepData.procuracaoTrabalhistaFile}
                </p>
              )}
            </div>
            <Button onClick={() => handleSaveStepData(stepIndex)} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar Informações
            </Button>
          </div>
        );

      case 2: // Citação
        return (
          <div className="space-y-4 mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="citacaoEmpregador">Citação do Empregador</Label>
              <Input
                id="citacaoEmpregador"
                value={stepData.citacaoEmpregador}
                onChange={(e) => setStepData({ ...stepData, citacaoEmpregador: e.target.value })}
                placeholder="Status da citação"
              />
              <div className="flex items-center gap-2">
                <Input
                  id="citacaoEmpregadorFile"
                  type="file"
                  onChange={(e) => handleFileUpload(e, "citacaoEmpregadorFile")}
                  disabled={uploadingFields.citacaoEmpregadorFile}
                  className="flex-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploadingFields.citacaoEmpregadorFile && (
                  <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {stepData.citacaoEmpregadorFile && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Arquivo anexado: {stepData.citacaoEmpregadorFile}
                </p>
              )}
            </div>
            <Button onClick={() => handleSaveStepData(stepIndex)} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar Informações
            </Button>
          </div>
        );

      case 3: // Contestação
        return (
          <div className="space-y-4 mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="contestacaoRecebida">Contestação Recebida</Label>
              <Input
                id="contestacaoRecebida"
                value={stepData.contestacaoRecebida}
                onChange={(e) => setStepData({ ...stepData, contestacaoRecebida: e.target.value })}
                placeholder="Status da contestação"
              />
              <div className="flex items-center gap-2">
                <Input
                  id="contestacaoRecebidaFile"
                  type="file"
                  onChange={(e) => handleFileUpload(e, "contestacaoRecebidaFile")}
                  disabled={uploadingFields.contestacaoRecebidaFile}
                  className="flex-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploadingFields.contestacaoRecebidaFile && (
                  <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {stepData.contestacaoRecebidaFile && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Arquivo anexado: {stepData.contestacaoRecebidaFile}
                </p>
              )}
            </div>
            <Button onClick={() => handleSaveStepData(stepIndex)} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar Informações
            </Button>
          </div>
        );

      case 4: // Audiência Inicial
        return (
          <div className="space-y-4 mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="ataAudienciaInicial">Ata da Audiência Inicial</Label>
              <Input
                id="ataAudienciaInicial"
                value={stepData.ataAudienciaInicial}
                onChange={(e) => setStepData({ ...stepData, ataAudienciaInicial: e.target.value })}
                placeholder="Status da ata da audiência"
              />
              <div className="flex items-center gap-2">
                <Input
                  id="ataAudienciaInicialFile"
                  type="file"
                  onChange={(e) => handleFileUpload(e, "ataAudienciaInicialFile")}
                  disabled={uploadingFields.ataAudienciaInicialFile}
                  className="flex-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploadingFields.ataAudienciaInicialFile && (
                  <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {stepData.ataAudienciaInicialFile && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Arquivo anexado: {stepData.ataAudienciaInicialFile}
                </p>
              )}
            </div>
            <Button onClick={() => handleSaveStepData(stepIndex)} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar Informações
            </Button>
          </div>
        );

      case 5: // Instrução Processual
        return (
          <div className="space-y-4 mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="provasTestemunhas">Provas e Testemunhas</Label>
              <Input
                id="provasTestemunhas"
                value={stepData.provasTestemunhas}
                onChange={(e) => setStepData({ ...stepData, provasTestemunhas: e.target.value })}
                placeholder="Status das provas e testemunhas"
              />
              <div className="flex items-center gap-2">
                <Input
                  id="provasTestemunhasFile"
                  type="file"
                  onChange={(e) => handleFileUpload(e, "provasTestemunhasFile")}
                  disabled={uploadingFields.provasTestemunhasFile}
                  className="flex-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploadingFields.provasTestemunhasFile && (
                  <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {stepData.provasTestemunhasFile && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Arquivo anexado: {stepData.provasTestemunhasFile}
                </p>
              )}
            </div>
            <Button onClick={() => handleSaveStepData(stepIndex)} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar Informações
            </Button>
          </div>
        );

      case 6: // Alegações Finais
        return (
          <div className="space-y-4 mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="alegacoesFinais">Alegações Finais</Label>
              <Textarea
                id="alegacoesFinais"
                value={stepData.alegacoesFinais}
                onChange={(e) => setStepData({ ...stepData, alegacoesFinais: e.target.value })}
                placeholder="Descreva as alegações finais"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alegacoesFinaisFile">Upload de Alegações Finais</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="alegacoesFinaisFile"
                  type="file"
                  onChange={(e) => handleFileUpload(e, "alegacoesFinaisFile")}
                  disabled={uploadingFields.alegacoesFinaisFile}
                  className="flex-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploadingFields.alegacoesFinaisFile && (
                  <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {stepData.alegacoesFinaisFile && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Arquivo anexado: {stepData.alegacoesFinaisFile}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Formatos aceitos: PDF, DOC, DOCX, JPG, PNG
              </p>
            </div>
            <Button onClick={() => handleSaveStepData(stepIndex)} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar Documentos
            </Button>
          </div>
        );

      case 7: // Sentença
        return (
          <div className="space-y-4 mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="sentencaTrabalhista">Sentença</Label>
              <Textarea
                id="sentencaTrabalhista"
                value={stepData.sentencaTrabalhista}
                onChange={(e) => setStepData({ ...stepData, sentencaTrabalhista: e.target.value })}
                placeholder="Descreva a sentença trabalhista"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sentencaTrabalhistaFile">Upload da Sentença</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="sentencaTrabalhistaFile"
                  type="file"
                  onChange={(e) => handleFileUpload(e, "sentencaTrabalhistaFile")}
                  disabled={uploadingFields.sentencaTrabalhistaFile}
                  className="flex-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploadingFields.sentencaTrabalhistaFile && (
                  <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {stepData.sentencaTrabalhistaFile && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Arquivo anexado: {stepData.sentencaTrabalhistaFile}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Formatos aceitos: PDF, DOC, DOCX, JPG, PNG
              </p>
            </div>
            <Button onClick={() => handleSaveStepData(stepIndex)} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar Documentos
            </Button>
          </div>
        );

      case 8: // Execução/Recurso
        return (
          <div className="space-y-4 mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="execucaoRecurso">Execução/Recurso</Label>
              <Textarea
                id="execucaoRecurso"
                value={stepData.execucaoRecurso}
                onChange={(e) => setStepData({ ...stepData, execucaoRecurso: e.target.value })}
                placeholder="Descreva a execução ou recurso"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="execucaoRecursoFile">Upload de Documentos</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="execucaoRecursoFile"
                  type="file"
                  onChange={(e) => handleFileUpload(e, "execucaoRecursoFile")}
                  disabled={uploadingFields.execucaoRecursoFile}
                  className="flex-1"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                {uploadingFields.execucaoRecursoFile && (
                  <Upload className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {stepData.execucaoRecursoFile && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Arquivo anexado: {stepData.execucaoRecursoFile}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Formatos aceitos: PDF, DOC, DOCX, JPG, PNG
              </p>
            </div>
            <Button onClick={() => handleSaveStepData(stepIndex)} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Salvar Documentos
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(9)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return <div>Ação não encontrada</div>;
  }

  const workflow = WORKFLOWS["Ação Trabalhista"] || [];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/acoes-trabalhistas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{caseData.clientName}</h1>
            <p className="text-muted-foreground">Ação Trabalhista</p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="w-full sm:w-auto">
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
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Workflow Steps */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fluxo do Processo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {workflow.map((step, index) => (
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
                            {index < 9 && (
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

          {/* Documents Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileUp className="h-5 w-5" />
                Documentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3">
                {/* Documentos Iniciais */}
                {stepData.documentosIniciaisFile && (
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">Documentos Iniciais</span>
                    <a 
                      href={stepData.documentosIniciaisFile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate max-w-[150px]"
                    >
                      {stepData.documentosIniciaisFile.split('/').pop()}
                    </a>
                  </div>
                )}
                
                {/* Contrato de Trabalho */}
                {stepData.contratoTrabalhoFile && (
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">Contrato de Trabalho</span>
                    <a 
                      href={stepData.contratoTrabalhoFile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate max-w-[150px]"
                    >
                      {stepData.contratoTrabalhoFile.split('/').pop()}
                    </a>
                  </div>
                )}
                
                {/* Carteira de Trabalho */}
                {stepData.carteiraTrabalhistaFile && (
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">Carteira de Trabalho</span>
                    <a 
                      href={stepData.carteiraTrabalhistaFile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate max-w-[150px]"
                    >
                      {stepData.carteiraTrabalhistaFile.split('/').pop()}
                    </a>
                  </div>
                )}
                
                {/* Comprovantes Salariais */}
                {stepData.comprovantesSalariaisFile && (
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">Comprovantes Salariais</span>
                    <a 
                      href={stepData.comprovantesSalariaisFile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate max-w-[150px]"
                    >
                      {stepData.comprovantesSalariaisFile.split('/').pop()}
                    </a>
                  </div>
                )}
                
                {/* Petição Inicial */}
                {stepData.peticaoInicialFile && (
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">Petição Inicial</span>
                    <a 
                      href={stepData.peticaoInicialFile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate max-w-[150px]"
                    >
                      {stepData.peticaoInicialFile.split('/').pop()}
                    </a>
                  </div>
                )}
                
                {/* Procuração */}
                {stepData.procuracaoTrabalhistaFile && (
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">Procuração</span>
                    <a 
                      href={stepData.procuracaoTrabalhistaFile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate max-w-[150px]"
                    >
                      {stepData.procuracaoTrabalhistaFile.split('/').pop()}
                    </a>
                  </div>
                )}
                
                {/* Citação */}
                {stepData.citacaoEmpregadorFile && (
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">Citação</span>
                    <a 
                      href={stepData.citacaoEmpregadorFile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate max-w-[150px]"
                    >
                      {stepData.citacaoEmpregadorFile.split('/').pop()}
                    </a>
                  </div>
                )}
                
                {/* Contestação */}
                {stepData.contestacaoRecebidaFile && (
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">Contestação</span>
                    <a 
                      href={stepData.contestacaoRecebidaFile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate max-w-[150px]"
                    >
                      {stepData.contestacaoRecebidaFile.split('/').pop()}
                    </a>
                  </div>
                )}
                
                {/* Ata da Audiência */}
                {stepData.ataAudienciaInicialFile && (
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">Ata da Audiência</span>
                    <a 
                      href={stepData.ataAudienciaInicialFile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate max-w-[150px]"
                    >
                      {stepData.ataAudienciaInicialFile.split('/').pop()}
                    </a>
                  </div>
                )}
                
                {/* Provas e Testemunhas */}
                {stepData.provasTestemunhasFile && (
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">Provas e Testemunhas</span>
                    <a 
                      href={stepData.provasTestemunhasFile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate max-w-[150px]"
                    >
                      {stepData.provasTestemunhasFile.split('/').pop()}
                    </a>
                  </div>
                )}

                {stepData.alegacoesFinaisFile && (
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">Alegações Finais</span>
                    <a 
                      href={stepData.alegacoesFinaisFile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate max-w-[150px]"
                    >
                      {stepData.alegacoesFinaisFile.split('/').pop()}
                    </a>
                  </div>
                )}

                {stepData.sentencaTrabalhistaFile && (
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">Sentença</span>
                    <a 
                      href={stepData.sentencaTrabalhistaFile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate max-w-[150px]"
                    >
                      {stepData.sentencaTrabalhistaFile.split('/').pop()}
                    </a>
                  </div>
                )}

                {stepData.execucaoRecursoFile && (
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="text-sm">Execução/Recurso</span>
                    <a 
                      href={stepData.execucaoRecursoFile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate max-w-[150px]"
                    >
                      {stepData.execucaoRecursoFile.split('/').pop()}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Caso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Cliente</Label>
                <p className="text-sm text-muted-foreground">{caseData.clientName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Tipo</Label>
                <p className="text-sm text-muted-foreground">Ação Trabalhista</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      caseData.status === "Finalizado" 
                        ? "default" 
                        : caseData.status === "Em Andamento" 
                        ? "secondary" 
                        : "outline"
                    }
                  >
                    {caseData.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStatusDialogOpen(true)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Progresso</Label>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Passo {caseData.currentStep + 1} de {workflow.length}</span>
                    <span>{Math.round(((caseData.currentStep + 1) / workflow.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${((caseData.currentStep + 1) / workflow.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Data de Criação</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(caseData.createdAt).toLocaleDateString('pt-BR')}
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
                placeholder="Adicione observações sobre o caso..."
                rows={4}
              />
              <Button onClick={handleSaveNotes} size="sm" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Salvar Observações
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alterar Status</AlertDialogTitle>
            <AlertDialogDescription>
              Selecione o novo status para este caso.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select value={pendingStatus} onValueChange={setPendingStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Pausado">Pausado</SelectItem>
                <SelectItem value="Finalizado">Finalizado</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleStatusChange(pendingStatus)}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={stepDialogOpen} onOpenChange={setStepDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Alteração</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja alterar para o passo {pendingStep + 1}?
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

      <AlertDialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Salvamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja salvar as observações?
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
    </div>
  );
}