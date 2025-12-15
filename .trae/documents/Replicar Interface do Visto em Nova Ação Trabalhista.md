## Objetivo
Reaplicar a mesma interface e funcionalidades do formulário de Vistos para o formulário de Ações Trabalhistas, mantendo os campos específicos e sincronizando tudo com Supabase.

## Atualizações de Dados (Supabase)
- Adicionar campos faltantes em `acoes_trabalhistas` (DB): `reu_name`, `autor_name`, `numero_processo`, `responsavel_name`, `responsavel_date`, `resumo`, `acompanhamento`, `contratado`, `foto_notificacao_doc`.
- Atualizar a API em `src/app/api/acoes-trabalhistas/route.ts` para mapear e persistir todos os campos (POST/PUT/GET) incluindo `foto_notificacao_doc`.
- Preservar nomes originais de arquivos no bucket (já feito em upload de documentos) e vincular uploads ao registro com `moduleType = "acoes_trabalhistas"`.

## Interface e UX
- Reescrever `src/app/dashboard/acoes-trabalhistas/novo/page.tsx` seguindo o layout de `src/app/dashboard/vistos/novo/page.tsx`:
  - Header com back e título.
  - Card “Informações da Ação” com grid responsivo.
  - Componentização de linhas de documento com `DocumentRow` equivalente:
    - Botão “Upload” com ícone `Upload`.
    - Múltiplos uploads por campo (input `multiple`).
    - Lista de ícones lado a lado, tooltip com nome do arquivo, clique abre em nova aba.
    - Botão “X” discreto no canto para remover arquivo antes de salvar.
  - Estados e handlers: `formData`, `uploadingDocs`, `extraUploads`, `handleDocumentUpload`, `convertTemporaryUploads(caseId)` com `moduleType: "acoes_trabalhistas"`.
  - Submissão (`handleSubmit`) cria ação via `/api/acoes-trabalhistas` e, se houver uploads, chama `convertTemporaryUploads` para tornar permanentes e associar ao `recordId`.

## Mapeamentos e Sincronização
- Mapear camelCase → snake_case na API:
  - `clientName → client_name`, `reuName → reu_name`, etc.
  - Incluir `fotoNotificacaoDoc → foto_notificacao_doc`.
- Garantir que o front envia todos os campos e que o backend retorna no formato frontend (camelCase) via `mapDbFieldsToFrontend`.

## Verificação
- Criar nova ação no formulário e validar persistência de campos.
- Fazer múltiplos uploads e confirmar ícones, nomes em hover e abertura em nova aba.
- Confirmar que ao salvar, os uploads temporários são convertidos e associados ao caso.

## Arquivos Envolvidos
- `src/db/schema.ts` (tabela `acoes_trabalhistas`).
- `src/app/api/acoes-trabalhistas/route.ts` (POST/PUT/GET). 
- `src/app/dashboard/acoes-trabalhistas/novo/page.tsx` (interface e lógica). 
- `src/app/api/documents/upload/route.ts` (já preserva nomes e organiza pastas).

Confirma executar essas mudanças agora?