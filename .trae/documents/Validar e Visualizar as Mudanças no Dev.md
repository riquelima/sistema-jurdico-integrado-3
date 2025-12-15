## O que vou fazer agora
- Confirmar que o servidor de desenvolvimento está rodando e instruir o acesso direto à página de detalhes.
- Passo‑a‑passo para verificar cada mudança que você solicitou diretamente na interface.

## Como acessar
- Abra: `http://localhost:3000/dashboard/vistos/27` (troque `27` pelo ID real do visto em teste, se necessário).
- Faça um refresh completo (Ctrl+Shift+R) para garantir que o CSS e o JS atualizados sejam carregados.

## Verificações na tela
- Observações:
  - Textarea maior ocupando o card e apenas o botão `Salvar`.
  - Clique em `Salvar` → aparece abaixo a mensagem verde “Salvo com sucesso!”.
  - Clique no botão de notas (ícone ao lado do título) → abre o modal redesenhado “Notas do Processo”.
  - No modal: cada item em cartão cinza claro, linha superior com `data hora – Autor (Cargo)`, texto logo abaixo e botão `x` para excluir.
- Fluxo do Processo:
  - Clique no círculo da etapa → alterna `Concluído`/pendente.
  - `Definir Responsável` → popover com sugestões e calendário; após salvar, aparece na etapa “Responsável: Nome · Prazo: dd/mm/aaaa”.
- Responsáveis:
  - Lista à direita com ícone menor (avatar) para cada responsável.
- Status:
  - Dropdown com “Em andamento” e “Finalizado” apenas; badge muda automaticamente.
- Documentos do Cliente:
  - Área de arraste e ícones lado a lado com tooltip; “x” no hover para excluir.

## Observação sobre persistência das notas
- No momento, as notas estão sendo salvas como um array JSON no campo `notes` da tabela `vistos`.
- Se preferir, posso criar imediatamente a tabela dedicada `vistos_notes` com endpoints (GET/POST/DELETE) e migrar as notas para lá em seguida.

## Se algo não aparecer
- Me informe o ID do visto que está testando; se o servidor estiver rodando em outra porta, ajusto a URL. Vou manter o dev ativo para validação contínua.