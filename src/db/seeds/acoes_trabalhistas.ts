import { db } from '@/db';
import { acoesTrabalhistas } from '@/db/schema';

async function main() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const fortyFiveDaysAgo = new Date();
    fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);

    const sampleData = [
        {
            clientName: 'Carlos Eduardo Souza',
            status: 'Em Andamento',
            createdAt: thirtyDaysAgo.toISOString(),
        },
        {
            clientName: 'Fernanda Oliveira Lima',
            status: 'Finalizado',
            createdAt: fortyFiveDaysAgo.toISOString(),
        },
    ];

    await db.insert(acoesTrabalhistas).values(sampleData);
    
    console.log('✅ Ações Trabalhistas seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});