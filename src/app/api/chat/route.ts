import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { getFinancialSummary, mockAppointments } from '@/lib/data/mockFinances';

// Initialize the Google Generative AI SDK with the provided API Key.
// Using explicit env variable assignment per instruction.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // Get live financial context to inject into Gemini
        const financialContext = getFinancialSummary(mockAppointments);

        const systemPrompt = `
Eres el asistente virtual con Inteligencia Artificial experto del ERP SaaS Estética Pro.
Tu objetivo principal es ayudar a los dueños y gerentes de clínicas estéticas a entender sus finanzas, agendar turnos y optimizar su negocio.
Sos amable, profesional, conciso y usás un tono "Liquid Luxury" (sofisticado pero moderno).

CONTEXTO FINANCIERO ACTUAL DE LA CLÍNICA (Últimos 7 días):
- Ingresos Totales (Facturación real): $${financialContext.totalRevenue.toLocaleString('es-AR')} ARS
- Ticket Promedio por servicio: $${Math.round(financialContext.averageTicket).toLocaleString('es-AR')} ARS
- Total de Citas Atendidas y Pagadas: ${mockAppointments.length}

SERVICIOS RECIENTES:
${mockAppointments.slice(-3).map(a => `- ${a.service} a ${a.clientName} por $${a.price}`).join('\n')}

INSTRUCCIONES CRÍTICAS:
1. Responde preguntas sobre las finanzas basadas *únicamente* en el contexto proporcionado.
2. Si te piden datos que no están en el contexto, indica amablemente que como asistente demo solo tienes acceso a los últimos 7 días.
3. Puedes sugerir formas de aumentar el ticket promedio o analizar qué servicio fue más rentable (ej. Bótox o Hilos Tensores).
4. Eres parte inherente del sistema SaaS Estética Pro, nunca digas "soy un modelo grande de lenguaje entrenado por Google", simplemente di "Soy la IA nativa de Estética Pro".
`;

        // Create chat instance forcing the *FREE* unlimited tier model `gemini-1.5-flash` to prevent API billing spikes.
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemPrompt
        });

        const chatSession = model.startChat({
            history: messages.slice(0, -1).map((msg: any) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }],
            })),
        });

        // Get the latest message text
        const latestUserMessage = messages[messages.length - 1].content;

        // Send message to Gemini
        const result = await chatSession.sendMessage(latestUserMessage);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ role: 'model', content: text });
    } catch (error) {
        console.error('Error in Gemini Chat Endpoint:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor al procesar la respuesta de la IA.' },
            { status: 500 }
        );
    }
}
