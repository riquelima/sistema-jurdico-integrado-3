I will update the form layout for "Trabalho - Brasil" in `src/app/dashboard/vistos/novo/page.tsx` to match the specific 6-section structure shown in the images.

**Plan:**

1.  **Refactor Form Structure**:
    *   Introduce a conditional rendering block specifically for `formData.type === "Trabalho:Brasil"`.
    *   Inside this block, render the 6 numbered cards as requested:
        1.  **Identificação**: Passaporte, Certidão de Nascimento, Declaração de Compreensão.
        2.  **Documentos da Empresa**: Contrato Social, CNPJ, Declarações da Empresa, Procuração da empresa, Formulário RN 01, Guia paga, Publicação no DOU.
        3.  **Documentos Trabalhistas**: Contrato de trabalho, Folha de pagamento, Comprovante de vínculo anterior.
        4.  **Histórico e Segurança**: Antecedentes Criminais, Declaração de Antecedentes Criminais.
        5.  **Formação Acadêmica**: Diploma.
        6.  **Outras Informações**: Procurador, Número do Processo.

2.  **Preserve Other Types**:
    *   Keep the existing "1. Documentos Pessoais", "2. Documentos Específicos", "3. Outros Documentos" layout for all *other* visa types (`type !== "Trabalho:Brasil"`).

3.  **Field Mapping**:
    *   Ensure all fields in the new layout map to the correct `formData` properties:
        *   Passaporte -> `passaporte` / `passaporteDoc`
        *   Certidão de Nascimento -> `certidaoNascimento` / `certidaoNascimentoDoc`
        *   Declaração de Compreensão -> `declaracaoCompreensao` / `declaracaoCompreensaoDoc`
        *   Contrato Social -> `contratoEmpresa` / `contratoEmpresaDoc`
        *   CNPJ -> `cartaoCnpj` / `cartaoCnpjDoc`
        *   Declarações da Empresa -> `declaracoesEmpresa` / `declaracoesEmpresaDoc`
        *   Procuração da empresa -> `procuracaoEmpresa` / `procuracaoEmpresaDoc`
        *   Formulário RN 01 -> `formularioRn01` / `formularioRn01Doc`
        *   Guia paga -> `guiaPaga` / `guiaPagaDoc`
        *   Publicação no DOU -> `publicacaoDou` / `publicacaoDouDoc`
        *   Contrato de trabalho -> `contratoTrabalho` / `contratoTrabalhoDoc`
        *   Folha de pagamento -> `folhaPagamento` / `folhaPagamentoDoc`
        *   Comprovante de vínculo anterior -> `comprovanteVinculoAnterior` / `comprovanteVinculoAnteriorDoc`
        *   Antecedentes Criminais -> `antecedentesCriminais` / `antecedentesCriminaisDoc`
        *   Declaração de Antecedentes Criminais -> `declaracaoAntecedentesCriminais` / `declaracaoAntecedentesCriminaisDoc`
        *   Diploma -> `diploma` / `diplomaDoc`
        *   Procurador -> `procurador`
        *   Número do Processo -> `numeroProcesso`

I will proceed with applying these changes.