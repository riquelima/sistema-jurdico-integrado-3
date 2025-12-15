## Objetivo
- Deixar a tela mais elegante e consistente entre os blocos (`div`), padronizando tipografia, espaçamentos e data no formato dd/mm/aaaa.

## Padronização Visual
- Containers de seção: `bg-white rounded-lg border shadow-xs p-3 space-y-3`.
- Títulos: `text-base font-semibold` com botão ícone compacto à direita (`size="icon"`, `h-7 w-7`).
- Grades internas: `grid md:grid-cols-2 gap-3`.
- Itens de campo: wrapper `space-y-1`; label `text-xs font-medium text-slate-700`; valor `text-xs text-slate-900 leading-snug`.
- Ícones de anexos: manter linha de ícones com hover + “x”, alinhados com `flex flex-wrap gap-2`.

## Datas (dd/mm/aaaa)
- Criar util `src/lib/date.ts` com `formatDateBR(dateStr)` e `formatDateTimeBR(iso)`.
- Aplicar em:
  - `travelStartDate` e `travelEndDate` na página de Vistos.
  - `createdAt/updatedAt` exibidos no painel/status (quando mostrado em texto).
  - `assignments.dueDate` e demais campos de data textuais da página.
  - Manter inputs tipo `date` sem formatação (apenas leitura usa `formatDateBR`).

## Arquivos a alterar
- `src/app/dashboard/vistos/[id]/page.tsx`:
  - Encapar blocos com o novo padrão de container e ajustar classes (`space-y/gap/p-*`).
  - Substituir renderizações de datas por helpers (`formatDateBR`).
- `src/lib/date.ts`:
  - Implementar helpers de formatação.

## Verificação
- Conferir todas seções: mesmos espaçamentos e tipografia.
- Datas mostradas como `dd/mm/aaaa` em leitura.
- Modal e anexos mantêm elegância e densidade.

Posso implementar os ajustes de estilo e a formatação de datas conforme descrito?