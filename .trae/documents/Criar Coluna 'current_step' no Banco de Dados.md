O erro `Could not find the 'current_step' column` ocorre porque a coluna `current_step` **não existe** na tabela `acoes_trabalhistas` no banco de dados, nem na definição de esquema local (`src/db/schema.ts`). Para corrigir isso e permitir que você marque as etapas como concluídas, precisamos atualizar o esquema do banco de dados.

### Plano de Correção:

1.  **Atualizar Definição do Esquema (`src/db/schema.ts`):**
    *   Adicionar o campo `currentStep: integer('current_step').default(0)` à definição da tabela `acoesTrabalhistas`.

2.  **Criar e Aplicar Migração:**
    *   Como não tenho acesso direto para rodar comandos SQL no seu banco de produção, utilizarei o Drizzle Kit (já instalado no projeto) para gerar e aplicar a alteração.
    *   Executarei o comando `npx drizzle-kit push` para sincronizar o esquema local com o banco de dados remoto (Supabase). Isso criará a coluna `current_step` automaticamente.

3.  **Verificação:**
    *   Após a migração, testarei novamente a funcionalidade de marcar etapas como concluídas na interface.

**Nota:** Esta operação altera a estrutura do banco de dados. Certifique-se de que isso é desejado (é necessário para a funcionalidade funcionar).