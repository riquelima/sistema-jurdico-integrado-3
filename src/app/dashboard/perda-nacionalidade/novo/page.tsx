"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NovaPerdaNacionalidadePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    rnmMae: "",
    rnmPai: "",
    cpfMae: "",
    cpfPai: "",
  });

  const [files, setFiles] = useState({
    certidaoNascimento: null as File | null,
    comprovanteEndereco: null as File | null,
    passaportes: null as File | null,
    documentoChines: null as File | null,
    traducaoJuramentada: null as File | null,
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
      // Upload files first
      const uploadedDocuments: string[] = [];

      for (const [key, file] of Object.entries(files)) {
        if (file) {
          const fileFormData = new FormData();
          fileFormData.append("file", file);

          const uploadResponse = await fetch("/api/documents/upload", {
            method: "POST",
            body: fileFormData,
          });

          if (uploadResponse.ok) {
            const { url } = await uploadResponse.json();
            uploadedDocuments.push(url);
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
          documents: uploadedDocuments,
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
                  <Label htmlFor="rnmMae">RNM Mãe</Label>
                  <Input
                    id="rnmMae"
                    name="rnmMae"
                    value={formData.rnmMae}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpfMae">CPF Mãe</Label>
                  <Input
                    id="cpfMae"
                    name="cpfMae"
                    value={formData.cpfMae}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rnmPai">RNM Pai</Label>
                  <Input
                    id="rnmPai"
                    name="rnmPai"
                    value={formData.rnmPai}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpfPai">CPF Pai</Label>
                  <Input
                    id="cpfPai"
                    name="cpfPai"
                    value={formData.cpfPai}
                    onChange={handleInputChange}
                  />
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
                  <Label htmlFor="certidaoNascimento">Certidão de Nascimento da Criança</Label>
                  <div className="flex gap-2">
                    <Input
                      id="certidaoNascimento"
                      type="file"
                      onChange={(e) =>
                        handleFileChange("certidaoNascimento", e.target.files?.[0] || null)
                      }
                      className="flex-1"
                    />
                    {files.certidaoNascimento && (
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comprovanteEndereco">Comprovante de Endereço</Label>
                  <div className="flex gap-2">
                    <Input
                      id="comprovanteEndereco"
                      type="file"
                      onChange={(e) =>
                        handleFileChange("comprovanteEndereco", e.target.files?.[0] || null)
                      }
                      className="flex-1"
                    />
                    {files.comprovanteEndereco && (
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passaportes">Passaportes</Label>
                  <div className="flex gap-2">
                    <Input
                      id="passaportes"
                      type="file"
                      onChange={(e) =>
                        handleFileChange("passaportes", e.target.files?.[0] || null)
                      }
                      className="flex-1"
                    />
                    {files.passaportes && (
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentoChines">Documento Chinês</Label>
                  <div className="flex gap-2">
                    <Input
                      id="documentoChines"
                      type="file"
                      onChange={(e) =>
                        handleFileChange("documentoChines", e.target.files?.[0] || null)
                      }
                      className="flex-1"
                    />
                    {files.documentoChines && (
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="traducaoJuramentada">Tradução Juramentada</Label>
                  <div className="flex gap-2">
                    <Input
                      id="traducaoJuramentada"
                      type="file"
                      onChange={(e) =>
                        handleFileChange("traducaoJuramentada", e.target.files?.[0] || null)
                      }
                      className="flex-1"
                    />
                    {files.traducaoJuramentada && (
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
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