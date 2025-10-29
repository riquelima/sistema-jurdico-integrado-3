import { db } from '@/db';
import { vistos } from '@/db/schema';

async function main() {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const twentyFiveDaysAgo = new Date();
    twentyFiveDaysAgo.setDate(twentyFiveDaysAgo.getDate() - 25);
    
    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
    
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const sampleVistos = [
        {
            clientName: 'Wang Fang',
            type: 'Turismo',
            cpf: '100.200.300-40',
            rnm: 'V890123-J',
            passaporte: 'uploaded',
            comprovanteEndereco: 'uploaded',
            reservasPassagens: 'uploaded',
            reservasHotel: 'uploaded',
            seguroViagem: 'uploaded',
            roteiroViagem: 'uploaded',
            taxa: 'uploaded',
            status: 'Em Andamento',
            createdAt: fifteenDaysAgo.toISOString(),
            updatedAt: twoDaysAgo.toISOString(),
        },
        {
            clientName: 'Liu Xiao Ming',
            type: 'Trabalho',
            cpf: '200.300.400-50',
            rnm: 'V901234-K',
            passaporte: 'uploaded',
            comprovanteEndereco: 'uploaded',
            cartaoCnpj: 'uploaded',
            contratoEmpresa: 'uploaded',
            taxa: 'uploaded',
            status: 'Aguardando',
            createdAt: twentyFiveDaysAgo.toISOString(),
            updatedAt: fourDaysAgo.toISOString(),
        },
        {
            clientName: 'Zhou Wei',
            type: 'Investidor',
            cpf: '300.400.500-60',
            rnm: 'V012345-L',
            passaporte: 'uploaded',
            comprovanteEndereco: 'uploaded',
            cartaoCnpj: 'uploaded',
            contratoEmpresa: 'uploaded',
            escrituraImoveis: 'uploaded',
            taxa: 'uploaded',
            status: 'Finalizado',
            createdAt: sixtyDaysAgo.toISOString(),
            updatedAt: oneDayAgo.toISOString(),
        },
    ];

    await db.insert(vistos).values(sampleVistos);
    
    console.log('✅ Vistos seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});