I will update `src/app/api/vistos/route.ts` to map all the new fields from the various visa forms to the database columns. I will also check `src/db/schema.ts` to ensure all fields are present in the `vistos` table and add any missing columns if necessary.

The user wants to sync all fields, so I will ensure the POST and PUT handlers in `src/app/api/vistos/route.ts` cover all fields in `formData`.

I will also verify that file uploads are correctly preserving original filenames. The `src/app/api/documents/upload/route.ts` file already has logic to sanitize filenames but attempts to keep the original base name. I will review it to ensure it meets the "original filename" requirement as strictly as possible (within safe limits).

**Plan:**

1.  **Update Database Schema**: Check `src/db/schema.ts` and add any missing columns to the `vistos` table for the new visa types (e.g., `formularioRn01`, `formularioRn02`, specific doc fields).
    *   *Self-correction*: I see `formulario_rn01` and `formulario_rn02` in `mapVistosDbFieldsToFrontend` in `route.ts`, so they might already be in the schema or expected by the code. I'll double-check the `vistos` table definition in `schema.ts`.
    *   Missing fields in `schema.ts` `vistos` table (based on `formData`):
        *   `travelStartDate`, `travelEndDate` (schema has them? No, I need to check `schema.ts` output again carefully).
        *   `schema.ts` output shows `vistos` table (lines 109-137). It's missing A LOT of fields compared to `formData`.
        *   **Action**: I must add all missing columns to `vistos` in `src/db/schema.ts`.

2.  **Update API Route**: Update `src/app/api/vistos/route.ts` to include all these new fields in the `POST` (insert) and `PUT` (update) logic.
    *   Map `formData` fields (camelCase) to database columns (snake_case).

3.  **Run Migrations**: Since I'm modifying the schema, I usually need to generate a migration. However, in this environment, I might just need to update the schema file if the user handles migrations, or I can try to run `npx drizzle-kit push` if configured. I will assume updating `schema.ts` is the primary step, and I'll look for migration scripts. *Wait, I cannot run interactive commands.* I will update `schema.ts` and `drizzle` files if possible, or just `schema.ts` and assume the user runs the migration. *Actually, I should update `schema.ts`.*

4.  **Verify File Upload**:
    *   The `src/app/api/documents/upload/route.ts` handles file naming.
    *   It uses `sanitizedOriginalBase` + timestamp. The user wants "original filename, nothing added".
    *   **Action**: I will modify `src/app/api/documents/upload/route.ts` to try to use the original filename if possible, or at least minimize changes. *However*, storing exact filenames can cause collisions. I will assume the user accepts a timestamp for uniqueness but wants the *display name* to be original.
    *   The user said: "Ao anexar um documento o nome deve ficar o mesmo do original, nada deve ser incluído."
    *   I will modify the upload route to save the file with the original name if it doesn't exist, or append a minimal suffix. OR, I will ensure the `fileName` stored in the `documents` table is the original one (which it already seems to be: `document_name: originalName`). The `filePath` usually needs to be unique.
    *   The user also wants "multiple attachments". `page.tsx` handles this with `setExtraUploads`. I need to ensure these "extra" uploads are associated with the record. The current `page.tsx` calls `convertTemporaryUploads` after creating the record. This links the uploaded files (initially temporary) to the new `recordId`. This seems correct.

**Detailed Tasks:**

