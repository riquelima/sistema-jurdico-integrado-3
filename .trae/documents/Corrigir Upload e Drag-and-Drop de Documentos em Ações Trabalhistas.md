O problema de upload ocorre porque a função `handleFileUpload` em `acoes-trabalhistas/[id]/page.tsx` está tentando enviar o arquivo, mas não está passando o parâmetro `moduleType` no `FormData`. Além disso, a rota de API espera esse parâmetro para salvar o arquivo no local correto e atualizar a tabela correta.

Vou corrigir a função `handleFileUpload` e `handleDropFiles` (que ainda não li, mas presumo que exista ou precise ser criada para a área de drag-and-drop) para garantir que:

1.  **Envio do Parâmetro `moduleType`:** O `FormData` incluirá `moduleType: 'acoes_trabalhistas'` e `clientName` (extraído de `caseData`).
2.  **Atualização da Lista de Documentos:** Após o upload, a lista de documentos será recarregada corretamente.
3.  **Área de Drag-and-Drop:** Implementarei ou corrigirei a função `handleDropFiles` para processar arquivos arrastados para a área de documentos, chamando a mesma lógica de upload.

Isso garantirá que os documentos apareçam na seção "Documentos do Cliente" logo após o envio.