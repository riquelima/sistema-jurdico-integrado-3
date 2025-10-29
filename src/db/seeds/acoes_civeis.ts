import { db } from '@/db';
import { acoesCiveis } from '@/db/schema';

async function main() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const fortyFiveDaysAgo = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

    const sampleAcoesCiveis = [
        {
            clientName: 'Maria Silva Santos',
            type: 'Exame DNA',
            currentStep: 2,
            status: 'Em Andamento',
            rnmMae: 'V123456-A',
            cpfMae: '123.456.789-00',
            certidaoNascimento: 'uploaded',
            comprovanteEndereco: 'uploaded',
            notes: 'Aguardando resultado do laboratório',
            createdAt: thirtyDaysAgo.toISOString(),
            updatedAt: fiveDaysAgo.toISOString(),
        },
        {
            clientName: 'João Pedro Costa',
            type: 'Divórcio Consensual',
            currentStep: 4,
            status: 'Aguardando',
            rnmMae: 'V234567-B',
            rnmPai: 'V234568-C',
            cpfMae: '234.567.890-11',
            cpfPai: '345.678.901-22',
            comprovanteEndereco: 'uploaded',
            guiaPaga: 'uploaded',
            notes: 'Aguardando assinatura dos cônjuges',
            createdAt: fortyFiveDaysAgo.toISOString(),
            updatedAt: twoDaysAgo.toISOString(),
        },
        {
            clientName: 'Ana Carolina Lima',
            type: 'Alteração de Nome',
            currentStep: 3,
            status: 'Finalizado',
            rnmMae: 'V345678-D',
            cpfMae: '456.789.012-33',
            certidaoNascimento: 'uploaded',
            comprovanteEndereco: 'uploaded',
            passaporte: 'uploaded',
            notes: 'Processo concluído com sucesso',
            createdAt: sixtyDaysAgo.toISOString(),
            updatedAt: oneDayAgo.toISOString(),
        }
    ];

    await db.insert(acoesCiveis).values(sampleAcoesCiveis);
    
    console.log('✅ Ações Civeis seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});