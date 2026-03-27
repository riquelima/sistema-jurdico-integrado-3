import { getSupabaseAdminClient } from "@/lib/supabase-server";
import {
    computePendingByFlow,
    extractDocumentsFromRecord,
    getAcoesCiveisDocRequirements,
    getAcoesCriminaisDocRequirements,
    getAcoesTrabalhistasDocRequirements,
    getCompraVendaDocRequirements,
    getPerdaNacionalidadeDocRequirements,
    getTurismoDocRequirements,
    getVistosDocRequirements,
} from "@/lib/pending-documents";

function extractUploadedKeys(documents: any[]) {
    const keys = new Set<string>();
    for (const d of documents || []) {
        const k = d?.field_name || d?.fieldName || d?.document_type || d?.documentType;
        if (k) keys.add(String(k));
    }
    return keys;
}

export async function updatePendingDocuments(moduleType: string, recordId: number) {
    try {
        const supabase = getSupabaseAdminClient();

        // 1. Determine table and fetch record
        let tableName = moduleType;
        if (moduleType === "vistos" || moduleType === "turismo") {
            // 'turismo' moduleType might point to 'turismo' table or 'vistos' table depending on implementation
            // But usually 'turismo' is a type within 'vistos' or a separate table.
            // Based on rebuild/route.ts, 'turismo' moduleType interacts with 'turismo' table if it exists?
            // Let's check rebuild logic: 
            // if moduleType === 'turismo', it queries 'turismo' table.
            // if moduleType === 'vistos', it queries 'vistos' table.
            // But wait, 'turismo' might be just a type in 'vistos' table in some contexts.
            // In rebuild/route.ts:
            // if moduleType === 'vistos': queries 'vistos' table.
            // if moduleType === 'turismo': queries 'turismo' table.
            // So we should respect the moduleType passed.
            tableName = moduleType;
        }

        // Handle map for known table names if they differ from moduleType
        if (moduleType === 'compra-venda') tableName = 'compra_venda_imoveis';

        const { data: record, error: recordError } = await supabase
            .from(tableName)
            .select("*")
            .eq("id", recordId)
            .single();

        if (recordError || !record) {
            console.error(`[updatePendingDocuments] Record not found for ${moduleType}:${recordId}`, recordError);
            return;
        }

        // 2. Fetch uploaded documents
        // Note: module_type in 'documents' table might differ.
        // 'turismo' might be stored as 'vistos' or 'turismo'.
        // In delete/route.ts or upload/route.ts, we see how it is stored.
        // Ideally we fetch by record_id and module_type.
        // We should be broad with module_type for 'vistos'/'turismo' overlap if needed.

        let docsModuleType = moduleType;
        if (moduleType === 'turismo') docsModuleType = 'turismo'; // or 'vistos'? 
        // In rebuild/route.ts:
        // for 'turismo': .in("module_type", ["vistos", "turismo"])

        let docsQuery = supabase.from("documents").select("*").eq("record_id", recordId);

        if (moduleType === 'turismo') {
            docsQuery = docsQuery.in("module_type", ["vistos", "turismo"]);
        } else {
            docsQuery = docsQuery.eq("module_type", moduleType);
        }

        const { data: docsData, error: docsError } = await docsQuery;
        const docs = docsData || [];

        // 3. Extract keys
        const uploaded = extractUploadedKeys(docs);
        const recordDocs = extractDocumentsFromRecord(record);
        recordDocs.forEach((k) => uploaded.add(k));

        // 4. Determine requirements
        let requirements: any[] = [];
        let targetModule = moduleType;

        if (moduleType === 'vistos') {
            // Check if it is actually turismo inside vistos table (if that's a thing)
            // But usually 'turismo' is separate.
            // In rebuild/route.ts for 'vistos' loop:
            // const isTurismo = r.type === "Turismo";
            // if isTurismo -> getTurismoDocRequirements

            const isTurismo = record.type === "Turismo" || record.type === "Visto de Turismo";
            if (isTurismo) {
                requirements = getTurismoDocRequirements();
                targetModule = 'turismo'; // Align with rebuild logic which sets module_type='turismo' for these
            } else {
                requirements = getVistosDocRequirements({ type: record.type, country: record.country });
            }
        } else if (moduleType === 'turismo') {
            requirements = getTurismoDocRequirements();
        } else if (moduleType === 'acoes_trabalhistas') {
            requirements = getAcoesTrabalhistasDocRequirements();
        } else if (moduleType === 'acoes_civeis') {
            requirements = getAcoesCiveisDocRequirements();
        } else if (moduleType === 'acoes_criminais') {
            requirements = getAcoesCriminaisDocRequirements();
        } else if (moduleType === 'compra_venda_imoveis' || moduleType === 'compra-venda') {
            requirements = getCompraVendaDocRequirements();
            targetModule = 'compra_venda_imoveis';
        } else if (moduleType === 'perda_nacionalidade') {
            requirements = getPerdaNacionalidadeDocRequirements();
        }

        // 5. Compute pending
        const computed = computePendingByFlow(requirements, uploaded);

        // 6. Upsert
        const { error: upsertError } = await supabase
            .from("pending_documents")
            .upsert(
                {
                    module_type: targetModule,
                    record_id: recordId,
                    client_name: record.client_name || record.clientName || "Cliente sem nome",
                    pending: computed.pending,
                    missing_count: computed.missingCount,
                    total_count: computed.totalCount,
                    computed_at: new Date().toISOString(),
                },
                { onConflict: "module_type,record_id" }
            );

        if (upsertError) {
            console.error(`[updatePendingDocuments] Error upserting for ${moduleType}:${recordId}`, upsertError);
        } else {
            console.log(`[updatePendingDocuments] Updated for ${moduleType}:${recordId}. Missing: ${computed.missingCount}`);
        }

    } catch (err) {
        console.error(`[updatePendingDocuments] Unexpected error for ${moduleType}:${recordId}`, err);
    }
}
