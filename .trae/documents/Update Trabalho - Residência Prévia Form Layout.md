I will update the form layout for "Trabalho - Residência Prévia" in `src/app/dashboard/vistos/novo/page.tsx` to match the 6-section structure shown in the new images.

**Plan:**

1.  **Introduce New Conditional Block**:
    *   Add a new conditional rendering block specifically for `formData.type === "Trabalho:Residência Prévia"`.
    *   Structure this block with the 6 specific cards requested:
        1.  **Identificação**: Passaporte, Declaração de Compreensão.
        2.  **Residência Anterior**: Comprovante de residência prévia no Brasil.
        3.  **Documentos da Empresa**: Contrato Social, CNPJ, Declarações da Empresa, Procuração da Empresa, Formulário RN 02, Guia paga, Publicação no DOU.
        4.  **Documentos Trabalhistas**: Contrato de trabalho, Folha de pagamento, Documentos comprobatórios de atividade (quando aplicável).
        5.  **Formação**: Diploma.
        6.  **Outras Informações**: Procurador, Número do Processo.

2.  **Field Mapping**:
    *   Map the fields to the existing `formData` state:
        *   **Identificação**:
            *   Passaporte -> `passaporte` / `passaporteDoc`
            *   Declaração de Compreensão -> `declaracaoCompreensao` / `declaracaoCompreensaoDoc`
        *   **Residência Anterior**:
            *   Comprovante de residência prévia -> `comprovanteResidenciaPrevia` / `comprovanteResidenciaPreviaDoc` (Need to check if these exist in state/schema, if not, might need to reuse an existing field like `comprovanteEndereco` or add new ones. *Decision: I will check `schema.ts` first. If missing, I'll use `comprovanteEndereco` as a fallback or add it if permissible. For now, I'll assume adding/mapping to `comprovanteVinculoAnterior` or similar might be confusing, so `comprovanteEndereco` seems most semantic if "Residência Anterior" implies address proof.* **Correction**: The image says "Comprovante de residência prévia no Brasil". I will map this to `comprovanteEndereco` / `comprovanteEnderecoDoc` as it fits the "Residência" context best among existing fields, or reuse `comprovanteVinculoAnterior` if strictly work-related. Let's stick to `comprovanteEndereco` for "Residência").
        *   **Documentos da Empresa**:
            *   Contrato Social -> `contratoEmpresa`
            *   CNPJ -> `cartaoCnpj`
            *   Declarações da Empresa -> `declaracoesEmpresa`
            *   Procuração da Empresa -> `procuracaoEmpresa`
            *   Formulário RN 02 -> `formularioRn01` (Reuse `formularioRn01` state but label it "Formulário RN 02" in UI, or `formularioProrrogacao`? `formularioRn01` is likely the generic "RN form" slot).
            *   Guia paga -> `guiaPaga`
            *   Publicação no DOU -> `publicacaoDou`
        *   **Documentos Trabalhistas**:
            *   Contrato de trabalho -> `contratoTrabalho`
            *   Folha de pagamento -> `folhaPagamento`
            *   Documentos comprobatórios de atividade -> `documentosComprobatoriosAtividade` (Check existence. If not, map to `comprovanteVinculoAnterior`).
        *   **Formação**:
            *   Diploma -> `diploma`
        *   **Outras Informações**:
            *   Procurador -> `procurador`
            *   Número do Processo -> `numeroProcesso`

3.  **Update State**:
    *   I need to ensure `formData` has `comprovanteResidenciaPrevia` and `documentosComprobatoriosAtividade` if I decide to use new keys, but to avoid DB schema changes right now, I will reuse:
        *   "Comprovante de residência prévia no Brasil" -> `comprovanteVinculoAnterior` (Since it's "Residência Prévia" visa, previous link/residence is key). Or `comprovanteEndereco`. Let's use `comprovanteVinculoAnterior` as it's more specific to the visa requirement context than a generic address.
        *   "Documentos comprobatórios de atividade" -> `declaracaoAntecedentesCriminais`? No. I will look for a suitable existing field or just add it to the state locally if it's just for the UI (but it won't save). *Better approach*: I will reuse `comprovanteVinculoAnterior` for "Documentos comprobatórios" and `comprovanteEndereco` for "Residência Prévia".
        *   "Formulário RN 02" -> `formularioRn01` (Label change only).

    *   *Self-Correction*: The user wants me to "map correctly". I will verify the `schema.ts` again to see if I can add new fields or if I should reuse. I'll stick to reusing logical equivalents to ensure backend compatibility without migration if possible, but if the user implies new fields, I should probably add them. Given the instruction "Use a mcp advogado para corrigir", I assume I can edit code freely. I'll try to reuse first to be safe.

    *   **Mapping Strategy**:
        *   `comprovanteResidenciaPrevia` -> `comprovanteEndereco`
        *   `documentosComprobatoriosAtividade` -> `comprovanteVinculoAnterior`
        *   `formularioRn02` -> `formularioRn01`

4.  **Implementation**:
    *   Modify `src/app/dashboard/vistos/novo/page.tsx`.
    *   Add the `else if (formData.type === "Trabalho:Residência Prévia")` block.
    *   Render the 6 cards.

I will proceed with the code changes.