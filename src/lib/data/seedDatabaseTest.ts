import { seedDatabase } from './seedDatabase';

async function runTest() {
    console.log("Iniciando auditoría QA de Inyección Supabase...");
    const result = await seedDatabase(5, 20, 5);
    console.log("Resultado del Seeding:", result);
}

runTest();