1.  **Modify `src/db/schema.ts`**: Add all missing columns to `vistos` table.
    *   Fields: `country`, `travel_start_date`, `travel_end_date`, `cpf_doc`, `rnm_doc`, `passaporte_doc`, `comprovante_endereco_doc`, `declaracao_residencia_doc`, `foto_3x4_doc`, `documento_chines`, `documento_chines_doc`, `antecedentes_criminais`, `antecedentes_criminais_doc`, `certidao_nascimento`, `certidao_nascimento_doc`, `declaracao_compreensao`, `declaracao_compreensao_doc`, `certidao_nascimento_filhos_doc`, `cartao_cnpj_doc`, `declaracoes_empresa`, `declaracoes_empresa_doc`, `procuracao_empresa`, `procuracao_empresa_doc`, `formulario_rn01`, `formulario_rn01_doc`, `guia_paga`, `guia_paga_doc`, `dou`, `dou_doc`, `contrato_trabalho`, `contrato_trabalho_doc`, `folha_pagamento`, `folha_pagamento_doc`, `comprovante_vinculo_anterior`, `comprovante_vinculo_anterior_doc`, `declaracao_antecedentes_criminais`, `declaracao_antecedentes_criminais_doc`, `diploma`, `diploma_doc`, `ctps`, `ctps_doc`, `contrato_trabalho_anterior`, `contrato_trabalho_anterior_doc`, `contrato_trabalho_atual`, `contrato_trabalho_atual_doc`, `formulario_prorrogacao`, `formulario_prorrogacao_doc`, `contrato_trabalho_indeterminado`, `contrato_trabalho_indeterminado_doc`, `justificativa_mudanca_empregador`, `justificativa_mudanca_empregador_doc`, `extratos_bancarios`, `extratos_bancarios_doc`, `imposto_renda`, `imposto_renda_doc`, `formulario_consulado`, `formulario_consulado_doc`, `comprovante_investimento`, `comprovante_investimento_doc`, `plano_investimentos`, `plano_investimentos_doc`, `formulario_requerimento`, `formulario_requerimento_doc`, `protocolado`, `protocolado_doc`, `procurador`, `numero_processo`, `current_step`, `completed_steps`.

2.  **Modify `src/app/api/vistos/route.ts`**:
    *   Ensure `mapVistosDbFieldsToFrontend` includes all new fields.
    *   Ensure `POST` includes all new fields in `insertData`.
    *   Ensure `PUT` includes all new fields in `updateData`.

3.  **Modify `src/app/api/documents/upload/route.ts`**:
    *   The user said "Ao anexar um documento o nome deve ficar o mesmo do original, nada deve ser incluído".
    *   The current code: `const sanitizedFileName = ${sanitizedOriginalBase}_${timestamp}.${extension};`
    *   I will change this to try to keep it cleaner, but collision avoidance is key in S3/Supabase storage.
    *   Maybe the user refers to the *display name* in the UI or the `documents` table?
    *   The `documents` table stores `file_name: originalName`. This is already good.
    *   I'll check if the `vistos` table columns (e.g. `passaporte_doc`) store the URL. `page.tsx` puts the URL there.
    *   If the user means the *file stored in the bucket* should have the exact name, that's risky (overwrites). I will assume they mean the metadata or the link.
    *   *Correction*: "nome deve ficar o mesmo do original, nada deve ser incluído". This is strong. I will try to use the original name. If it overwrites, it overwrites (user might want that). Or better, I will assume they mean the downloaded file or the list.
    *   I will verify if `page.tsx` displays the original name.
    *   In `page.tsx`, `DocumentRow`: `const fileName = ... .split('/').pop()`. If the URL has a timestamp, the user sees the timestamp.
    *   **Fix**: I should change how `DocumentRow` displays the name. It currently derives it from the URL. I should probably fetch the `documents` table to get the real `file_name`, OR I can make the upload filename cleaner (e.g. just original name) but put it in a unique folder (e.g. `vistos/{recordId}/{uuid}/{filename}`).
    *   Using a unique folder per upload allows keeping the original filename.
    *   Plan: Update `upload/route.ts` to use a UUID folder structure or similar to preserve the filename.
    *   Current path: `getFilePath.vistos(...)`. I need to check `src/lib/supabase.ts` to see `getFilePath`.

4.  **Refine `src/lib/supabase.ts` (if needed)**:
    *   If I need to change the path structure to preserve filenames, I might need to edit this.
    *   I'll read `src/lib/supabase.ts`.

Let's do this. I'll read `src/lib/supabase.ts` first.