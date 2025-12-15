Vou ajustar o cabeçalho da página de detalhes de Ações Criminais para exibir corretamente o formato "Tipo da Ação - Ação Criminal", conforme solicitado e similar à página de Ações Trabalhistas.

### Plano de Ajuste:

1.  **Localizar Código:**
    *   No arquivo `src/app/dashboard/acoes-criminais/[id]/page.tsx`, linha 693.

2.  **Alterar Exibição:**
    *   Substituir `{caseData.type} - Ação Criminal` por algo que garanta que `caseData.type` (ex: "Ação Criminal") não fique redundante se for igual ao sufixo, ou simplesmente ajustar para o formato desejado.
    *   Se `caseData.type` já for "Ação Criminal" (o padrão), o texto atual fica "Ação Criminal - Ação Criminal".
    *   Vou alterar para: `Ação Criminal` (se for o tipo padrão) ou `${caseData.type} - Ação Criminal` se for um subtipo específico.
    *   Contudo, o pedido do usuário mostra que ele quer igual ao trabalista, onde aparece: `Tipo - Categoria`.
    *   No print do usuário para trabalhista aparece: `Ação Trabalhista - Ação Trabalhista`.
    *   O usuário disse: "Isso `p` deve ser igual a `h1` `p` deve conter o nome do cliente e abaixo o nome 'Ação Criminal', como há na tela de detalhes de açõs trabalhistas".
    *   Analisando o HTML fornecido: `<p class="text-muted-foreground"> - Ação Criminal</p>`. Isso indica que `caseData.type` está vindo vazio ou undefined.
    *   Vou garantir que `caseData.type` tenha um valor padrão ("Ação Criminal") ou ajustar a lógica para exibir apenas "Ação Criminal" se o tipo não estiver definido.

3.  **Correção:**
    *   Vou alterar a linha para: `<p className="text-muted-foreground">{caseData.type || 'Ação Criminal'} - Ação Criminal</p>` ou simplesmente `<p className="text-muted-foreground">Ação Criminal</p>` se o objetivo for simplificar.
    *   Mas seguindo estritamente o pedido: "Tipo da Ação - Ação Criminal".
    *   Vou verificar se o campo `type` está sendo preenchido corretamente no banco. Se não estiver, ele vem vazio.
    *   Vou forçar um valor padrão na interface: `{(caseData.type || "Ação Criminal")} - Ação Criminal`.

Isso corrigirá o visual onde aparece apenas " - Ação Criminal".