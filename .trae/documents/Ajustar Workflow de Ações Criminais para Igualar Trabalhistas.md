Entendi. O fluxo de etapas para Ações Criminais deve ser **idêntico** ao de Ações Trabalhistas ("Cadastro de Documentos", "Resumo", "Acompanhamento", "Processo Finalizado"), conforme mostra o print do usuário. Eu havia configurado um fluxo específico ("Análise Inicial", "Defesa Prévia", etc.) assumindo que seria diferente, mas o usuário confirmou que é igual.

Vou atualizar a constante `WORKFLOWS` no arquivo `src/app/dashboard/acoes-criminais/[id]/page.tsx` para refletir exatamente as mesmas etapas da página trabalhista.

### Plano de Ajuste:

1.  **Atualizar `WORKFLOWS`:**
    *   Alterar de:
        ```javascript
        "Ação Criminal": [
          "Análise Inicial",
          "Defesa Prévia",
          "Audiência",
          "Sentença",
          "Recursos",
          "Trânsito em Julgado",
        ]
        ```
    *   Para:
        ```javascript
        "Ação Criminal": [
          "Cadastro de Documentos",
          "Resumo",
          "Acompanhamento",
          "Processo Finalizado",
        ]
        ```

Isso garantirá que a estrutura de etapas seja idêntica à solicitada. Como a lógica de renderização (`renderSectionContent`) já estava preparada para lidar com índices e uploads genéricos (e eu tinha mantido a estrutura de índices similar à trabalhista para as primeiras etapas), a funcionalidade deve se alinhar automaticamente. Vou verificar se preciso ajustar os rótulos dentro de `renderSectionContent` para bater com os novos títulos.

Sim, precisarei ajustar o `renderSectionContent` para que os títulos das seções (ex: "Dados iniciais" vs "Cadastro de Documentos") e os campos exibidos façam sentido com os novos nomes das etapas. Na verdade, como copiei a estrutura da trabalhista, o código já tem `if (sectionIndex === 0)` renderizando "Dados iniciais" (que corresponde a "Cadastro de Documentos").

Vou alinhar tudo para ficar perfeito.