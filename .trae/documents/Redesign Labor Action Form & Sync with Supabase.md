I will redesign the "Nova Ação Trabalhista" page (`src/app/dashboard/acoes-trabalhistas/novo/page.tsx`) to match the new UI style of the Visa form, ensuring all fields are correctly mapped and synced with Supabase.

**Plan:**

1. **Update Database Schema**:

   * I need to update `src/db/schema.ts` for the `acoes_trabalhistas` table. It currently only has `clientName`, `status`, `notes`, `createdAt`.

   * I will add the missing columns based on the current form fields: `reu_name`, `numero_processo`, `responsavel_name`, `responsavel_date`, `resumo`, `acompanhamento`, `contratado`, `finalizado`, and document field `foto_notificacao_doc`.

2. **Redesign Page Interface**:

   * I will rewrite `src/app/dashboard/acoes-trabalhistas/novo/page.tsx` using the components and layout structure from the Visa form (`src/app/dashboard/vistos/novo/page.tsx`).

   * It will use `DocumentRow` for the file upload (with the new icon grid, delete button, etc.).

   * It will use the clean sectioned layout (Cards/Divs with headers).

   * I'll ensure state management (`formData`, `extraUploads`) mirrors the robust logic of the Visa form.

3. **Update API Route**:

   * I need to check `src/app/api/acoes-trabalhistas/route.ts` (I'll read it first) to ensure it handles the new fields and `POST` logic correctly, mapping camelCase to snake\_case for the DB.

4. **Sync Logic**:

   * The `handleSubmit` in the new page will send all data to the API.

   * The file upload will use the `handleDocumentUpload` logic that handles temporary/permanent uploads and links them to the record.

**Step-by-step Execution:**

1. Read `src/app/api/acoes-trabalhistas/route.ts` to see current implementation.
2. Update `src/db/schema.ts` with new columns.
3. Update `src/app/api/acoes-trabalhistas/route.ts` to support new fields.
4. Rewrite `src/app/dashboard/acoes-trabalhistas/novo/page.tsx` with the new UI and logic.

