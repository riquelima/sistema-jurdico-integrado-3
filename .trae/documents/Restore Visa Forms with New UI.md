I will restore the different visa forms and the corresponding `Select` options in `src/app/dashboard/vistos/novo/page.tsx`, while maintaining the new UI design.

**Plan:**

1.  **Update `Select` Options**:
    *   Revert the `Select` component for "Tipo de Visto" to include all the options shown in the user's image:
        *   **Visto de Turismo**: `Turismo`
        *   **Visto de Trabalho**: `Trabalho:Brasil`, `Trabalho:Residência Prévia`, `Trabalho:Renovação 1 ano`, `Trabalho:Indeterminado`, `Trabalho:Mudança de Empregador`
        *   **Visto de Investidor**: `Investidor`
    *   Use `SelectGroup` and `SelectLabel` to organize them as requested.

2.  **Conditional Rendering Logic**:
    *   Create a mapping or switch logic to render specific form fields based on the selected `type`.
    *   **Common Fields**: `clientName`, `country`, `type`, `cpf`, `rnm`, `passaporte`, `comprovanteEndereco`, `foto3x4Doc`, `documentoChines`, `antecedentesCriminais`.
    *   **Turismo**: `travelStartDate`, `travelEndDate`, `certidaoNascimentoFilhos`, `cartaoCnpj`, `contratoEmpresa`, `escrituraImoveis`, `extratosBancarios`, `impostoRenda`, `reservasPassagens`, `reservasHotel`, `seguroViagem`, `roteiroViagem`, `taxa`, `formularioConsulado`.
    *   **Trabalho - Brasil**: `certidaoNascimento`, `declaracaoCompreensao`, `certidaoNascimentoFilhos`, `cartaoCnpj`, `contratoEmpresa`, `declaracoesEmpresa`, `procuracaoEmpresa`, `formularioRn01`, `guiaPaga`, `publicacaoDou`.
    *   **Trabalho - Residência Prévia**: `contratoTrabalho`, `folhaPagamento`, `comprovanteVinculoAnterior`, `declaracaoAntecedentesCriminais`, `diploma`.
    *   **Trabalho - Renovação 1 ano**: `ctps`, `contratoTrabalhoAnterior`, `contratoTrabalhoAtual`, `formularioProrrogacao`.
    *   **Trabalho - Indeterminado**: `contratoTrabalhoIndeterminado`.
    *   **Trabalho - Mudança de Empregador**: `justificativaMudancaEmpregador`.
    *   **Investidor**: `comprovanteInvestimento`, `planoInvestimentos`, `formularioRequerimento`.

3.  **Implement Specific Form Sections**:
    *   Use the `DocumentRow` component to render the fields for each type.
    *   Ensure the "Documentos Pessoais" section contains the common fields + specific ones if needed.
    *   Create dynamic sections for "Documentos Específicos" or modify "Comprovação Financeira" / "Outros Documentos" to adapt to the visa type.

4.  **Refine UI**:
    *   Ensure the layout remains consistent with the new design (Cards, Tailwind colors).
    *   Show/hide sections dynamically.

I will proceed with modifying `src/app/dashboard/vistos/novo/page.tsx`.