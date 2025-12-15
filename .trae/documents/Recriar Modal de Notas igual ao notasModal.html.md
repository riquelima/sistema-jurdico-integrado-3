## Objetivo
- Recriar o modal de notas usando o mesmo layout visual de `notasModal.html`: overlay com blur, container branco com sombra e cantos arredondados, cabeçalho com título e botão fechar, lista rolável de cartões cinza claros com linha superior (data + autor + cargo) e texto abaixo.

## Implementação
- Criar componente `NotesModal` e usar `Dialog` existente aplicando classes do HTML de referência:
  - Overlay: `fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4`
  - Container: `bg-white w-full max-w-4xl rounded-xl shadow-modal flex flex-col max-h-[90vh] overflow-hidden`
  - Cabeçalho: `px-6 py-5 border-b flex justify-between items-center bg-white` + botão fechar (ícone Material ou Lucide)
  - Conteúdo: `p-6 overflow-y-auto custom-scrollbar flex-grow bg-white`
  - Rodapé: `px-6 py-4 border-t bg-white flex justify-end items-center rounded-b-xl` com botão “Fechar” azul
- Cartões de nota:
  - `bg-card-light border rounded-lg p-4 shadow-sm`
  - Linha superior: `text-xs font-medium text-gray-500 mb-2` com `dd/mm/aaaa hh:mm - Nome (Cargo)`
  - Texto: `text-sm text-gray-900 leading-relaxed`
  - Botão “x” discreto à direita para exclusão

## Dados e Comportamento
- Manter salvamento no array JSON `vistos.notes` já implementado, contendo `{ id, stepId, content, timestamp, authorName, authorRole }`.
- Ao salvar, limpar textarea, mostrar “Salvo com sucesso!” e adicionar a nota à lista do modal com a data/hora.
- Exclusão: remover por `id` e persistir via `PUT /api/vistos?id=...`.

## Integração
- Substituir o bloco atual do modal em `src/app/dashboard/vistos/[id]/page.tsx` pelo novo `NotesModal` com as classes de `notasModal.html`.
- Reutilizar estados `showNotesModal`, `notesArray`, `deleteNote` e a lógica de formatação de data/hora.

## Validação
- Abrir `/dashboard/vistos/{id}`.
- Salvar uma observação → aparece “Salvo com sucesso!” e surge no modal com data/hora.
- Abrir modal → layout idêntico ao HTML de referência, rolagem e cartões visuais corretos.
- Excluir nota pelo “x” → remove da lista e do banco.

## Observações
- Sem novas dependências; uso de Tailwind existente e ícones Lucide.
- Se desejar usar exatamente o Material Icons do HTML, posso incluir o ícone `close` para o botão de fechar.