## Correções
- Importar `AlertDialogTrigger` de `@/components/ui/alert-dialog` em `src/app/dashboard/vistos/[id]/page.tsx` para remover o erro “AlertDialogTrigger is not defined”.
- Manter `AlertDialog` e suas ações como já estão.

## Alinhamento de Sessões
- Primeira linha: Garantir que `Fluxo do Processo` (col-span-8) e o container da direita (`Status` + `Observações`, col-span-4) tenham alturas pareadas: manter `min-h` idêntico e `flex-col` com `Observações` usando `flex-1`.
- Segunda linha: Colocar `Documentos do Cliente` (col-span-8) e `Responsáveis` (col-span-4) na mesma linha; `Responsáveis` com `h-full` e conteúdo distribuído para preencher a altura.

## Validação
- Rodar dev e checar `/dashboard/vistos/{id}` sem erro de console.
- Conferir se as alturas de ambos os pares (linha 1 e linha 2) estão alinhadas como nas imagens.
- Rodar `npm run lint` para garantir zero erros.

## Escopo
- Alteração pontual de import e revisão leve de classes já aplicadas; sem novas dependências, só Tailwind e shadcn existentes.