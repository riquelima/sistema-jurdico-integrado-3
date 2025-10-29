import { db } from '@/db';
import { compraVendaImoveis } from '@/db/schema';

async function main() {
    const now = new Date();
    
    const sampleData = [
        {
            numeroMatricula: "12345",
            cadastroContribuinte: "987.654.321-0001",
            enderecoImovel: "Rua das Flores, 123 - São Paulo/SP",
            rgVendedores: "12.345.678-9",
            cpfVendedores: "111.222.333-44",
            dataNascimentoVendedores: "1980-05-15",
            rnmComprador: "V456789-E",
            cpfComprador: "555.666.777-88",
            enderecoComprador: "Av. Paulista, 456 - São Paulo/SP",
            currentStep: 2,
            status: "Em Andamento",
            prazoSinal: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            prazoEscritura: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            contractNotes: "Aguardando documentação do cartório",
            createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            numeroMatricula: "67890",
            cadastroContribuinte: "123.456.789-0002",
            enderecoImovel: "Av. Atlântica, 789 - Rio de Janeiro/RJ",
            rgVendedores: "98.765.432-1",
            cpfVendedores: "222.333.444-55",
            dataNascimentoVendedores: "1975-08-22",
            rnmComprador: "V567890-F",
            cpfComprador: "666.777.888-99",
            enderecoComprador: "Rua Copacabana, 321 - Rio de Janeiro/RJ",
            currentStep: 4,
            status: "Aguardando",
            prazoSinal: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            prazoEscritura: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            contractNotes: "Aguardando assinatura da escritura",
            createdAt: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        }
    ];

    await db.insert(compraVendaImoveis).values(sampleData);
    
    console.log('✅ Compra Venda Imóveis seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});