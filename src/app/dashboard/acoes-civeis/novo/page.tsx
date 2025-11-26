"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft, Upload, X, CheckCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { DocumentPreview } from "@/components/ui/document-preview";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const CASE_TYPES = [
  "Exame DNA",
  "Alteração de Nome",
  "Guarda",
  "Acordos de Guarda",
  "Divórcio Consensual",
  "Divórcio Litígio",
  "Usucapião"
];

interface FormData {
  clientName: string;
  type: string;
  ownerName: string;
  ownerCpf: string;
  ownerRnm: string;
  endereco: string;
  rnmMae: string;
  rnmPai: string;
  rnmSupostoPai: string;
  nomeMae: string;
  nomePaiRegistral: string;
  nomeSupostoPai: string;
  nomeCrianca: string;
  cpfMae: string;
  cpfPai: string;
  cpfSupostoPai: string;
  certidaoNascimento: string;
  comprovanteEndereco: string;
  passaporte: string;
  guiaPaga: string;
  peticaoConjunta: string;
  termoPartilhas: string;
  guarda: string;
  procuracao: string;
  peticaoCliente: string;
  procuracaoCliente: string;
  custas: string;
  peticaoInicial: string;
  matriculaImovel: string;
  aguaLuzIptu: string;
  camposExigencias: string;
  notes: string;
  ownerRnmFile: string;
  ownerCpfFile: string;
  rnmMaeFile: string;
  rnmPaiFile: string;
  rnmSupostoPaiFile: string;
  cpfMaeFile: string;
  cpfPaiFile: string;
  certidaoNascimentoFile: string;
  comprovanteEnderecoFile: string;
  declaracaoVizinhosFile: string;
  passaporteFile: string;
  passaporteMaeFile: string;
  passaportePaiRegistralFile: string;
  passaporteSupostoPaiFile: string;
  passaportePaiFile: string;
  passaporteCriancaFile: string;
  guiaPagaFile: string;
  peticaoConjuntaFile: string;
  termoPartilhasFile: string;
  guardaFile: string;
  procuracaoFile: string;
  peticaoClienteFile: string;
  procuracaoClienteFile: string;
  custasFile: string;
  peticaoInicialFile: string;
  matriculaImovelFile: string;
  contaAguaFile: string;
  contaLuzFile: string;
  iptuFile: string;
  aguaLuzIptuFile: string;
  camposExigenciasFile: string;
  [key: string]: string;
}

