"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NovaPerdaNacionalidadePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    nomeMae: "",
    nomePai: "",
    nomeCrianca: "",
    rnmMae: "",
    rnmPai: "",
    cpfMae: "",
    cpfPai: "",
    passaporteMae: "",
    passaportePai: "",
    passaporteCrianca: "",
    rgCrianca: "",
    notes: "",
  });

  const [files, setFiles] = useState({
    rnmMaeDoc: null as File | null,
    rnmPaiDoc: null as File | null,
    cpfMaeDoc: null as File | null,
    cpfPaiDoc: null as File | null,
    passaporteMaeDoc: null as File | null,
    passaportePaiDoc: null as File | null,
    passaporteCriancaDoc: null as File | null,
    certidaoNascimentoDoc: null as File | null,
    rgCriancaDoc: null as File | null,
    comprovanteEnderecoDoc: null as File | null,
    documentoChinesDoc: null as File | null,
    traducaoJuramentadaDoc: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFiles({
      ...files,
      [field]: file,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedFileUrls: Record<string, string> = {};
      for (const [fieldKey, file] of Object.entries(files)) {
        if (file) {
          const fd = new FormData();
          fd.append("file", file as File);
          const uploadResponse = await fetch("/api/documents/upload", {
            method: "POST",
            body: fd,
          });
          if (uploadResponse.ok) {
            const { url } = await uploadResponse.json();
            uploadedFileUrls[fieldKey] = url;
          }
        }
      }

      // Create the case
      const response = await fetch("/api/perda-nacionalidade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ...uploadedFileUrls,
          currentStep: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar processo");
      }

      const data = await response.json();
      toast.success("Processo criado com sucesso!");
      
      // Redirect to the list page
      router.push("/dashboard/perda-nacionalidade");
      router.refresh();
    } catch (error) {
      console.error("Error creating case:", error);
      toast.error("Erro ao criar processo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/perda-nacionalidade">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Nova Ação - Perda de Nacionalidade</h1>
          <p className="text-muted-foreground">
            Preencha os dados para criar um novo processo
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome do Cliente *</Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeMae">Nome da Mãe</Label>
                  <Input
                    id="nomeMae"
                    name="nomeMae"
                    value={formData.nomeMae}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomePai">Nome do Pai</Label>
                  <Input
                    id="nomePai"
                    name="nomePai"
                    value={formData.nomePai}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nomeCrianca">Nome da Criança</Label>
                <Input
                  id="nomeCrianca"
                  name="nomeCrianca"
                  value={formData.nomeCrianca}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Documentos dos Pais */}
          <Card>
            <CardHeader>
              <CardTitle>Documentos dos Pais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rnmMae">RNM da Mãe</Label>
                  <Input
                    id="rnmMae"
                    name="rnmMae"
                    value={formData.rnmMae}
                    onChange={handleInputChange}
                    placeholder="Número do RNM"
                  />
                  <div className="flex gap-2">
                    <Input
                      id="rnmMaeDoc"
                      type="file"
                      onChange={(e) => handleFileChange("rnmMaeDoc", e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    {files.rnmMaeDoc && (
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpfMae">CPF da Mãe</Label>
                  <Input
                    id="cpfMae"
                    name="cpfMae"
                    value={formData.cpfMae}
                    onChange={handleInputChange}
                    placeholder="CPF"
                  />
                  <div className="flex gap-2">
                    <Input
                      id="cpfMaeDoc"
                      type="file"
                      onChange={(e) => handleFileChange("cpfMaeDoc", e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    {files.cpfMaeDoc && (
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rnmPai">RNM do Pai</Label>
                  <Input
                    id="rnmPai"
                    name="rnmPai"
                    value={formData.rnmPai}
                    onChange={handleInputChange}
                    placeholder="Número do RNM"
                  />
                  <div className="flex gap-2">
                    <Input
                      id="rnmPaiDoc"
                      type="file"
                      onChange={(e) => handleFileChange("rnmPaiDoc", e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    {files.rnmPaiDoc && (
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpfPai">CPF do Pai</Label>
                  <Input
                    id="cpfPai"
                    name="cpfPai"
                    value={formData.cpfPai}
                    onChange={handleInputChange}
                    placeholder="CPF"
                  />
                  <div className="flex gap-2">
                    <Input
                      id="cpfPaiDoc"
                      type="file"
                      onChange={(e) => handleFileChange("cpfPaiDoc", e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    {files.cpfPaiDoc && (
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Passaportes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passaporteMae">Passaporte da Mãe</Label>
                  <Input
                    id="passaporteMae"
                    name="passaporteMae"
                    value={formData.passaporteMae}
                    onChange={handleInputChange}
                    placeholder="Número do passaporte"
                  />
                  <div className="flex gap-2">
                    <Input
                      id="passaporteMaeDoc"
                      type="file"
                      onChange={(e) => handleFileChange("passaporteMaeDoc", e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    {files.passaporteMaeDoc && (
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passaportePai">Passaporte do Pai</Label>
                  <Input
                    id="passaportePai"
                    name="passaportePai"
                    value={formData.passaportePai}
                    onChange={handleInputChange}
                    placeholder="Número do passaporte"
                  />
                  <div className="flex gap-2">
                    <Input
                      id="passaportePaiDoc"
                      type="file"
                      onChange={(e) => handleFileChange("passaportePaiDoc", e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    {files.passaportePaiDoc && (
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passaporteCrianca">Passaporte da Criança</Label>
                <Input
                  id="passaporteCrianca"
                  name="passaporteCrianca"
                  value={formData.passaporteCrianca}
                  onChange={handleInputChange}
                  placeholder="Número do passaporte"
                />
                <div className="flex gap-2">
                  <Input
                    id="passaporteCriancaDoc"
                    type="file"
                    onChange={(e) => handleFileChange("passaporteCriancaDoc", e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  {files.passaporteCriancaDoc && (
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentos da Criança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rgCrianca">RG da Criança</Label>
                <Input
                  id="rgCrianca"
                  name="rgCrianca"
                  value={formData.rgCrianca}
                  onChange={handleInputChange}
                  placeholder="Número do RG"
                />
                <div className="flex gap-2">
                  <Input
                    id="rgCriancaDoc"
                    type="file"
                    onChange={(e) => handleFileChange("rgCriancaDoc", e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  {files.rgCriancaDoc && (
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload de Documentos */}
          <Card>
            <CardHeader>
              <CardTitle>Documentos Necessários</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="certidaoNascimentoDoc">Certidão de Nascimento da Criança</Label>
                  <div className="flex gap-2">
                    <Input
                      id="certidaoNascimentoDoc"
                      type="file"
                      onChange={(e) =>
                        handleFileChange("certidaoNascimentoDoc", e.target.files?.[0] || null)
                      }
                      className="flex-1"
                    />
                    {files.certidaoNascimentoDoc && (
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="comprovanteEnderecoDoc">Comprovante de Endereço</Label>
                  <div className="flex gap-2">
                    <Input
                      id="comprovanteEnderecoDoc"
                      type="file"
                      onChange={(e) =>
                        handleFileChange("comprovanteEnderecoDoc", e.target.files?.[0] || null)
                      }
                      className="flex-1"
                    />
                    {files.comprovanteEnderecoDoc && (
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="documentoChinesDoc">Documento Chinês</Label>
                  <div className="flex gap-2">
                    <Input
                      id="documentoChinesDoc"
                      type="file"
                      onChange={(e) =>
                        handleFileChange("documentoChinesDoc", e.target.files?.[0] || null)
                      }
                      className="flex-1"
                    />
                    {files.documentoChinesDoc && (
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="traducaoJuramentadaDoc">Tradução Juramentada</Label>
                  <div className="flex gap-2">
                    <Input
                      id="traducaoJuramentadaDoc"
                      type="file"
                      onChange={(e) =>
                        handleFileChange("traducaoJuramentadaDoc", e.target.files?.[0] || null)
                      }
                      className="flex-1"
                    />
                    {files.traducaoJuramentadaDoc && (
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                rows={4}
                placeholder="Adicione observações sobre o caso..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link href="/dashboard/perda-nacionalidade">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Processo"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
