Vou replicar a interface e funcionalidade da página de detalhes de **Ações Trabalhistas** para a página de **Ações Criminais**, garantindo paridade visual e funcional.

### Análise e Planejamento:

1.  **Comparação de Schemas:**
    *   `acoes_trabalhistas` tem colunas extras que `acoes_criminais` já possui no schema local (graças a uma sincronização recente), mas precisamos garantir que o banco de dados remoto tenha todas as colunas necessárias, especialmente `current_step` e os campos de detalhes (`reuName`, `numeroProcesso`, etc.).
    *   A tabela `acoes_criminais` no arquivo `schema.ts` já está atualizada com os campos novos.

2.  **Migração de Banco de Dados:**
    *   Vou criar um script SQL (`fix_acoes_criminais_schema.sql`) para garantir que a tabela `acoes_criminais` tenha todas as colunas necessárias no Supabase, similar ao que foi feito para `acoes_trabalhistas`. Isso incluirá `current_step`, `reu_name`, `autor_name`, etc.

3.  **Replicação da Página de Detalhes:**
    *   Copiarei o conteúdo de `src/app/dashboard/acoes-trabalhistas/[id]/page.tsx` para `src/app/dashboard/acoes-criminais/[id]/page.tsx`.
    *   Adaptarei o código para:
        *   Usar `WORKFLOWS` específicos de Ações Criminais (que definirei com base no padrão: "Análise Inicial", "Defesa Prévia", "Audiência", "Sentença", "Recursos", "Trânsito em Julgado").
        *   Alterar referências de API de `/api/acoes-trabalhistas` para `/api/acoes-criminais`.
        *   Alterar `moduleType` para `acoes_criminais`.
        *   Ajustar títulos e textos específicos.

4.  **Atualização da API (`route.ts`):**
    *   Atualizarei `src/app/api/acoes-criminais/route.ts` para suportar todos os novos campos no `POST` e `PUT`, garantindo que os dados do formulário detalhado sejam salvos corretamente.

5.  **Validação:**
    *   Solicitarei que você execute o script SQL no Supabase.
    *   Verificarei a navegação e edição na nova página.

### Passo 1: Script SQL
Criarei o arquivo `fix_acoes_criminais_schema.sql` com os comandos `ALTER TABLE` necessários.

### Passo 2: Página de Detalhes
Reescreverei a página `[id]/page.tsx` de criminais com a base da trabalhista.

### Passo 3: API Backend
Atualizarei a rota de API para lidar com os novos campos.

Vamos começar preparando o ambiente.