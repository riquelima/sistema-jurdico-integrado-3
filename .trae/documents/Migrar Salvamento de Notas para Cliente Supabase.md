Vou refatorar a função `saveStepNotes` para usar o cliente **Supabase** diretamente no frontend, assim como fizemos para a atualização de etapas. Isso garantirá que as notas sejam salvas de forma confiável e imediata, evitando problemas com a API intermediária.

### Plano de Implementação:

1.  **Refatorar `saveStepNotes`:**
    *   Substituir a chamada `fetch` por `supabase.from('acoes_trabalhistas').update(...)`.
    *   Garantir que a nota seja salva no formato JSON stringificado correto, preservando o histórico existente.

2.  **Refatorar `deleteNote`:**
    *   Também atualizar a função de exclusão de notas para usar o cliente Supabase direto, mantendo a consistência.

3.  **Verificar Feedback Visual:**
    *   A lógica atual de exibir "Salvo" em verde (`setSaveMessages`) será mantida e funcionará corretamente após o sucesso da operação no Supabase.

### Resposta sobre o Supabase:
Não é necessário fazer nenhuma alteração manual no esquema do Supabase para as notas. A coluna `notes` já existe e é do tipo texto, o que suporta perfeitamente o armazenamento do JSON que estamos enviando. O problema anterior era específico da coluna `current_step` que não existia.