export default function NovaAcaoCivelPage() {
  const router = useRouter();
  const getStepTitle = (type: string, index: number) => {
    const standard = [
      "Cadastro de Informações",
      "Agendar Exame DNA",
      "Elaboração Procuração",
      "Aguardar procuração assinada",
      "À Protocolar",
      "Protocolado",
      "Processo Finalizado",
    ];
    const exameDna = [
      "Cadastro Documentos",
      "Agendar Exame DNA",
      "Elaboração Procuração",
      "Aguardar procuração assinada",
      "À Protocolar",
      "Protocolado",
      "Processo Finalizado",
    ];
    const steps = type === "Exame DNA" ? exameDna : standard;
    return steps[index] ?? `Passo ${index + 1}`;
  };
  const [formData, setFormData] = useState<FormData>({
    clientName: "",
    type: "",
    ownerName: "",
    ownerCpf: "",
    ownerRnm: "",
    endereco: "",
    rnmMae: "",
    rnmPai: "",
    rnmSupostoPai: "",
    nomeMae: "",
    nomePaiRegistral: "",
    nomeSupostoPai: "",
    nomeCrianca: "",
    cpfMae: "",
    cpfPai: "",
    cpfSupostoPai: "",
    certidaoNascimento: "",
    comprovanteEndereco: "",
    passaporte: "",
    guiaPaga: "",
    peticaoConjunta: "",
    termoPartilhas: "",
    guarda: "",
    procuracao: "",
    peticaoCliente: "",
    procuracaoCliente: "",
    custas: "",
    peticaoInicial: "",
    matriculaImovel: "",
    aguaLuzIptu: "",
    camposExigencias: "",
    notes: "",
    // Document URLs
    ownerRnmFile: "",
    ownerCpfFile: "",
    rnmMaeFile: "",
    rnmPaiFile: "",
    rnmSupostoPaiFile: "",
    cpfMaeFile: "",
    cpfPaiFile: "",
    certidaoNascimentoFile: "",
    comprovanteEnderecoFile: "",
    declaracaoVizinhosFile: "",
    passaporteFile: "",
    passaporteMaeFile: "",
    passaportePaiRegistralFile: "",
    passaporteSupostoPaiFile: "",
    passaportePaiFile: "",
    passaporteCriancaFile: "",
    guiaPagaFile: "",
    peticaoConjuntaFile: "",
    termoPartilhasFile: "",
    guardaFile: "",
    procuracaoFile: "",
    peticaoClienteFile: "",
    procuracaoClienteFile: "",
    custasFile: "",
    peticaoInicialFile: "",
    matriculaImovelFile: "",
    contaAguaFile: "",
    contaLuzFile: "",
    iptuFile: "",
    aguaLuzIptuFile: "",
    camposExigenciasFile: "",
  });

  const [uploadingDocs, setUploadingDocs] = useState({
    ownerRnm: false,
    ownerCpf: false,
    rnmMae: false,
    rnmPai: false,
    rnmSupostoPai: false,
    cpfMae: false,
    cpfPai: false,
    certidaoNascimento: false,
    comprovanteEndereco: false,
    declaracaoVizinhos: false,
    passaporte: false,
    passaporteMae: false,
    passaportePaiRegistral: false,
    passaporteSupostoPai: false,
    passaportePai: false,
    passaporteCrianca: false,
    guiaPaga: false,
    peticaoConjunta: false,
    termoPartilhas: false,
    guarda: false,
    procuracao: false,
    peticaoCliente: false,
    procuracaoCliente: false,
    custas: false,
    peticaoInicial: false,
    matriculaImovel: false,
    contaAgua: false,
    contaLuz: false,
    iptu: false,
    aguaLuzIptu: false,
    camposExigencias: false,
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<React.FormEvent | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDocs((prev) => ({ ...prev, [field]: true }));

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      // Para uploads temporários (quando ainda não temos o ID do caso), 
      // não enviamos fieldName nem moduleType para que a API trate como upload temporário
      // formDataUpload.append("fieldName", field);
      // formDataUpload.append("moduleType", "acoes_civeis");
      // formDataUpload.append("clientName", formData.clientName || "");

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formDataUpload
      });

      if (response.ok) {
        const data = await response.json();
        handleChange(`${field}File`, data.fileUrl);
        toast.success("Documento enviado com sucesso!");
      } else {
        const errorData = await response.json();
        console.error("Upload error:", errorData);
        toast.error(errorData.error || "Erro ao enviar documento");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Erro ao enviar documento");
    } finally {
      setUploadingDocs((prev) => ({ ...prev, [field]: false }));
    }
  };

  const removeDocument = (field: string) => {
    handleChange(`${field}File`, "");
    toast.success("Documento removido");
  };

  // Função auxiliar para converter uploads temporários em permanentes
  const convertTemporaryUploads = async (caseId: number) => {
    const documentFields = [
      'rnmMaeFile', 'rnmPaiFile', 'rnmSupostoPaiFile', 'certidaoNascimentoFile',
      'comprovanteEnderecoFile', 'ownerRnmFile', 'ownerCpfFile', 'declaracaoVizinhosFile',
      'matriculaImovelFile', 'contaAguaFile', 'contaLuzFile', 'iptuFile',
      'passaporteFile', 'guiaPagaFile', 'resultadoExameDnaFile',
      'procuracaoAnexadaFile', 'peticaoAnexadaFile', 'processoAnexadoFile',
      'documentosFinaisAnexadosFile', 'documentosProcessoFinalizadoFile',
      'passaporteMaeFile', 'passaportePaiRegistralFile', 'passaporteSupostoPaiFile',
      'passaportePaiFile', 'passaporteCriancaFile'
    ];

    const documentsToConvert = [];
    
    for (const field of documentFields) {
      const fileUrl = formData[field];
      if (fileUrl) {
        documentsToConvert.push({
          fieldName: field.replace('File', ''),
          fileUrl: fileUrl
        });
      }
    }

    if (documentsToConvert.length > 0) {
      try {
        // Chamar API para converter uploads temporários em permanentes
        const response = await fetch("/api/documents/convert-temporary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            caseId: caseId,
            moduleType: "acoes_civeis",
            clientName: formData.clientName,
            documents: documentsToConvert
          })
        });

        if (!response.ok) {
          console.error("Erro ao converter uploads temporários");
        }
      } catch (error) {
        console.error("Erro ao converter uploads temporários:", error);
      }
    }
  };

  const doCreate = async () => {
    console.log("📤 Enviando dados:", formData);

    try {
      const response = await fetch("/api/acoes-civeis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("📡 Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Ação criada:", data);
        
        // Converter uploads temporários em permanentes
        if (data.id) {
          await convertTemporaryUploads(data.id);
          try {
            await fetch('/api/alerts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                moduleType: 'Ações Cíveis',
                recordId: data.id,
                alertFor: 'admin',
                message: `${getStepTitle(formData.type, 0)} concluído para: ${formData.clientName} - ${formData.type}`,
                isRead: false
              })
            });
          } catch {}
        }
        
        toast.success("Ação criada com sucesso!");
        router.push("/dashboard/acoes-civeis");
      } else {
        const errorData = await response.json();
        console.error("❌ Erro na API:", errorData);
        toast.error(errorData.error || "Erro ao criar ação");
      }
    } catch (error) {
      console.error("❌ Error creating case:", error);
      toast.error("Erro ao criar ação");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingSubmit(e);
    setConfirmOpen(true);
  };

  // Helper to check if field should be shown
  const showFieldForType = (field: string) => {
    if (formData.type === "Alteração de Nome") {
      return [
        "nomeMae", "nomePaiRegistral", "nomeCrianca",
        "rnmMae", "rnmPai",
        "cpfMae", "cpfPai",
        "certidaoNascimento",
        "comprovanteEndereco",
        "passaporteMae", "passaportePai", "passaporteCrianca"
      ].includes(field);
    }
    if (formData.type === "Exame DNA") {
      return [
        "nomeMae", "nomePaiRegistral", "nomeSupostoPai", "nomeCrianca",
        "rnmMae", "rnmPai", "rnmSupostoPai",
        "cpfMae", "cpfPai", "cpfSupostoPai",
        "certidaoNascimento", "comprovanteEndereco",
        "passaporteMae", "passaportePaiRegistral", "passaporteSupostoPai"
      ].includes(field);
    }
    if (formData.type === "Guarda") {
      return [
        "nomeMae", "nomePaiRegistral", "nomeCrianca",
        "rnmMae", "rnmPai",
        "cpfMae", "cpfPai",
        "certidaoNascimento",
        "comprovanteEndereco",
        "passaporteMae", "passaportePai", "passaporteCrianca"
      ].includes(field);
    }
    if (formData.type === "Acordos de Guarda") {
      return [
        "nomeMae", "nomePaiRegistral", "nomeCrianca",
        "rnmMae", "rnmPai",
        "cpfMae", "cpfPai",
        "certidaoNascimento",
        "comprovanteEndereco",
        "passaporteMae", "passaportePai", "passaporteCrianca"
      ].includes(field);
    }
    if (formData.type === "Divórcio Consensual") {
      return [
        "nomeMae", "nomePaiRegistral",
        "rnmMae", "rnmPai",
        "cpfMae", "cpfPai",
        "certidaoNascimento",
        "comprovanteEndereco",
        "peticaoConjunta", "termoPartilhas", "guarda", "procuracao"
      ].includes(field);
    }
    if (formData.type === "Divórcio Litígio") {
      return [
        "nomeMae", "nomePaiRegistral",
        "rnmMae", "rnmPai",
        "cpfMae", "cpfPai",
        "certidaoNascimento",
        "comprovanteEndereco",
        "termoPartilhas", "guarda"
      ].includes(field);
    }
    if (formData.type === "Usucapião") {
      return [
        "ownerName", "ownerCpf", "ownerRnm",
        "endereco", "comprovanteEndereco",
        "declaracaoVizinhos",
        "matriculaImovel",
        "contaAgua", "contaLuz", "iptu",
        "peticaoInicial",
        "camposExigencias"
      ].includes(field);
    }
    // Default fields for other types
    return ["rnmMae", "rnmPai", "certidaoNascimento", "comprovanteEndereco", "passaporte"].includes(field);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/acoes-civeis">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Nova Ação Cível</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 border-b">
            <CardTitle className="text-2xl font-semibold">Informações da Ação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            {/* Basic Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome do Cliente</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleChange("clientName", e.target.value)}
                  className="h-12 border-2 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Ação</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleChange("type", value)}
                >
                <SelectTrigger className="h-12 border-2 focus:border-blue-500">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                  <SelectContent>
                    {CASE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Parent Information */}
            {formData.type && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Cadastro</h3>
                {formData.type === "Exame DNA" && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Dados de nomes</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("nomeMae") && (
                          <div className="space-y-2">
                            <Label htmlFor="nomeMae">Nome da Mãe</Label>
                            <Input
                              id="nomeMae"
                              value={formData.nomeMae}
                              onChange={(e) => handleChange("nomeMae", e.target.value)}
                              placeholder="Nome completo"
                            />
                          </div>
                        )}

                        {showFieldForType("nomePaiRegistral") && (
                          <div className="space-y-2">
                            <Label htmlFor="nomePaiRegistral">Nome do Pai Registral</Label>
                            <Input
                              id="nomePaiRegistral"
                              value={formData.nomePaiRegistral}
                              onChange={(e) => handleChange("nomePaiRegistral", e.target.value)}
                              placeholder="Nome completo"
                            />
                          </div>
                        )}

                        {showFieldForType("nomeSupostoPai") && (
                          <div className="space-y-2">
                            <Label htmlFor="nomeSupostoPai">Nome do Suposto Pai</Label>
                            <Input
                              id="nomeSupostoPai"
                              value={formData.nomeSupostoPai}
                              onChange={(e) => handleChange("nomeSupostoPai", e.target.value)}
                              placeholder="Nome completo"
                            />
                          </div>
                        )}

                        {showFieldForType("nomeCrianca") && (
                          <div className="space-y-2">
                            <Label htmlFor="nomeCrianca">Nome da Criança</Label>
                            <Input
                              id="nomeCrianca"
                              value={formData.nomeCrianca}
                              onChange={(e) => handleChange("nomeCrianca", e.target.value)}
                              placeholder="Nome completo"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Documentos de identificação (RNM / RNE / RG)</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("rnmMae") && (
                          <div className="space-y-2">
                            <Label htmlFor="rnmMae">RNM / RNE / RG Mãe</Label>
                            <Input
                              id="rnmMae"
                              value={formData.rnmMae}
                              onChange={(e) => handleChange("rnmMae", e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                              {!formData.rnmMaeFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="rnmMaeDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "rnmMae")}
                                    disabled={uploadingDocs.rnmMae}
                                  />
                                  <Label
                                    htmlFor="rnmMaeDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.rnmMae ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.rnmMaeFile && (
                              <DocumentPreview
                                fileUrl={formData.rnmMaeFile}
                                onRemove={() => removeDocument("rnmMae")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("rnmPai") && (
                          <div className="space-y-2">
                            <Label htmlFor="rnmPai">RNM / RNE / RG Pai</Label>
                            <Input
                              id="rnmPai"
                              value={formData.rnmPai}
                              onChange={(e) => handleChange("rnmPai", e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                              {!formData.rnmPaiFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="rnmPaiDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "rnmPai")}
                                    disabled={uploadingDocs.rnmPai}
                                  />
                                  <Label
                                    htmlFor="rnmPaiDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.rnmPai ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.rnmPaiFile && (
                              <DocumentPreview
                                fileUrl={formData.rnmPaiFile}
                                onRemove={() => removeDocument("rnmPai")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("rnmSupostoPai") && (
                          <div className="space-y-2">
                            <Label htmlFor="rnmSupostoPai">RNM / RNE / RG Suposto Pai</Label>
                            <Input
                              id="rnmSupostoPai"
                              value={formData.rnmSupostoPai}
                              onChange={(e) => handleChange("rnmSupostoPai", e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                              {!formData.rnmSupostoPaiFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="rnmSupostoPaiDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "rnmSupostoPai")}
                                    disabled={uploadingDocs.rnmSupostoPai}
                                  />
                                  <Label
                                    htmlFor="rnmSupostoPaiDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.rnmSupostoPai ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.rnmSupostoPaiFile && (
                              <DocumentPreview
                                fileUrl={formData.rnmSupostoPaiFile}
                                onRemove={() => removeDocument("rnmSupostoPai")}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Documentos da Criança</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("certidaoNascimento") && (
                          <div className="space-y-2">
                            <Label htmlFor="certidaoNascimento">Certidão de Nascimento da Criança</Label>
                            <Input
                              id="certidaoNascimento"
                              value={formData.certidaoNascimento}
                              onChange={(e) => handleChange("certidaoNascimento", e.target.value)}
                              placeholder="Número ou referência"
                            />
                            <div className="flex items-center gap-2">
                              {!formData.certidaoNascimentoFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="certidaoNascimentoDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "certidaoNascimento")}
                                    disabled={uploadingDocs.certidaoNascimento}
                                  />
                                  <Label
                                    htmlFor="certidaoNascimentoDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.certidaoNascimento ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.certidaoNascimentoFile && (
                              <DocumentPreview
                                fileUrl={formData.certidaoNascimentoFile}
                                onRemove={() => removeDocument("certidaoNascimento")}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Documentos de Residência</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("comprovanteEndereco") && (
                          <div className="space-y-2">
                            <Label htmlFor="comprovanteEndereco">Comprovante de Endereço</Label>
                            <Input
                              id="comprovanteEndereco"
                              value={formData.comprovanteEndereco}
                              onChange={(e) => handleChange("comprovanteEndereco", e.target.value)}
                              placeholder="Tipo de comprovante"
                            />
                            <div className="flex items-center gap-2">
                              {!formData.comprovanteEnderecoFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="comprovanteEnderecoDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "comprovanteEndereco")}
                                    disabled={uploadingDocs.comprovanteEndereco}
                                  />
                                  <Label
                                    htmlFor="comprovanteEnderecoDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.comprovanteEndereco ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.comprovanteEnderecoFile && (
                              <DocumentPreview
                                fileUrl={formData.comprovanteEnderecoFile}
                                onRemove={() => removeDocument("comprovanteEndereco")}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Passaportes</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("passaporteMae") && (
                          <div className="space-y-2">
                            <Label htmlFor="passaporteMaeDoc">Passaporte da Mãe</Label>
                            <div className="flex items-center gap-2">
                              {!formData.passaporteMaeFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="passaporteMaeDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "passaporteMae")}
                                    disabled={uploadingDocs.passaporteMae}
                                  />
                                  <Label
                                    htmlFor="passaporteMaeDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.passaporteMae ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.passaporteMaeFile && (
                              <DocumentPreview
                                fileUrl={formData.passaporteMaeFile}
                                onRemove={() => removeDocument("passaporteMae")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("passaportePaiRegistral") && (
                          <div className="space-y-2">
                            <Label htmlFor="passaportePaiRegistralDoc">Passaporte do Pai Registral</Label>
                            <div className="flex items-center gap-2">
                              {!formData.passaportePaiRegistralFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="passaportePaiRegistralDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "passaportePaiRegistral")}
                                    disabled={uploadingDocs.passaportePaiRegistral}
                                  />
                                  <Label
                                    htmlFor="passaportePaiRegistralDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.passaportePaiRegistral ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.passaportePaiRegistralFile && (
                              <DocumentPreview
                                fileUrl={formData.passaportePaiRegistralFile}
                                onRemove={() => removeDocument("passaportePaiRegistral")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("passaporteSupostoPai") && (
                          <div className="space-y-2">
                            <Label htmlFor="passaporteSupostoPaiDoc">Passaporte do Suposto Pai</Label>
                            <div className="flex items-center gap-2">
                              {!formData.passaporteSupostoPaiFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="passaporteSupostoPaiDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "passaporteSupostoPai")}
                                    disabled={uploadingDocs.passaporteSupostoPai}
                                  />
                                  <Label
                                    htmlFor="passaporteSupostoPaiDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.passaporteSupostoPai ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.passaporteSupostoPaiFile && (
                              <DocumentPreview
                                fileUrl={formData.passaporteSupostoPaiFile}
                                onRemove={() => removeDocument("passaporteSupostoPai")}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {(formData.type === "Alteração de Nome" || formData.type === "Guarda" || formData.type === "Acordos de Guarda") && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Dados da Família</h4>
                      <div className="grid gap-4 md:grid-cols-3">
                        {showFieldForType("nomeMae") && (
                          <div className="space-y-2">
                            <Label htmlFor="nomeMae">Nome da Mãe</Label>
                            <Input
                              id="nomeMae"
                              value={formData.nomeMae}
                              onChange={(e) => handleChange("nomeMae", e.target.value)}
                              placeholder="Nome completo"
                            />
                          </div>
                        )}
                        {showFieldForType("nomePaiRegistral") && (
                          <div className="space-y-2">
                            <Label htmlFor="nomePaiRegistral">Nome do Pai</Label>
                            <Input
                              id="nomePaiRegistral"
                              value={formData.nomePaiRegistral}
                              onChange={(e) => handleChange("nomePaiRegistral", e.target.value)}
                              placeholder="Nome completo"
                            />
                          </div>
                        )}
                        {showFieldForType("nomeCrianca") && (
                          <div className="space-y-2">
                            <Label htmlFor="nomeCrianca">Nome da Criança</Label>
                            <Input
                              id="nomeCrianca"
                              value={formData.nomeCrianca}
                              onChange={(e) => handleChange("nomeCrianca", e.target.value)}
                              placeholder="Nome completo"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Documentos dos Responsáveis</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("rnmMae") && (
                          <div className="space-y-2">
                            <Label htmlFor="rnmMae">RNM / RNE / RG Mãe</Label>
                            <Input
                              id="rnmMae"
                              value={formData.rnmMae}
                              onChange={(e) => handleChange("rnmMae", e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                              {!formData.rnmMaeFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="rnmMaeDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "rnmMae")}
                                    disabled={uploadingDocs.rnmMae}
                                  />
                                  <Label
                                    htmlFor="rnmMaeDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.rnmMae ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.rnmMaeFile && (
                              <DocumentPreview
                                fileUrl={formData.rnmMaeFile}
                                onRemove={() => removeDocument("rnmMae")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("rnmPai") && (
                          <div className="space-y-2">
                            <Label htmlFor="rnmPai">RNM / RNE / RG Pai</Label>
                            <Input
                              id="rnmPai"
                              value={formData.rnmPai}
                              onChange={(e) => handleChange("rnmPai", e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                              {!formData.rnmPaiFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="rnmPaiDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "rnmPai")}
                                    disabled={uploadingDocs.rnmPai}
                                  />
                                  <Label
                                    htmlFor="rnmPaiDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.rnmPai ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.rnmPaiFile && (
                              <DocumentPreview
                                fileUrl={formData.rnmPaiFile}
                                onRemove={() => removeDocument("rnmPai")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("cpfMae") && (
                          <div className="space-y-2">
                            <Label htmlFor="cpfMae">CPF Mãe</Label>
                            <Input
                              id="cpfMae"
                              value={formData.cpfMae}
                              onChange={(e) => handleChange("cpfMae", e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                              {!formData.cpfMaeFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="cpfMaeDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "cpfMae")}
                                    disabled={uploadingDocs.cpfMae}
                                  />
                                  <Label
                                    htmlFor="cpfMaeDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.cpfMae ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.cpfMaeFile && (
                              <DocumentPreview
                                fileUrl={formData.cpfMaeFile}
                                onRemove={() => removeDocument("cpfMae")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("cpfPai") && (
                          <div className="space-y-2">
                            <Label htmlFor="cpfPai">CPF Pai</Label>
                            <Input
                              id="cpfPai"
                              value={formData.cpfPai}
                              onChange={(e) => handleChange("cpfPai", e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                              {!formData.cpfPaiFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="cpfPaiDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "cpfPai")}
                                    disabled={uploadingDocs.cpfPai}
                                  />
                                  <Label
                                    htmlFor="cpfPaiDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.cpfPai ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.cpfPaiFile && (
                              <DocumentPreview
                                fileUrl={formData.cpfPaiFile}
                                onRemove={() => removeDocument("cpfPai")}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Documentos da Criança</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("certidaoNascimento") && (
                          <div className="space-y-2">
                            <Label htmlFor="certidaoNascimento">Certidão de Nascimento da Criança</Label>
                            <Input
                              id="certidaoNascimento"
                              value={formData.certidaoNascimento}
                              onChange={(e) => handleChange("certidaoNascimento", e.target.value)}
                              placeholder="Número ou referência"
                            />
                            <div className="flex items-center gap-2">
                              {!formData.certidaoNascimentoFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="certidaoNascimentoDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "certidaoNascimento")}
                                    disabled={uploadingDocs.certidaoNascimento}
                                  />
                                  <Label
                                    htmlFor="certidaoNascimentoDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.certidaoNascimento ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.certidaoNascimentoFile && (
                              <DocumentPreview
                                fileUrl={formData.certidaoNascimentoFile}
                                onRemove={() => removeDocument("certidaoNascimento")}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Comprovação de Residência</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("comprovanteEndereco") && (
                          <div className="space-y-2">
                            <Label htmlFor="comprovanteEndereco">Comprovante de Endereço</Label>
                            <Input
                              id="comprovanteEndereco"
                              value={formData.comprovanteEndereco}
                              onChange={(e) => handleChange("comprovanteEndereco", e.target.value)}
                              placeholder="Tipo de comprovante"
                            />
                            <div className="flex items-center gap-2">
                              {!formData.comprovanteEnderecoFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="comprovanteEnderecoDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "comprovanteEndereco")}
                                    disabled={uploadingDocs.comprovanteEndereco}
                                  />
                                  <Label
                                    htmlFor="comprovanteEnderecoDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.comprovanteEndereco ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.comprovanteEnderecoFile && (
                              <DocumentPreview
                                fileUrl={formData.comprovanteEnderecoFile}
                                onRemove={() => removeDocument("comprovanteEndereco")}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Passaportes</h4>
                      <div className="grid gap-4 md:grid-cols-3">
                        {showFieldForType("passaporteMae") && (
                          <div className="space-y-2">
                            <Label htmlFor="passaporteMaeDoc">Passaporte da Mãe</Label>
                            <div className="flex items-center gap-2">
                              {!formData.passaporteMaeFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="passaporteMaeDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "passaporteMae")}
                                    disabled={uploadingDocs.passaporteMae}
                                  />
                                  <Label
                                    htmlFor="passaporteMaeDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.passaporteMae ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.passaporteMaeFile && (
                              <DocumentPreview
                                fileUrl={formData.passaporteMaeFile}
                                onRemove={() => removeDocument("passaporteMae")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("passaportePai") && (
                          <div className="space-y-2">
                            <Label htmlFor="passaportePaiDoc">Passaporte do Pai</Label>
                            <div className="flex items-center gap-2">
                              {!formData.passaportePaiFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="passaportePaiDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "passaportePai")}
                                    disabled={uploadingDocs.passaportePai}
                                  />
                                  <Label
                                    htmlFor="passaportePaiDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.passaportePai ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.passaportePaiFile && (
                              <DocumentPreview
                                fileUrl={formData.passaportePaiFile}
                                onRemove={() => removeDocument("passaportePai")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("passaporteCrianca") && (
                          <div className="space-y-2">
                            <Label htmlFor="passaporteCriancaDoc">Passaporte da Criança</Label>
                            <div className="flex items-center gap-2">
                              {!formData.passaporteCriancaFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="passaporteCriancaDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "passaporteCrianca")}
                                    disabled={uploadingDocs.passaporteCrianca}
                                  />
                                  <Label
                                    htmlFor="passaporteCriancaDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.passaporteCrianca ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.passaporteCriancaFile && (
                              <DocumentPreview
                                fileUrl={formData.passaporteCriancaFile}
                                onRemove={() => removeDocument("passaporteCrianca")}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {formData.type === "Divórcio Consensual" && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Informações Básicas</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("nomeMae") && (
                          <div className="space-y-2">
                            <Label htmlFor="nomeMae">Nome da Parte 1</Label>
                            <Input
                              id="nomeMae"
                              value={formData.nomeMae}
                              onChange={(e) => handleChange("nomeMae", e.target.value)}
                              placeholder="Nome completo"
                            />
                          </div>
                        )}
                        {showFieldForType("nomePaiRegistral") && (
                          <div className="space-y-2">
                            <Label htmlFor="nomePaiRegistral">Nome da Parte 2</Label>
                            <Input
                              id="nomePaiRegistral"
                              value={formData.nomePaiRegistral}
                              onChange={(e) => handleChange("nomePaiRegistral", e.target.value)}
                              placeholder="Nome completo"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Documentos Pessoais</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("rnmMae") && (
                          <div className="space-y-2">
                            <Label htmlFor="rnmMae">RNM da Parte 1</Label>
                            <Input
                              id="rnmMae"
                              value={formData.rnmMae}
                              onChange={(e) => handleChange("rnmMae", e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                              {!formData.rnmMaeFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="rnmMaeDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "rnmMae")}
                                    disabled={uploadingDocs.rnmMae}
                                  />
                                  <Label
                                    htmlFor="rnmMaeDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.rnmMae ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.rnmMaeFile && (
                              <DocumentPreview
                                fileUrl={formData.rnmMaeFile}
                                onRemove={() => removeDocument("rnmMae")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("rnmPai") && (
                          <div className="space-y-2">
                            <Label htmlFor="rnmPai">RNM da Parte 2</Label>
                            <Input
                              id="rnmPai"
                              value={formData.rnmPai}
                              onChange={(e) => handleChange("rnmPai", e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                              {!formData.rnmPaiFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="rnmPaiDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "rnmPai")}
                                    disabled={uploadingDocs.rnmPai}
                                  />
                                  <Label
                                    htmlFor="rnmPaiDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.rnmPai ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.rnmPaiFile && (
                              <DocumentPreview
                                fileUrl={formData.rnmPaiFile}
                                onRemove={() => removeDocument("rnmPai")}
                              />
                            )}
                          </div>
                        )}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("cpfMae") && (
                          <div className="space-y-2">
                            <Label htmlFor="cpfMae">CPF da Parte 1</Label>
                            <Input
                              id="cpfMae"
                              value={formData.cpfMae}
                              onChange={(e) => handleChange("cpfMae", e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                              {!formData.cpfMaeFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="cpfMaeDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "cpfMae")}
                                    disabled={uploadingDocs.cpfMae}
                                  />
                                  <Label
                                    htmlFor="cpfMaeDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.cpfMae ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.cpfMaeFile && (
                              <DocumentPreview
                                fileUrl={formData.cpfMaeFile}
                                onRemove={() => removeDocument("cpfMae")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("cpfPai") && (
                          <div className="space-y-2">
                            <Label htmlFor="cpfPai">CPF da Parte 2</Label>
                            <Input
                              id="cpfPai"
                              value={formData.cpfPai}
                              onChange={(e) => handleChange("cpfPai", e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                              {!formData.cpfPaiFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="cpfPaiDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "cpfPai")}
                                    disabled={uploadingDocs.cpfPai}
                                  />
                                  <Label
                                    htmlFor="cpfPaiDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.cpfPai ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.cpfPaiFile && (
                              <DocumentPreview
                                fileUrl={formData.cpfPaiFile}
                                onRemove={() => removeDocument("cpfPai")}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Filhos (se houver)</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("certidaoNascimento") && (
                          <div className="space-y-2">
                            <Label htmlFor="certidaoNascimento">Certidão de Nascimento da Criança</Label>
                            <Input
                              id="certidaoNascimento"
                              value={formData.certidaoNascimento}
                              onChange={(e) => handleChange("certidaoNascimento", e.target.value)}
                              placeholder="Número ou referência"
                            />
                            <div className="flex items-center gap-2">
                              {!formData.certidaoNascimentoFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="certidaoNascimentoDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "certidaoNascimento")}
                                    disabled={uploadingDocs.certidaoNascimento}
                                  />
                                  <Label
                                    htmlFor="certidaoNascimentoDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.certidaoNascimento ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.certidaoNascimentoFile && (
                              <DocumentPreview
                                fileUrl={formData.certidaoNascimentoFile}
                                onRemove={() => removeDocument("certidaoNascimento")}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Comprovação de Residência</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("comprovanteEndereco") && (
                          <div className="space-y-2">
                            <Label htmlFor="comprovanteEndereco">Comprovante de Endereço</Label>
                            <Input
                              id="comprovanteEndereco"
                              value={formData.comprovanteEndereco}
                              onChange={(e) => handleChange("comprovanteEndereco", e.target.value)}
                              placeholder="Tipo de comprovante"
                            />
                            <div className="flex items-center gap-2">
                              {!formData.comprovanteEnderecoFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="comprovanteEnderecoDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "comprovanteEndereco")}
                                    disabled={uploadingDocs.comprovanteEndereco}
                                  />
                                  <Label
                                    htmlFor="comprovanteEnderecoDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.comprovanteEndereco ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.comprovanteEnderecoFile && (
                              <DocumentPreview
                                fileUrl={formData.comprovanteEnderecoFile}
                                onRemove={() => removeDocument("comprovanteEndereco")}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Documentos Jurídicos</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("peticaoConjunta") && (
                          <div className="space-y-2">
                            <Label htmlFor="peticaoConjunta">Petição Conjunta</Label>
                            <Input
                              id="peticaoConjunta"
                              value={formData.peticaoConjunta}
                              onChange={(e) => handleChange("peticaoConjunta", e.target.value)}
                              placeholder="Número ou referência"
                            />
                            <div className="flex items-center gap-2">
                              {!formData.peticaoConjuntaFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="peticaoConjuntaDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "peticaoConjunta")}
                                    disabled={uploadingDocs.peticaoConjunta}
                                  />
                                  <Label
                                    htmlFor="peticaoConjuntaDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.peticaoConjunta ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.peticaoConjuntaFile && (
                              <DocumentPreview
                                fileUrl={formData.peticaoConjuntaFile}
                                onRemove={() => removeDocument("peticaoConjunta")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("termoPartilhas") && (
                          <div className="space-y-2">
                            <Label htmlFor="termoPartilhas">Termo de Partilhas (Caso possuir bens)</Label>
                            <Input
                              id="termoPartilhas"
                              value={formData.termoPartilhas}
                              onChange={(e) => handleChange("termoPartilhas", e.target.value)}
                              placeholder="Número ou referência"
                            />
                            <div className="flex items-center gap-2">
                              {!formData.termoPartilhasFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="termoPartilhasDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "termoPartilhas")}
                                    disabled={uploadingDocs.termoPartilhas}
                                  />
                                  <Label
                                    htmlFor="termoPartilhasDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.termoPartilhas ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.termoPartilhasFile && (
                              <DocumentPreview
                                fileUrl={formData.termoPartilhasFile}
                                onRemove={() => removeDocument("termoPartilhas")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("guarda") && (
                          <div className="space-y-2">
                            <Label htmlFor="guarda">Guarda (caso tiver filhos)</Label>
                            <Input
                              id="guarda"
                              value={formData.guarda}
                              onChange={(e) => handleChange("guarda", e.target.value)}
                              placeholder="Número ou referência"
                            />
                            <div className="flex items-center gap-2">
                              {!formData.guardaFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="guardaDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "guarda")}
                                    disabled={uploadingDocs.guarda}
                                  />
                                  <Label
                                    htmlFor="guardaDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.guarda ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.guardaFile && (
                              <DocumentPreview
                                fileUrl={formData.guardaFile}
                                onRemove={() => removeDocument("guarda")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("procuracao") && (
                          <div className="space-y-2">
                            <Label htmlFor="procuracao">Procuração</Label>
                            <Input
                              id="procuracao"
                              value={formData.procuracao}
                              onChange={(e) => handleChange("procuracao", e.target.value)}
                              placeholder="Número ou referência"
                            />
                            <div className="flex items-center gap-2">
                              {!formData.procuracaoFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="procuracaoDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "procuracao")}
                                    disabled={uploadingDocs.procuracao}
                                  />
                                  <Label
                                    htmlFor="procuracaoDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.procuracao ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.procuracaoFile && (
                              <DocumentPreview
                                fileUrl={formData.procuracaoFile}
                                onRemove={() => removeDocument("procuracao")}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {formData.type === "Divórcio Litígio" && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Informações Básicas</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("nomeMae") && (
                          <div className="space-y-2">
                            <Label htmlFor="nomeMae">Nome da Parte 1</Label>
                            <Input
                              id="nomeMae"
                              value={formData.nomeMae}
                              onChange={(e) => handleChange("nomeMae", e.target.value)}
                              placeholder="Nome completo"
                            />
                          </div>
                        )}
                        {showFieldForType("nomePaiRegistral") && (
                          <div className="space-y-2">
                            <Label htmlFor="nomePaiRegistral">Nome da Parte 2</Label>
                            <Input
                              id="nomePaiRegistral"
                              value={formData.nomePaiRegistral}
                              onChange={(e) => handleChange("nomePaiRegistral", e.target.value)}
                              placeholder="Nome completo"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Documentos Pessoais</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("rnmMae") && (
                          <div className="space-y-2">
                            <Label htmlFor="rnmMae">RNM da Parte 1</Label>
                            <Input
                              id="rnmMae"
                              value={formData.rnmMae}
                              onChange={(e) => handleChange("rnmMae", e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                              {!formData.rnmMaeFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="rnmMaeDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "rnmMae")}
                                    disabled={uploadingDocs.rnmMae}
                                  />
                                  <Label
                                    htmlFor="rnmMaeDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.rnmMae ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.rnmMaeFile && (
                              <DocumentPreview
                                fileUrl={formData.rnmMaeFile}
                                onRemove={() => removeDocument("rnmMae")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("rnmPai") && (
                          <div className="space-y-2">
                            <Label htmlFor="rnmPai">RNM da Parte 2</Label>
                            <Input
                              id="rnmPai"
                              value={formData.rnmPai}
                              onChange={(e) => handleChange("rnmPai", e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                              {!formData.rnmPaiFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="rnmPaiDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "rnmPai")}
                                    disabled={uploadingDocs.rnmPai}
                                  />
                                  <Label
                                    htmlFor="rnmPaiDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.rnmPai ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.rnmPaiFile && (
                              <DocumentPreview
                                fileUrl={formData.rnmPaiFile}
                                onRemove={() => removeDocument("rnmPai")}
                              />
                            )}
                          </div>
                        )}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("cpfMae") && (
                          <div className="space-y-2">
                            <Label htmlFor="cpfMae">CPF da Parte 1</Label>
                            <Input
                              id="cpfMae"
                              value={formData.cpfMae}
                              onChange={(e) => handleChange("cpfMae", e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                              {!formData.cpfMaeFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="cpfMaeDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "cpfMae")}
                                    disabled={uploadingDocs.cpfMae}
                                  />
                                  <Label
                                    htmlFor="cpfMaeDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.cpfMae ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.cpfMaeFile && (
                              <DocumentPreview
                                fileUrl={formData.cpfMaeFile}
                                onRemove={() => removeDocument("cpfMae")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("cpfPai") && (
                          <div className="space-y-2">
                            <Label htmlFor="cpfPai">CPF da Parte 2</Label>
                            <Input
                              id="cpfPai"
                              value={formData.cpfPai}
                              onChange={(e) => handleChange("cpfPai", e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                              {!formData.cpfPaiFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="cpfPaiDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "cpfPai")}
                                    disabled={uploadingDocs.cpfPai}
                                  />
                                  <Label
                                    htmlFor="cpfPaiDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.cpfPai ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.cpfPaiFile && (
                              <DocumentPreview
                                fileUrl={formData.cpfPaiFile}
                                onRemove={() => removeDocument("cpfPai")}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Filhos (se houver)</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("certidaoNascimento") && (
                          <div className="space-y-2">
                            <Label htmlFor="certidaoNascimento">Certidão de Nascimento da Criança</Label>
                            <Input
                              id="certidaoNascimento"
                              value={formData.certidaoNascimento}
                              onChange={(e) => handleChange("certidaoNascimento", e.target.value)}
                              placeholder="Número ou referência"
                            />
                            <div className="flex items-center gap-2">
                              {!formData.certidaoNascimentoFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="certidaoNascimentoDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "certidaoNascimento")}
                                    disabled={uploadingDocs.certidaoNascimento}
                                  />
                                  <Label
                                    htmlFor="certidaoNascimentoDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.certidaoNascimento ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.certidaoNascimentoFile && (
                              <DocumentPreview
                                fileUrl={formData.certidaoNascimentoFile}
                                onRemove={() => removeDocument("certidaoNascimento")}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Comprovação de Residência</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("comprovanteEndereco") && (
                          <div className="space-y-2">
                            <Label htmlFor="comprovanteEndereco">Comprovante de Endereço</Label>
                            <Input
                              id="comprovanteEndereco"
                              value={formData.comprovanteEndereco}
                              onChange={(e) => handleChange("comprovanteEndereco", e.target.value)}
                              placeholder="Tipo de comprovante"
                            />
                            <div className="flex items-center gap-2">
                              {!formData.comprovanteEnderecoFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="comprovanteEnderecoDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "comprovanteEndereco")}
                                    disabled={uploadingDocs.comprovanteEndereco}
                                  />
                                  <Label
                                    htmlFor="comprovanteEnderecoDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.comprovanteEndereco ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.comprovanteEnderecoFile && (
                              <DocumentPreview
                                fileUrl={formData.comprovanteEnderecoFile}
                                onRemove={() => removeDocument("comprovanteEndereco")}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {(showFieldForType("termoPartilhas") || showFieldForType("guarda")) && (
                      <div className="space-y-2">
                        <h4 className="text-base font-semibold">Documentos do Processo</h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          {showFieldForType("termoPartilhas") && (
                            <div className="space-y-2">
                              <Label htmlFor="termoPartilhas">Termo de Partilhas (Caso possuir bens)</Label>
                              <Input
                                id="termoPartilhas"
                                value={formData.termoPartilhas}
                                onChange={(e) => handleChange("termoPartilhas", e.target.value)}
                                placeholder="Número ou referência"
                              />
                              <div className="flex items-center gap-2">
                                {!formData.termoPartilhasFile ? (
                                  <>
                                    <input
                                      type="file"
                                      id="termoPartilhasDoc"
                                      className="hidden"
                                      onChange={(e) => handleDocumentUpload(e, "termoPartilhas")}
                                      disabled={uploadingDocs.termoPartilhas}
                                    />
                                    <Label
                                      htmlFor="termoPartilhasDoc"
                                      className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                    >
                                      <Upload className="h-4 w-4" />
                                      {uploadingDocs.termoPartilhas ? "Enviando..." : "Upload Documento"}
                                    </Label>
                                  </>
                                ) : null}
                              </div>
                              {formData.termoPartilhasFile && (
                                <DocumentPreview
                                  fileUrl={formData.termoPartilhasFile}
                                  onRemove={() => removeDocument("termoPartilhas")}
                                />
                              )}
                            </div>
                          )}

                          {showFieldForType("guarda") && (
                            <div className="space-y-2">
                              <Label htmlFor="guarda">Guarda (caso tiver filhos)</Label>
                              <Input
                                id="guarda"
                                value={formData.guarda}
                                onChange={(e) => handleChange("guarda", e.target.value)}
                                placeholder="Número ou referência"
                              />
                              <div className="flex items-center gap-2">
                                {!formData.guardaFile ? (
                                  <>
                                    <input
                                      type="file"
                                      id="guardaDoc"
                                      className="hidden"
                                      onChange={(e) => handleDocumentUpload(e, "guarda")}
                                      disabled={uploadingDocs.guarda}
                                    />
                                    <Label
                                      htmlFor="guardaDoc"
                                      className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                    >
                                      <Upload className="h-4 w-4" />
                                      {uploadingDocs.guarda ? "Enviando..." : "Upload Documento"}
                                    </Label>
                                  </>
                                ) : null}
                              </div>
                              {formData.guardaFile && (
                                <DocumentPreview
                                  fileUrl={formData.guardaFile}
                                  onRemove={() => removeDocument("guarda")}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {formData.type === "Usucapião" && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Cadastro</h4>
                      <div className="space-y-4">
                        <h5 className="text-sm font-medium">Dono do Imóvel</h5>
                        <div className="grid gap-4 md:grid-cols-2">
                          {showFieldForType("ownerName") && (
                            <div className="space-y-2">
                              <Label htmlFor="ownerName">Nome Completo</Label>
                              <Input
                                id="ownerName"
                                value={formData.ownerName}
                                onChange={(e) => handleChange("ownerName", e.target.value)}
                                placeholder="Nome completo"
                              />
                            </div>
                          )}
                          {showFieldForType("ownerCpf") && (
                            <div className="space-y-2">
                              <Label htmlFor="ownerCpf">CPF</Label>
                              <Input
                                id="ownerCpf"
                                value={formData.ownerCpf}
                                onChange={(e) => handleChange("ownerCpf", e.target.value)}
                                placeholder="000.000.000-00"
                              />
                              <div className="flex items-center gap-2">
                                {!formData.ownerCpfFile ? (
                                  <>
                                    <input
                                      type="file"
                                      id="ownerCpfDoc"
                                      className="hidden"
                                      onChange={(e) => handleDocumentUpload(e, "ownerCpf")}
                                      disabled={uploadingDocs.ownerCpf}
                                    />
                                    <Label
                                      htmlFor="ownerCpfDoc"
                                      className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                    >
                                      <Upload className="h-4 w-4" />
                                      {uploadingDocs.ownerCpf ? "Enviando..." : "Upload Documento"}
                                    </Label>
                                  </>
                                ) : null}
                              </div>
                              {formData.ownerCpfFile && (
                                <DocumentPreview
                                  fileUrl={formData.ownerCpfFile}
                                  onRemove={() => removeDocument("ownerCpf")}
                                />
                              )}
                            </div>
                          )}
                          {showFieldForType("ownerRnm") && (
                            <div className="space-y-2">
                              <Label htmlFor="ownerRnm">RNM</Label>
                              <Input
                                id="ownerRnm"
                                value={formData.ownerRnm}
                                onChange={(e) => handleChange("ownerRnm", e.target.value)}
                                placeholder="RNM / RNE / RG"
                              />
                              <div className="flex items-center gap-2">
                                {!formData.ownerRnmFile ? (
                                  <>
                                    <input
                                      type="file"
                                      id="ownerRnmDoc"
                                      className="hidden"
                                      onChange={(e) => handleDocumentUpload(e, "ownerRnm")}
                                      disabled={uploadingDocs.ownerRnm}
                                    />
                                    <Label
                                      htmlFor="ownerRnmDoc"
                                      className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                    >
                                      <Upload className="h-4 w-4" />
                                      {uploadingDocs.ownerRnm ? "Enviando..." : "Upload Documento"}
                                    </Label>
                                  </>
                                ) : null}
                              </div>
                              {formData.ownerRnmFile && (
                                <DocumentPreview
                                  fileUrl={formData.ownerRnmFile}
                                  onRemove={() => removeDocument("ownerRnm")}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Endereço</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("endereco") && (
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="endereco">Endereço</Label>
                            <Input
                              id="endereco"
                              value={formData.endereco}
                              onChange={(e) => handleChange("endereco", e.target.value)}
                              placeholder="Rua, número, bairro, cidade"
                            />
                          </div>
                        )}
                        {showFieldForType("comprovanteEndereco") && (
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="comprovanteEnderecoDoc">Comprovante de Endereço</Label>
                            <div className="flex items-center gap-2">
                              {!formData.comprovanteEnderecoFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="comprovanteEnderecoDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "comprovanteEndereco")}
                                    disabled={uploadingDocs.comprovanteEndereco}
                                  />
                                  <Label
                                    htmlFor="comprovanteEnderecoDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.comprovanteEndereco ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.comprovanteEnderecoFile && (
                              <DocumentPreview
                                fileUrl={formData.comprovanteEnderecoFile}
                                onRemove={() => removeDocument("comprovanteEndereco")}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-semibold">Documentos Complementares</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {showFieldForType("declaracaoVizinhos") && (
                          <div className="space-y-2">
                            <Label htmlFor="declaracaoVizinhosDoc">Declaração dos Vizinhos</Label>
                            <div className="flex items-center gap-2">
                              {!formData.declaracaoVizinhosFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="declaracaoVizinhosDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "declaracaoVizinhos")}
                                    disabled={uploadingDocs.declaracaoVizinhos}
                                  />
                                  <Label
                                    htmlFor="declaracaoVizinhosDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.declaracaoVizinhos ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.declaracaoVizinhosFile && (
                              <DocumentPreview
                                fileUrl={formData.declaracaoVizinhosFile}
                                onRemove={() => removeDocument("declaracaoVizinhos")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("matriculaImovel") && (
                          <div className="space-y-2">
                            <Label htmlFor="matriculaImovelDoc">Matrícula do Imóvel</Label>
                            <div className="flex items-center gap-2">
                              {!formData.matriculaImovelFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="matriculaImovelDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "matriculaImovel")}
                                    disabled={uploadingDocs.matriculaImovel}
                                  />
                                  <Label
                                    htmlFor="matriculaImovelDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.matriculaImovel ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.matriculaImovelFile && (
                              <DocumentPreview
                                fileUrl={formData.matriculaImovelFile}
                                onRemove={() => removeDocument("matriculaImovel")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("contaAgua") && (
                          <div className="space-y-2">
                            <Label htmlFor="contaAguaDoc">Conta de Água</Label>
                            <div className="flex items-center gap-2">
                              {!formData.contaAguaFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="contaAguaDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "contaAgua")}
                                    disabled={uploadingDocs.contaAgua}
                                  />
                                  <Label
                                    htmlFor="contaAguaDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.contaAgua ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.contaAguaFile && (
                              <DocumentPreview
                                fileUrl={formData.contaAguaFile}
                                onRemove={() => removeDocument("contaAgua")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("contaLuz") && (
                          <div className="space-y-2">
                            <Label htmlFor="contaLuzDoc">Conta de Luz</Label>
                            <div className="flex items-center gap-2">
                              {!formData.contaLuzFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="contaLuzDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "contaLuz")}
                                    disabled={uploadingDocs.contaLuz}
                                  />
                                  <Label
                                    htmlFor="contaLuzDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.contaLuz ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.contaLuzFile && (
                              <DocumentPreview
                                fileUrl={formData.contaLuzFile}
                                onRemove={() => removeDocument("contaLuz")}
                              />
                            )}
                          </div>
                        )}

                        {showFieldForType("iptu") && (
                          <div className="space-y-2">
                            <Label htmlFor="iptuDoc">IPTU</Label>
                            <div className="flex items-center gap-2">
                              {!formData.iptuFile ? (
                                <>
                                  <input
                                    type="file"
                                    id="iptuDoc"
                                    className="hidden"
                                    onChange={(e) => handleDocumentUpload(e, "iptu")}
                                    disabled={uploadingDocs.iptu}
                                  />
                                  <Label
                                    htmlFor="iptuDoc"
                                    className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    <Upload className="h-4 w-4" />
                                    {uploadingDocs.iptu ? "Enviando..." : "Upload Documento"}
                                  </Label>
                                </>
                              ) : null}
                            </div>
                            {formData.iptuFile && (
                              <DocumentPreview
                                fileUrl={formData.iptuFile}
                                onRemove={() => removeDocument("iptu")}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>


                    {showFieldForType("camposExigencias") && (
                      <div className="space-y-2">
                        <h4 className="text-base font-semibold">Exigências</h4>
                        <Label htmlFor="camposExigencias">Campos para Cumprir Exigências</Label>
                        <Textarea
                          id="camposExigencias"
                          value={formData.camposExigencias}
                          onChange={(e) => handleChange("camposExigencias", e.target.value)}
                          placeholder="Descreva as exigências a serem cumpridas"
                          rows={3}
                        />
                        <div className="flex items-center gap-2">
                          {!formData.camposExigenciasFile ? (
                            <>
                              <input
                                type="file"
                                id="camposExigenciasDoc"
                                className="hidden"
                                onChange={(e) => handleDocumentUpload(e, "camposExigencias")}
                                disabled={uploadingDocs.camposExigencias}
                              />
                              <Label
                                htmlFor="camposExigenciasDoc"
                                className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                              >
                                <Upload className="h-4 w-4" />
                                {uploadingDocs.camposExigencias ? "Enviando..." : "Upload Documento"}
                              </Label>
                            </>
                          ) : null}
                        </div>
                        {formData.camposExigenciasFile && (
                          <DocumentPreview
                            fileUrl={formData.camposExigenciasFile}
                            onRemove={() => removeDocument("camposExigencias")}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
                {formData.type !== "Exame DNA" && formData.type !== "Alteração de Nome" && formData.type !== "Guarda" && formData.type !== "Acordos de Guarda" && formData.type !== "Divórcio Consensual" && formData.type !== "Divórcio Litígio" && formData.type !== "Usucapião" && (
                  <div className="grid gap-4 md:grid-cols-2">
                  {showFieldForType("rnmMae") && (
                    <div className="space-y-2">
                      <Label htmlFor="rnmMae">RNM / RNE / RG Mãe</Label>
                      <Input
                        id="rnmMae"
                        value={formData.rnmMae}
                        onChange={(e) => handleChange("rnmMae", e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        {!formData.rnmMaeFile ? (
                          <>
                            <input
                              type="file"
                              id="rnmMaeDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "rnmMae")}
                              disabled={uploadingDocs.rnmMae}
                            />
                            <Label
                              htmlFor="rnmMaeDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.rnmMae ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.rnmMaeFile && (
                        <DocumentPreview
                          fileUrl={formData.rnmMaeFile}
                          onRemove={() => removeDocument("rnmMae")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("rnmMae") && (
                    <div className="space-y-2">
                      <Label htmlFor="nomeMae">Nome da Mãe</Label>
                      <Input
                        id="nomeMae"
                        value={formData.nomeMae}
                        onChange={(e) => handleChange("nomeMae", e.target.value)}
                        placeholder="Nome completo"
                      />
                    </div>
                  )}

                  {showFieldForType("rnmPai") && (
                    <div className="space-y-2">
                      <Label htmlFor="rnmPai">RNM / RNE / RG Pai</Label>
                      <Input
                        id="rnmPai"
                        value={formData.rnmPai}
                        onChange={(e) => handleChange("rnmPai", e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        {!formData.rnmPaiFile ? (
                          <>
                            <input
                              type="file"
                              id="rnmPaiDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "rnmPai")}
                              disabled={uploadingDocs.rnmPai}
                            />
                            <Label
                              htmlFor="rnmPaiDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.rnmPai ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.rnmPaiFile && (
                        <DocumentPreview
                          fileUrl={formData.rnmPaiFile}
                          onRemove={() => removeDocument("rnmPai")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("rnmPai") && (
                    <div className="space-y-2">
                      <Label htmlFor="nomePaiRegistral">Nome do Pai Registral</Label>
                      <Input
                        id="nomePaiRegistral"
                        value={formData.nomePaiRegistral}
                        onChange={(e) => handleChange("nomePaiRegistral", e.target.value)}
                        placeholder="Nome completo"
                      />
                    </div>
                  )}

                  {showFieldForType("cpfMae") && (
                    <div className="space-y-2">
                      <Label htmlFor="cpfMae">CPF Mãe</Label>
                      <Input
                        id="cpfMae"
                        value={formData.cpfMae}
                        onChange={(e) => handleChange("cpfMae", e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        {!formData.cpfMaeFile ? (
                          <>
                            <input
                              type="file"
                              id="cpfMaeDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "cpfMae")}
                              disabled={uploadingDocs.cpfMae}
                            />
                            <Label
                              htmlFor="cpfMaeDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.cpfMae ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.cpfMaeFile && (
                        <DocumentPreview
                          fileUrl={formData.cpfMaeFile}
                          onRemove={() => removeDocument("cpfMae")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("cpfPai") && (
                    <div className="space-y-2">
                      <Label htmlFor="cpfPai">CPF Pai</Label>
                      <Input
                        id="cpfPai"
                        value={formData.cpfPai}
                        onChange={(e) => handleChange("cpfPai", e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        {!formData.cpfPaiFile ? (
                          <>
                            <input
                              type="file"
                              id="cpfPaiDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "cpfPai")}
                              disabled={uploadingDocs.cpfPai}
                            />
                            <Label
                              htmlFor="cpfPaiDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.cpfPai ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.cpfPaiFile && (
                        <DocumentPreview
                          fileUrl={formData.cpfPaiFile}
                          onRemove={() => removeDocument("cpfPai")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("cpfSupostoPai") && (
                    <div className="space-y-2">
                      <Label htmlFor="cpfSupostoPai">CPF do Suposto Pai</Label>
                      <Input
                        id="cpfSupostoPai"
                        value={formData.cpfSupostoPai}
                        onChange={(e) => handleChange("cpfSupostoPai", e.target.value)}
                      />
                    </div>
                  )}

                  {showFieldForType("rnmSupostoPai") && (
                    <div className="space-y-2">
                      <Label htmlFor="rnmSupostoPai">RNM Suposto Pai</Label>
                      <Input
                        id="rnmSupostoPai"
                        value={formData.rnmSupostoPai}
                        onChange={(e) => handleChange("rnmSupostoPai", e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        {!formData.rnmSupostoPaiFile ? (
                          <>
                            <input
                              type="file"
                              id="rnmSupostoPaiDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "rnmSupostoPai")}
                              disabled={uploadingDocs.rnmSupostoPai}
                            />
                            <Label
                              htmlFor="rnmSupostoPaiDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.rnmSupostoPai ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.rnmSupostoPaiFile && (
                        <DocumentPreview
                          fileUrl={formData.rnmSupostoPaiFile}
                          onRemove={() => removeDocument("rnmSupostoPai")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("rnmSupostoPai") && (
                    <div className="space-y-2">
                      <Label htmlFor="nomeSupostoPai">Nome do Suposto Pai</Label>
                      <Input
                        id="nomeSupostoPai"
                        value={formData.nomeSupostoPai}
                        onChange={(e) => handleChange("nomeSupostoPai", e.target.value)}
                        placeholder="Nome completo"
                      />
                    </div>
                  )}

                  {showFieldForType("nomeCrianca") && (
                    <div className="space-y-2">
                      <Label htmlFor="nomeCrianca">Nome da Criança</Label>
                      <Input
                        id="nomeCrianca"
                        value={formData.nomeCrianca}
                        onChange={(e) => handleChange("nomeCrianca", e.target.value)}
                        placeholder="Nome completo"
                      />
                    </div>
                  )}

                  {showFieldForType("certidaoNascimento") && (
                    <div className="space-y-2">
                      <Label htmlFor="certidaoNascimento">
                        {formData.type === "Divórcio Consensual" || formData.type === "Divórcio Litígio"
                          ? "Certidão de Nascimento da Criança (caso filhos)" 
                          : "Certidão de Nascimento da Criança"}
                      </Label>
                      <Input
                        id="certidaoNascimento"
                        value={formData.certidaoNascimento}
                        onChange={(e) => handleChange("certidaoNascimento", e.target.value)}
                        placeholder="Número ou referência"
                      />
                      <div className="flex items-center gap-2">
                        {!formData.certidaoNascimentoFile ? (
                          <>
                            <input
                              type="file"
                              id="certidaoNascimentoDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "certidaoNascimento")}
                              disabled={uploadingDocs.certidaoNascimento}
                            />
                            <Label
                              htmlFor="certidaoNascimentoDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.certidaoNascimento ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.certidaoNascimentoFile && (
                        <DocumentPreview
                          fileUrl={formData.certidaoNascimentoFile}
                          onRemove={() => removeDocument("certidaoNascimento")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("comprovanteEndereco") && (
                    <div className="space-y-2">
                      <Label htmlFor="comprovanteEndereco">Comprovante de Endereço</Label>
                      <Input
                        id="comprovanteEndereco"
                        value={formData.comprovanteEndereco}
                        onChange={(e) => handleChange("comprovanteEndereco", e.target.value)}
                        placeholder="Tipo de comprovante"
                      />
                      <div className="flex items-center gap-2">
                        {!formData.comprovanteEnderecoFile ? (
                          <>
                            <input
                              type="file"
                              id="comprovanteEnderecoDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "comprovanteEndereco")}
                              disabled={uploadingDocs.comprovanteEndereco}
                            />
                            <Label
                              htmlFor="comprovanteEnderecoDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.comprovanteEndereco ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.comprovanteEnderecoFile && (
                        <DocumentPreview
                          fileUrl={formData.comprovanteEnderecoFile}
                          onRemove={() => removeDocument("comprovanteEndereco")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("peticaoConjunta") && (
                    <div className="space-y-2">
                      <Label htmlFor="peticaoConjunta">Petição Conjunta</Label>
                      <Input
                        id="peticaoConjunta"
                        value={formData.peticaoConjunta}
                        onChange={(e) => handleChange("peticaoConjunta", e.target.value)}
                        placeholder="Número ou referência"
                      />
                      <div className="flex items-center gap-2">
                        {!formData.peticaoConjuntaFile ? (
                          <>
                            <input
                              type="file"
                              id="peticaoConjuntaDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "peticaoConjunta")}
                              disabled={uploadingDocs.peticaoConjunta}
                            />
                            <Label
                              htmlFor="peticaoConjuntaDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.peticaoConjunta ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.peticaoConjuntaFile && (
                        <DocumentPreview
                          fileUrl={formData.peticaoConjuntaFile}
                          onRemove={() => removeDocument("peticaoConjunta")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("termoPartilhas") && (
                    <div className="space-y-2">
                      <Label htmlFor="termoPartilhas">Termo de Partilhas (Caso possuir bens)</Label>
                      <Input
                        id="termoPartilhas"
                        value={formData.termoPartilhas}
                        onChange={(e) => handleChange("termoPartilhas", e.target.value)}
                        placeholder="Número ou referência"
                      />
                      <div className="flex items-center gap-2">
                        {!formData.termoPartilhasFile ? (
                          <>
                            <input
                              type="file"
                              id="termoPartilhasDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "termoPartilhas")}
                              disabled={uploadingDocs.termoPartilhas}
                            />
                            <Label
                              htmlFor="termoPartilhasDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.termoPartilhas ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.termoPartilhasFile && (
                        <DocumentPreview
                          fileUrl={formData.termoPartilhasFile}
                          onRemove={() => removeDocument("termoPartilhas")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("guarda") && (
                    <div className="space-y-2">
                      <Label htmlFor="guarda">Guarda (caso tiver filhos)</Label>
                      <Input
                        id="guarda"
                        value={formData.guarda}
                        onChange={(e) => handleChange("guarda", e.target.value)}
                        placeholder="Número ou referência"
                      />
                      <div className="flex items-center gap-2">
                        {!formData.guardaFile ? (
                          <>
                            <input
                              type="file"
                              id="guardaDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "guarda")}
                              disabled={uploadingDocs.guarda}
                            />
                            <Label
                              htmlFor="guardaDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.guarda ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.guardaFile && (
                        <DocumentPreview
                          fileUrl={formData.guardaFile}
                          onRemove={() => removeDocument("guarda")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("procuracao") && (
                    <div className="space-y-2">
                      <Label htmlFor="procuracao">Procuração</Label>
                      <Input
                        id="procuracao"
                        value={formData.procuracao}
                        onChange={(e) => handleChange("procuracao", e.target.value)}
                        placeholder="Número ou referência"
                      />
                      <div className="flex items-center gap-2">
                        {!formData.procuracaoFile ? (
                          <>
                            <input
                              type="file"
                              id="procuracaoDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "procuracao")}
                              disabled={uploadingDocs.procuracao}
                            />
                            <Label
                              htmlFor="procuracaoDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.procuracao ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.procuracaoFile && (
                        <DocumentPreview
                          fileUrl={formData.procuracaoFile}
                          onRemove={() => removeDocument("procuracao")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("passaporteMae") && (
                    <div className="space-y-2">
                      <Label htmlFor="passaporteMaeDoc">Passaporte da Mãe</Label>
                      <div className="flex items-center gap-2">
                        {!formData.passaporteMaeFile ? (
                          <>
                            <input
                              type="file"
                              id="passaporteMaeDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "passaporteMae")}
                              disabled={uploadingDocs.passaporteMae}
                            />
                            <Label
                              htmlFor="passaporteMaeDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.passaporteMae ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.passaporteMaeFile && (
                        <DocumentPreview
                          fileUrl={formData.passaporteMaeFile}
                          onRemove={() => removeDocument("passaporteMae")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("passaportePaiRegistral") && (
                    <div className="space-y-2">
                      <Label htmlFor="passaportePaiRegistralDoc">Passaporte do Pai Registral</Label>
                      <div className="flex items-center gap-2">
                        {!formData.passaportePaiRegistralFile ? (
                          <>
                            <input
                              type="file"
                              id="passaportePaiRegistralDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "passaportePaiRegistral")}
                              disabled={uploadingDocs.passaportePaiRegistral}
                            />
                            <Label
                              htmlFor="passaportePaiRegistralDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.passaportePaiRegistral ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.passaportePaiRegistralFile && (
                        <DocumentPreview
                          fileUrl={formData.passaportePaiRegistralFile}
                          onRemove={() => removeDocument("passaportePaiRegistral")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("passaporteSupostoPai") && (
                    <div className="space-y-2">
                      <Label htmlFor="passaporteSupostoPaiDoc">Passaporte do Suposto Pai</Label>
                      <div className="flex items-center gap-2">
                        {!formData.passaporteSupostoPaiFile ? (
                          <>
                            <input
                              type="file"
                              id="passaporteSupostoPaiDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "passaporteSupostoPai")}
                              disabled={uploadingDocs.passaporteSupostoPai}
                            />
                            <Label
                              htmlFor="passaporteSupostoPaiDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.passaporteSupostoPai ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.passaporteSupostoPaiFile && (
                        <DocumentPreview
                          fileUrl={formData.passaporteSupostoPaiFile}
                          onRemove={() => removeDocument("passaporteSupostoPai")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("guiaPaga") && (
                    <div className="space-y-2">
                      <Label htmlFor="guiaPaga">Guia Paga</Label>
                      <Input
                        id="guiaPaga"
                        value={formData.guiaPaga}
                        onChange={(e) => handleChange("guiaPaga", e.target.value)}
                        placeholder="Número ou referência"
                      />
                      <div className="flex items-center gap-2">
                        {!formData.guiaPagaFile ? (
                          <>
                            <input
                              type="file"
                              id="guiaPagaDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "guiaPaga")}
                              disabled={uploadingDocs.guiaPaga}
                            />
                            <Label
                              htmlFor="guiaPagaDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.guiaPaga ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.guiaPagaFile && (
                        <DocumentPreview
                          fileUrl={formData.guiaPagaFile}
                          onRemove={() => removeDocument("guiaPaga")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("peticaoCliente") && (
                    <div className="space-y-2">
                      <Label htmlFor="peticaoCliente">Petição Cliente</Label>
                      <Input
                        id="peticaoCliente"
                        value={formData.peticaoCliente}
                        onChange={(e) => handleChange("peticaoCliente", e.target.value)}
                        placeholder="Número ou referência"
                      />
                      <div className="flex items-center gap-2">
                        {!formData.peticaoClienteFile ? (
                          <>
                            <input
                              type="file"
                              id="peticaoClienteDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "peticaoCliente")}
                              disabled={uploadingDocs.peticaoCliente}
                            />
                            <Label
                              htmlFor="peticaoClienteDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.peticaoCliente ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.peticaoClienteFile && (
                        <DocumentPreview
                          fileUrl={formData.peticaoClienteFile}
                          onRemove={() => removeDocument("peticaoCliente")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("procuracaoCliente") && (
                    <div className="space-y-2">
                      <Label htmlFor="procuracaoCliente">Procuração Cliente</Label>
                      <Input
                        id="procuracaoCliente"
                        value={formData.procuracaoCliente}
                        onChange={(e) => handleChange("procuracaoCliente", e.target.value)}
                        placeholder="Número ou referência"
                      />
                      <div className="flex items-center gap-2">
                        {!formData.procuracaoClienteFile ? (
                          <>
                            <input
                              type="file"
                              id="procuracaoClienteDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "procuracaoCliente")}
                              disabled={uploadingDocs.procuracaoCliente}
                            />
                            <Label
                              htmlFor="procuracaoClienteDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.procuracaoCliente ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.procuracaoClienteFile && (
                        <DocumentPreview
                          fileUrl={formData.procuracaoClienteFile}
                          onRemove={() => removeDocument("procuracaoCliente")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("custas") && (
                    <div className="space-y-2">
                      <Label htmlFor="custas">Custas</Label>
                      <Input
                        id="custas"
                        value={formData.custas}
                        onChange={(e) => handleChange("custas", e.target.value)}
                        placeholder="Número ou referência"
                      />
                      <div className="flex items-center gap-2">
                        {!formData.custasFile ? (
                          <>
                            <input
                              type="file"
                              id="custasDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "custas")}
                              disabled={uploadingDocs.custas}
                            />
                            <Label
                              htmlFor="custasDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.custas ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.custasFile && (
                        <DocumentPreview
                          fileUrl={formData.custasFile}
                          onRemove={() => removeDocument("custas")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("peticaoInicial") && (
                    <div className="space-y-2">
                      <Label htmlFor="peticaoInicial">Petição Inicial</Label>
                      <Input
                        id="peticaoInicial"
                        value={formData.peticaoInicial}
                        onChange={(e) => handleChange("peticaoInicial", e.target.value)}
                        placeholder="Número ou referência"
                      />
                      <div className="flex items-center gap-2">
                        {!formData.peticaoInicialFile ? (
                          <>
                            <input
                              type="file"
                              id="peticaoInicialDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "peticaoInicial")}
                              disabled={uploadingDocs.peticaoInicial}
                            />
                            <Label
                              htmlFor="peticaoInicialDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.peticaoInicial ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.peticaoInicialFile && (
                        <DocumentPreview
                          fileUrl={formData.peticaoInicialFile}
                          onRemove={() => removeDocument("peticaoInicial")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("matriculaImovel") && (
                    <div className="space-y-2">
                      <Label htmlFor="matriculaImovel">Matrícula do Imóvel / Transcrição</Label>
                      <Input
                        id="matriculaImovel"
                        value={formData.matriculaImovel}
                        onChange={(e) => handleChange("matriculaImovel", e.target.value)}
                        placeholder="Número da matrícula"
                      />
                      <div className="flex items-center gap-2">
                        {!formData.matriculaImovelFile ? (
                          <>
                            <input
                              type="file"
                              id="matriculaImovelDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "matriculaImovel")}
                              disabled={uploadingDocs.matriculaImovel}
                            />
                            <Label
                              htmlFor="matriculaImovelDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.matriculaImovel ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.matriculaImovelFile && (
                        <DocumentPreview
                          fileUrl={formData.matriculaImovelFile}
                          onRemove={() => removeDocument("matriculaImovel")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("aguaLuzIptu") && (
                    <div className="space-y-2">
                      <Label htmlFor="aguaLuzIptu">Água / Luz / IPTU</Label>
                      <Input
                        id="aguaLuzIptu"
                        value={formData.aguaLuzIptu}
                        onChange={(e) => handleChange("aguaLuzIptu", e.target.value)}
                        placeholder="Informações das contas"
                      />
                      <div className="flex items-center gap-2">
                        {!formData.aguaLuzIptuFile ? (
                          <>
                            <input
                              type="file"
                              id="aguaLuzIptuDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "aguaLuzIptu")}
                              disabled={uploadingDocs.aguaLuzIptu}
                            />
                            <Label
                              htmlFor="aguaLuzIptuDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.aguaLuzIptu ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.aguaLuzIptuFile && (
                        <DocumentPreview
                          fileUrl={formData.aguaLuzIptuFile}
                          onRemove={() => removeDocument("aguaLuzIptu")}
                        />
                      )}
                    </div>
                  )}

                  {showFieldForType("camposExigencias") && (
                    <div className="space-y-2">
                      <Label htmlFor="camposExigencias">Campos para Cumprir Exigências</Label>
                      <Textarea
                        id="camposExigencias"
                        value={formData.camposExigencias}
                        onChange={(e) => handleChange("camposExigencias", e.target.value)}
                        placeholder="Descreva as exigências a serem cumpridas"
                        rows={3}
                      />
                      <div className="flex items-center gap-2">
                        {!formData.camposExigenciasFile ? (
                          <>
                            <input
                              type="file"
                              id="camposExigenciasDoc"
                              className="hidden"
                              onChange={(e) => handleDocumentUpload(e, "camposExigencias")}
                              disabled={uploadingDocs.camposExigencias}
                            />
                            <Label
                              htmlFor="camposExigenciasDoc"
                              className="inline-flex items-center justify-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium border bg-white shadow-sm hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadingDocs.camposExigencias ? "Enviando..." : "Upload Documento"}
                            </Label>
                          </>
                        ) : null}
                      </div>
                      {formData.camposExigenciasFile && (
                        <DocumentPreview
                          fileUrl={formData.camposExigenciasFile}
                          onRemove={() => removeDocument("camposExigencias")}
                        />
                      )}
                    </div>
                  )}
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={4}
                placeholder="Adicione observações sobre o caso..."
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Criar Ação
              </Button>
              <Link href="/dashboard/acoes-civeis" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar criação da ação</AlertDialogTitle>
              <AlertDialogDescription>
                Criar ação para <span className="font-semibold">{formData.clientName}</span> do tipo <span className="font-semibold">{formData.type || '—'}</span>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setConfirmOpen(false)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => { setConfirmOpen(false); doCreate(); }}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </div>
  );
}
