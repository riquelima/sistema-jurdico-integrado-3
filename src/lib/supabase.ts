import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for organized file paths
export const getFilePath = {
  acoesCiveis: (caseId: number, step: string, fileName: string) => 
    `acoes-civeis/${caseId}/${step}/${sanitizeFileName(fileName)}`,
  
  compraVenda: (propertyId: number, fileName: string) => 
    `compra-venda/${propertyId}/${sanitizeFileName(fileName)}`,
  
  perdaNacionalidade: (caseId: number, step: string, fileName: string) => 
    `perda-nacionalidade/${caseId}/${step}/${sanitizeFileName(fileName)}`,
  
  vistos: (vistoId: number, category: string, fileName: string) => 
    `vistos/${vistoId}/${category}/${sanitizeFileName(fileName)}`,
  
  acoesTrabalhistas: (caseId: number, fileName: string) => 
    `acoes-trabalhistas/${caseId}/${sanitizeFileName(fileName)}`,
  
  acoesCriminais: (caseId: number, fileName: string) => 
    `acoes-criminais/${caseId}/${sanitizeFileName(fileName)}`,
};

function sanitizeFileName(fileName: string): string {
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .toLowerCase();
}

export const BUCKET_NAME = 'juridico-documentos';
