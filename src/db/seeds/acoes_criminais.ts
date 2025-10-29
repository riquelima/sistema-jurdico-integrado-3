import { db } from '@/db';
import { acoesCriminais } from '@/db/schema';

async function main() {
    const twentyDaysAgo = new Date();
    twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
    
    const thirtyFiveDaysAgo = new Date();
    thirtyFiveDaysAgo.setDate(thirtyFiveDaysAgo.getDate() - 35);

    const sampleData = [
        {
            clientName: 'Roberto Silva Mendes',
            status: 'Em Andamento',
            createdAt: twentyDaysAgo.toISOString(),
        },
        {
            clientName: 'Patricia Costa Santos',
            status: 'Aguardando',
            createdAt: thirtyFiveDaysAgo.toISOString(),
        },
    ];

    await db.insert(acoesCriminais).values(sampleData);
    
    console.log('✅ Ações Criminais seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});