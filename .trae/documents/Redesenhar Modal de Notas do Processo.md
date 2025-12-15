## Objetivo
- Deixar o modal de notas visualmente igual ao da imagem: título "Notas do Processo", fundo branco com sombra e cantos arredondados, lista de notas em cartões cinza claros, cada uma com linha superior (data + autor + cargo) e texto abaixo.

## Dados da Nota
- Ampliar o objeto de nota salvo em `vistos.notes` (JSON) para conter:
  - `id`, `stepId`, `content`, `timestamp` (já usados)
  - `authorName` (ex.: "Adriana Roder"), `authorRole` (ex.: "Advogada")
- Preenchimento:
  - Ao salvar, pegar o responsável definido para a etapa atual (se existir) e usar como autor; se não houver, usar "Equipe" e cargo vazio.

## UI do Modal
- Header:
  - Título: "Notas do Processo" com tipografia mais forte
- Conteúdo:
  - Lista rolável (máx. altura ~60vh), cada nota como um cartão:
    - Linha superior: `dd/mm/aaaa hh:mm – authorName (authorRole)` em cinza
    - Texto da nota abaixo em fonte normal
  - Espaçamento consistente entre cartões, cantos arredondados e leve borda
- Rodapé:
  - Botão "Fechar" no canto direito
- Manter botão de exclusão discreto (x) à direita da linha superior, sem poluir o layout

## Implementações
- `src/app/dashboard/vistos/[id]/page.tsx`:
  - Atualizar `saveStepNotes(stepId)` para anexar `authorName/authorRole` ao objeto da nota
  - Ajustar renderização do modal para o layout da imagem (cartões claros, cabeçalho com data/autor/cargo)
  - Ocultar campos técnicos; focar só nos itens e texto

## Persistência
- Continuar usando o campo `vistos.notes` como um JSON array; sem novas dependências
- Ao excluir (x), filtrar pelo `id` e persistir a lista atualizada via `PUT /api/vistos?id=<id>`

## Validação
- Salvar nota → aparece no modal imediatamente com data/autor/cargo
- Excluir nota → some da lista e do banco
- Modal segue cor e UI da imagem (branco, sombra, cartões cinza claros, tipografia adequada)