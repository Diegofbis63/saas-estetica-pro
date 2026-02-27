/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI, FunctionDeclaration, SchemaType } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { getFinancialSummary, mockAppointments } from '@/lib/data/mockFinances';
import { seedDatabase } from '@/lib/data/seedDatabase';
import { createClientDeclaration, scheduleAppointmentDeclaration, createClient, scheduleAppointment } from '@/lib/data/dbOperations';

// Initialize the Google Generative AI SDK with the provided API Key.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const executeDatabaseSeedingDeclaration: FunctionDeclaration = {
    name: "execute_database_seeding",
    description: "Ejecuta una inserción masiva en la base de datos de prueba (Supabase) para clientes, citas y servicios.",
    parameters: {
        type: SchemaType.OBJECT,
        properties: {
            clientsCount: {
                type: SchemaType.NUMBER,
                description: "Número de clientes a crear",
            },
            appointmentsCount: {
                type: SchemaType.NUMBER,
                description: "Número de citas a agendar",
            },
            servicesCount: {
                type: SchemaType.NUMBER,
                description: "Número de servicios faltantes a crear con precios reales",
            }
        },
        required: ["clientsCount", "appointmentsCount", "servicesCount"],
    },
};

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const financialContext = getFinancialSummary(mockAppointments);

        const systemPrompt = `
Eres el asistente virtual Ejecutivo con Inteligencia Artificial del ERP SaaS Estética Pro.
Tu objetivo principal es asistir a los dueños de clínicas estéticas a entender sus finanzas y gestionar su negocio (ahora con permisos de Escritura reales).
Sos amable, profesional, conciso y usás un tono "Liquid Luxury" (sofisticado pero moderno).

INSTRUCCIONES CRÍTICAS EJECUTIVAS:
1. Tienes permiso y herramientas para intervenir la base de datos en tiempo real:
   - Usa 'create_client' cuando el usuario te pida registrar un nuevo cliente con datos específicos.
   - Usa 'schedule_appointment' cuando el usuario te pida agendar una cita para un cliente.
   - Usa 'execute_database_seeding' SOLO cuando el usuario te pida crear datos de prueba, clientes o citas de forma MASIVA (Ej: "crea 20 clientes y agenda 20 citas").
2. Una vez ejecutada una herramienta y recibida la confirmación de la DB, notifica al usuario con un mensaje de éxito indicando que la base de datos y la interfaz gráfica han sido actualizadas.
3. Si el usuario pregunta por ventas históricas, responde usando *únicamente* el contexto financiero adjunto.
4. Eres parte nativa de Estética Pro. No digas "soy un modelo creado por Google".
5. Si no tienes todos los datos para una cita (como fecha y servicio), calcúlalos lógicamente según la regla del negocio.

CONTEXTO FINANCIERO ACTUAL DE LA CLÍNICA (Últimos 7 días):
- Ingresos Totales: $${financialContext.totalRevenue.toLocaleString('es-AR')} ARS
- Ticket Promedio: $${Math.round(financialContext.averageTicket).toLocaleString('es-AR')} ARS
- Citas Atendidas: ${mockAppointments.length}
`;

        console.log("Iniciando solicitud a Gemini con modelo gemini-2.5-flash");
        if (!process.env.GEMINI_API_KEY) {
            console.error("CRÍTICO: No se encontró GEMINI_API_KEY en las variables de entorno");
        }

        const model = genAI.getGenerativeModel({
            model: "models/gemini-2.5-flash",
            systemInstruction: systemPrompt,
            tools: [{
                functionDeclarations: [
                    executeDatabaseSeedingDeclaration,
                    createClientDeclaration,
                    scheduleAppointmentDeclaration
                ],
            }]
        });

        const formattedHistory = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
            formattedHistory.shift();
        }

        const chatSession = model.startChat({
            history: formattedHistory,
        });

        const latestUserMessage = messages[messages.length - 1].content;
        let result = await chatSession.sendMessage(latestUserMessage);
        let response = await result.response;

        let refreshDashboard = false;

        const calls = response.functionCalls();
        if (calls && calls.length > 0) {
            // Manejamos la primera llamada (o múltiples iterativamente)
            for (const call of calls) {
                let dbResult;
                refreshDashboard = true; // Si hubo mutate en DB, refrescamos UI

                if (call.name === "execute_database_seeding") {
                    const args: any = call.args;
                    dbResult = await seedDatabase(
                        args.clientsCount || 10,
                        args.appointmentsCount || 20,
                        args.servicesCount || 5
                    );
                } else if (call.name === "create_client") {
                    const args: any = call.args;
                    dbResult = await createClient(args.name, args.email || '', args.phone || '');
                } else if (call.name === "schedule_appointment") {
                    const args: any = call.args;
                    dbResult = await scheduleAppointment(args.clientId, args.serviceName, args.dateIso);
                }

                if (dbResult) {
                    // Reingresamos la confirmación de la DB al cerebro de Gemini
                    result = await chatSession.sendMessage([{
                        functionResponse: {
                            name: call.name,
                            response: dbResult
                        }
                    }]);
                    response = await result.response;
                }
            }
        }

        const text = response.text();
        return NextResponse.json({
            role: 'model',
            content: text,
            refreshDashboard // Inyectado para que el Frontend sepa si debe recargar datos
        });
    } catch (error) {
        console.error('Error in Gemini Chat Endpoint:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor al procesar la respuesta de la IA.' },
            { status: 500 }
        );
    }
}
