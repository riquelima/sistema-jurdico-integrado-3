import { db } from '@/db';
import { perdaNacionalidade } from '@/db/schema';

async function main() {
    const now = new Date();
    const fortyDaysAgo = new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000);
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    const fiftyDaysAgo = new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    const sampleData = [
        {
            clientName: 'Li Wei Zhang',
            rnmMae: 'V678901-G',
            rnmPai: 'V678902-H',
            cpfMae: '777.888.999-00',
            cpfPai: '888.999.000-11',
            certidaoNascimento: 'uploaded',
            comprovanteEndereco: 'uploaded',
            passaportes: 'uploaded',
            documentoChines: 'uploaded',
            traducaoJuramentada: 'uploaded',
            currentStep: 3,
            status: 'Em Andamento',
            createdAt: fortyDaysAgo.toISOString(),
            updatedAt: fiveDaysAgo.toISOString(),
        },
        {
            clientName: 'Chen Mei Lin',
            rnmMae: 'V789012-I',
            cpfMae: '999.000.111-22',
            certidaoNascimento: 'uploaded',
            comprovanteEndereco: 'uploaded',
            passaportes: 'uploaded',
            documentoChines: 'uploaded',
            traducaoJuramentada: 'uploaded',
            currentStep: 5,
            status: 'Deferido',
            createdAt: fiftyDaysAgo.toISOString(),
            updatedAt: twoDaysAgo.toISOString(),
        },
    ];

    await db.insert(perdaNacionalidade).values(sampleData);

    console.log('✅ Perda Nacionalidade seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});