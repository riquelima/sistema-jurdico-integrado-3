import { db } from '@/db';
import { alerts } from '@/db/schema';

async function main() {
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

    const sampleAlerts = [
        {
            moduleType: 'acoes_civeis',
            recordId: 1,
            alertFor: 'JESSICA',
            message: 'Resultado do exame DNA disponível para Maria Silva Santos',
            isRead: false,
            createdAt: twoDaysAgo.toISOString(),
        },
        {
            moduleType: 'compra_venda',
            recordId: 1,
            alertFor: 'MARRONE',
            message: 'Prazo de sinal vencendo em 5 dias - Rua das Flores, 123',
            isRead: false,
            createdAt: oneDayAgo.toISOString(),
        },
        {
            moduleType: 'vistos',
            recordId: 2,
            alertFor: 'FÁBIO',
            message: 'Documentação do visto de trabalho de Liu Xiao Ming completa',
            isRead: true,
            createdAt: fiveDaysAgo.toISOString(),
        },
    ];

    await db.insert(alerts).values(sampleAlerts);
    
    console.log('✅ Alerts seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});