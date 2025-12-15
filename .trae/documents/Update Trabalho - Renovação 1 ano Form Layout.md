I will update the form layout for "Trabalho - Renovação 1 ano" in `src/app/dashboard/vistos/novo/page.tsx` to match the specific 5-section structure shown in the images.

**Plan:**

1.  **Introduce New Conditional Block**:
    *   Add a new conditional rendering block specifically for `formData.type === "Trabalho:Renovação 1 ano"`.
    *   Structure this block with the 5 specific cards requested:
        1.  **Identificação**: RNM.
        2.  **Documentos da Empresa**: Contrato Social, Procuração da empresa, Publicação no DOU.
        3.  **Vínculo de Trabalho**: CTPS (páginas do contrato e anotações), Contrato de trabalho anterior, Contrato de trabalho atual, Formulário de prorrogação.
        4.  **Segurança**: Declaração de Antecedentes Criminais.
        5.  **Outras Informações**: Procurador, Número do Processo.

2.  **Field Mapping**:
    *   Map the fields to the existing `formData` state:
        *   **Identificação**:
            *   RNM -> `rnm` / `rnmDoc`
        *   **Documentos da Empresa**:
            *   Contrato Social -> `contratoEmpresa` / `contratoEmpresaDoc`
            *   Procuração da empresa -> `procuracaoEmpresa` / `procuracaoEmpresaDoc`
            *   Publicação no DOU -> `publicacaoDou` / `publicacaoDouDoc`
        *   **Vínculo de Trabalho**:
            *   CTPS -> `ctps` / `ctpsDoc`
            *   Contrato de trabalho anterior -> `contratoTrabalhoAnterior` / `contratoTrabalhoAnteriorDoc`
            *   Contrato de trabalho atual -> `contratoTrabalhoAtual` / `contratoTrabalhoAtualDoc`
            *   Formulário de prorrogação -> `formularioProrrogacao` / `formularioProrrogacaoDoc`
        *   **Segurança**:
            *   Declaração de Antecedentes Criminais -> `declaracaoAntecedentesCriminais` / `declaracaoAntecedentesCriminaisDoc`
        *   **Outras Informações**:
            *   Procurador -> `procurador`
            *   Número do Processo -> `numeroProcesso`

3.  **Implementation**:
    *   Modify `src/app/dashboard/vistos/novo/page.tsx`.
    *   Add the `else if (formData.type === "Trabalho:Renovação 1 ano")` block.
    *   Render the 5 cards with the mapped fields.

I will proceed with the code changes.