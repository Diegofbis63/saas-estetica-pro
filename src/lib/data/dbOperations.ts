/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js';
import { FunctionDeclaration, SchemaType } from "@google/generative-ai";

// ── Server-side Admin client (bypasses RLS for trusted API routes) ──
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
);

// ═══════════════════════════════════════════════════════════════
// FUNCTION DECLARATIONS (para Gemini tool calling)
// ═══════════════════════════════════════════════════════════════

export const createClientDeclaration: FunctionDeclaration = {
    name: "create_client",
    description: "Crea un nuevo cliente específico en la base de datos de la clínica. Usa esto cuando el usuario te indique datos de una persona (nombre, email, teléfono).",
    parameters: {
        type: SchemaType.OBJECT,
        properties: {
            name: {
                type: SchemaType.STRING,
                description: "Nombre completo del cliente",
            },
            email: {
                type: SchemaType.STRING,
                description: "Email del cliente. Si no se provee, inventa uno basado en el nombre (ej: nombre@gmail.com).",
            },
            phone: {
                type: SchemaType.STRING,
                description: "Teléfono del cliente. Si no se provee, inventa uno válido de Argentina (+54911...)",
            },
        },
        required: ["name"],
    },
};

export const createServiceDeclaration: FunctionDeclaration = {
    name: "create_service",
    description: "Crea un nuevo servicio o tratamiento estético en la base de datos. Usa esto cuando el usuario te pida agregar un nuevo servicio, tratamiento, o paquete con su precio.",
    parameters: {
        type: SchemaType.OBJECT,
        properties: {
            name: {
                type: SchemaType.STRING,
                description: "Nombre del servicio (ej: Limpieza Facial Profunda, Bótox)",
            },
            price: {
                type: SchemaType.NUMBER,
                description: "Precio del servicio en formato numérico.",
            },
            duration: {
                type: SchemaType.NUMBER,
                description: "Duración del servicio en minutos. Por defecto asume 60 si no lo sabes.",
            },
        },
        required: ["name", "price"],
    },
};

export const scheduleAppointmentDeclaration: FunctionDeclaration = {
    name: "schedule_appointment",
    description: "Agenda una nueva cita para un cliente. Usa esto cuando el usuario te pida agendarle un turno a alguien. Necesitas el ID del cliente devuelto por create_client o buscar uno.",
    parameters: {
        type: SchemaType.OBJECT,
        properties: {
            clientId: {
                type: SchemaType.STRING,
                description: "El UUID del cliente al que se le agenda la cita.",
            },
            serviceName: {
                type: SchemaType.STRING,
                description: "El nombre del servicio elegido (ej. Bótox, Limpieza Facial, Facial Pro).",
            },
            dateIso: {
                type: SchemaType.STRING,
                description: "Fecha y hora de la cita en formato ISO 8601 (ej. 2026-05-10T15:00:00Z). Calcula la fecha basado en la petición del usuario relativa al día de hoy.",
            },
        },
        required: ["clientId", "serviceName", "dateIso"],
    },
};

// ═══════════════════════════════════════════════════════════════
// DB OPERATIONS — usan supabaseAdmin (service_role, bypasa RLS)
// ═══════════════════════════════════════════════════════════════

export async function dbCreateClient(name: string, email: string, phone: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from('clients')
            .insert([{ name, email, phone }])
            .select('*')
            .single();

        if (error) {
            console.error("Error creating client:", error);
            return {
                status: "error",
                message: `Error en base de datos al crear cliente: ${error.message}`
            };
        }

        return {
            status: "success",
            message: `Cliente ${name} creado exitosamente con ID ${data.id}.`,
            clientRef: data.id,
            clientName: data.name
        };
    } catch (e: any) {
        return { status: "error", message: `Excepción interna: ${e.message}` };
    }
}

export async function dbCreateService(name: string, price: number, duration: number = 60) {
    try {
        const { data, error } = await supabaseAdmin
            .from('services')
            .insert([{ name, price, duration }])
            .select('*')
            .single();

        if (error) {
            console.error("Error creating service:", error);
            return {
                status: "error",
                message: `Error en base de datos al crear servicio: ${error.message}`
            };
        }

        return {
            status: "success",
            message: `Servicio "${name}" creado exitosamente con precio $${price}.`,
            serviceRef: data.id,
            serviceName: data.name,
            servicePrice: data.price,
        };
    } catch (e: any) {
        return { status: "error", message: `Excepción interna: ${e.message}` };
    }
}

export async function dbScheduleAppointment(clientId: string, serviceName: string, dateIso: string) {
    try {
        // Buscar el servicio por nombre (ILIKE para tolerancia de acentos/mayúsculas)
        let serviceId: string | null = null;
        let price = 50000;

        // Primero intento buscar por nombre similar
        const { data: matchedServices } = await supabaseAdmin
            .from('services')
            .select('id, name, price')
            .ilike('name', `%${serviceName}%`)
            .limit(1);

        if (matchedServices && matchedServices.length > 0) {
            serviceId = matchedServices[0].id;
            price = matchedServices[0].price;
        } else {
            // Fallback: usar el primer servicio disponible
            const { data: fallbackServices } = await supabaseAdmin
                .from('services')
                .select('id, price')
                .limit(1);

            if (fallbackServices && fallbackServices.length > 0) {
                serviceId = fallbackServices[0].id;
                price = fallbackServices[0].price;
            }
        }

        const appointmentPayload = {
            client_id: clientId,
            service_id: serviceId,
            date: dateIso,
            status: 'agendada',
            total_price: price
        };

        const { data, error } = await supabaseAdmin
            .from('appointments')
            .insert([appointmentPayload])
            .select('*')
            .single();

        if (error) {
            console.error("Error scheduling appointment:", error);
            return {
                status: "error",
                message: `Error al agendar cita: ${error.message}`
            };
        }

        return {
            status: "success",
            message: `Cita para el servicio '${serviceName}' agendada exitosamente el ${new Date(dateIso).toLocaleString('es-AR')}. Total estimado: $${price.toLocaleString('es-AR')}.`,
            appointmentRef: data.id
        };

    } catch (e: any) {
        return { status: "error", message: `Excepción interna: ${e.message}` };
    }
}
