## Escopo
- Substituir integralmente o JSX atual de `src/app/dashboard/vistos/[id]/page.tsx` por uma versão fiel do `telaDetalhes.html`, mantendo apenas o estado e handlers necessários.
- Remover o uso de `StepItem`, `NotesPanel`, `DocumentPanel` e qualquer markup antigo; toda a UI será escrita inline seguindo o HTML de referência.

## Layout idêntico
- Header: back à esquerda, título (cliente), subtítulo (tipo), botão Excluir à direita. Espaçamentos e tipografia como no HTML.
- Grid: `lg:grid-cols-12` com:
  - `lg:col-span-8`: card “Fluxo do Processo” com timeline completa.
  - `lg:col-span-4`: cards “Status” e “Observações”.
  - Segunda linha: `lg:col-span-8` “Documentos do Cliente” e `lg:col-span-4` “Responsáveis”.

## Fluxo do Processo (copiado do HTML)
- Implementar conectores e nós conforme HTML:
  - Concluído: círculo verde com check e trilha verde.
  - Atual: círculo azul com ponto central e cartão destacado com badge “Atual” e descrição em cinza.
  - Pendente: círculos e itens com menor opacidade.
- À direita de cada linha: botão “Definir Responsável” e caret de expandir; na etapa atual, adicionar ícone de edição ao lado do título.
- O conteúdo expandido (quando abrir) reutiliza `renderStepContent(step)` abaixo do cartão, sem alterar lógica de persistência.

## Status (copiado)
- Select estilizado com opções “Em Andamento”, “Pausado”, “Cancelado”, “Concluído”.
- Blocos informativos: Etapa Atual, Criado em, Última atualização.
- Usa `handleStatusChange` e datas do caso.

## Observações (copiado)
- Card com título, etiqueta “INTERNO”, textarea com fundo sutil, barra inferior com ícones “Anexar” e “Formatar” à esquerda e botão “Salvar” à direita.
- Integra com `saveStepNotes(0)` para persistir.

## Documentos (copiado)
- Área de “arraste e solte” com ícone central e textos.
- Listagem em cartões com ícone (imagem/arquivo), nome truncado, data/hora, campo, e menu de ações (download, excluir, renomear).
- Usa diretamente os handlers existentes: `handleFileUpload`, `handleDeleteDocument`, `handleRenameDocument`, `onDocumentDownload`.

## Responsáveis (copiado)
- Lista de membros com avatares de iniciais coloridos, nome e cargo; botão de email.
- Rodapé com botão “Adicionar membro”.
- Popula a lista derivada de `assignments` já carregados.

## Ícones e classes
- Replicar os ícones do HTML usando SVG inline equivalentes (sem novas dependências), garantindo aparência idêntica.
- Reproduzir classes Tailwind do HTML para bordas, sombras, cores e tipografia.

## Lógica e dados
- Preservar toda a lógica de dados, fetch e persistência; apenas reconectar os handlers nos novos elementos.
- Corrigir endpoints dinâmicos com `await context.params` quando aplicável (já ajustado em documentos).

## Validação
- Rodar dev, abrir `/dashboard/vistos/{id}` e comparar visual com a imagem anexada até ficar idêntico (cores, espaçamentos, tamanhos e posições).
- Rodar `npm run lint` e garantir ausência de erros.
