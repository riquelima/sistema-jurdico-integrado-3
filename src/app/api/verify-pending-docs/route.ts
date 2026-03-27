
import { NextResponse } from 'next/server';
import { getTurismoDocRequirements, getVistosDocRequirements } from '@/lib/pending-documents';

export async function GET() {
    const data = {
        turismo: getTurismoDocRequirements(),
        estudante: getVistosDocRequirements({ type: "Visto de Estudante", country: "EUA" }), // Consular flow
        reuniao: getVistosDocRequirements({ type: "Visto de Reunião Familiar", country: "EUA" }), // Consular flow
        brasil: getVistosDocRequirements({ type: "Visto de Trabalho - Brasil", country: "Brasil" }), // Brasil flow
    };
    return NextResponse.json(data);
}
