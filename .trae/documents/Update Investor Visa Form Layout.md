I will update the "Visto de Investidor" form in `src/app/dashboard/vistos/novo/page.tsx` to match the provided screenshots.

**Steps:**
1.  **Remove Legacy Block**: Remove the partial "Investidor" block from the default layout (lines 1171-1177).
2.  **Create Dedicated Layout**: Add a new conditional rendering block for `formData.type === "Investidor"` in the main form chain.
3.  **Implement Sections**:
    -   **Identificação**:
        -   Field: Passaporte.
    -   **Documentos da Empresa / Investimento**:
        -   Fields: Contrato Social, CNPJ, Comprovante do investimento (with placeholder "Extrato, contrato, transferência etc."), Plano de Investimentos, Formulário de Requerimento, Procuração (using `procuracaoEmpresa`), Guia paga, Protocolado (with placeholder "Recibo/Protocolo do pedido"), Publicação no DOU.
    -   **Outras Informações**:
        -   Fields: Procurador, Número do Processo.

This ensures the "Investidor" form has its own dedicated, correctly structured layout matching your request, instead of relying on the generic fallback layout.