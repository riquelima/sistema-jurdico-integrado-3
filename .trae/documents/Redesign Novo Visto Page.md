I will redesign the "Novo Visto" page (`src/app/dashboard/vistos/novo/page.tsx`) to match the provided interface.

**Plan:**

1.  **Update UI Structure**:
    *   Replace the current form layout with the new design (Header, 3 Cards for Info, Personal Docs, Financial Docs, Other Docs).
    *   Use Tailwind CSS classes to match the requested colors and spacing.
    *   Replace `material-icons` with existing `lucide-react` icons (e.g., `Info`, `Upload`, `Calendar`, `Save`).

2.  **Field Mapping**:
    *   **Informações do Visto**:
        *   "Nome do Cliente" -> `clientName`
        *   "País do Visto" -> `country` (using `Select`)
        *   "Tipo de Visto" -> `type` (using `Select`)
        *   "Período da Viagem" -> Date Range Picker (using existing logic)
    *   **Documentos Pessoais** (Input + Upload):
        *   "CPF" -> `cpf` + `cpfDoc`
        *   "RNM" -> `rnm` + `rnmDoc`
        *   "Passaporte" -> `passaporte` + `passaporteDoc`
        *   "Comprovante de Endereço" -> `comprovanteEndereco` + `comprovanteEnderecoDoc`
        *   "Declaração de Residência" -> `declaracaoResidenciaDoc` (Input for file name/status)
        *   "Foto digital 3x4" -> `foto3x4Doc`
        *   "Documento Chinês" -> `documentoChines` + `documentoChinesDoc`
        *   "Antecedentes Criminais" -> `antecedentesCriminais` + `antecedentesCriminaisDoc`
    *   **Comprovação Financeira PF**:
        *   "Filhos" -> `certidaoNascimentoFilhos` + `_Doc`
        *   "Empresa: Cartão CNPJ" -> `cartaoCnpj` + `_Doc`
        *   "Contrato Social" -> `contratoEmpresa` + `_Doc`
        *   "Imóveis" -> `escrituraImoveis` + `_Doc`
        *   "Extratos bancários" -> `extratosBancarios` + `_Doc`
        *   "Imposto de Renda" -> `impostoRenda` + `_Doc`
    *   **Outros Documentos**:
        *   Reservas (Passagens, Hotel), Seguro, Roteiro, Taxa, Formulário.

3.  **Functionality**:
    *   Preserve `handleSubmit` and `handleDocumentUpload` logic.
    *   Ensure file uploads work with the new buttons.
    *   Ensure the form submits correctly to the backend.

I will proceed with these changes.