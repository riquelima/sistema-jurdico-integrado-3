Vou refatorar a função `handleStepCompletion` na página de detalhes de Ações Trabalhistas para utilizar o cliente **Supabase** diretamente no frontend, em vez de passar pela rota de API. Isso elimina intermediários e garante uma conexão mais direta e confiável para a atualização de etapas, conforme sua sugestão.

### Plano de Implementação:

1.  **Importar Cliente Supabase:**
    *   Adicionar `import { supabase } from "@/lib/supabase";` no arquivo `src/app/dashboard/acoes-trabalhistas/[id]/page.tsx`.

2.  **Atualizar Lógica de Conclusão (`handleStepCompletion`):**
    *   Substituir a chamada `fetch('/api/acoes-trabalhistas...')` por `supabase.from('acoes_trabalhistas').update(...)`.
    *   Garantir que o ID do processo seja convertido corretamente para número (`Number(id)`) antes de enviar ao banco.
    *   Manter a atualização de estado local (`setCaseData`) e a chamada secundária para `step-assignments` (que gerencia tarefas).

3.  **Tratamento de Erros:**
    *   Adicionar logs claros caso o Supabase retorne erro, facilitando o diagnóstico se houver problemas de permissão ou dados incorretos.

Essa abordagem resolve o erro "Record not found" causado por falhas na comunicação com a API e alinha o código com a prática de usar o Supabase diretamente para operações de tempo real/cliente quando apropriado.