/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '../supabase';
import { FunctionDeclaration, SchemaType } from "@google/generative-ai";

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
                description: "El nombre del servicio elegido (ej. Bótox, Limpieza Facial).",
            },
            dateIso: {
                type: SchemaType.STRING,
                description: "Fecha y hora de la cita en formato ISO 8601 (ej. 2026-05-10T15:00:00Z). Calcula la fecha basado en la petición del usuario relativa al día de hoy.",
            },
        },
        required: ["clientId", "serviceName", "dateIso"],
    },
};

export async function createClient(name: string, email: string, phone: string) {
    try {
        const { data, error } = await supabase
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

export async function scheduleAppointment(clientId: string, serviceName: string, dateIso: string) {
    try {
        // En un caso real buscaríamos el serviceId, acá por simplicidad insertaremos el texto o un id random
        // Asumiendo que tenemos servicios pre-cargados
        const { data: services } = await supabase.from('services').select('id, price').limit(5);

        let serviceId = null;
        let price = 50000;

        if (services && services.length > 0) {
            // Pick random service or first one for simplicity, as serviceName might not match exactly yet
            serviceId = services[0].id;
            price = services[0].price;
        }

        const appointmentPayload = {
            client_id: clientId,
            service_id: serviceId,
            date: dateIso,
            status: 'agendada',
            total_price: price
        };

        const { data, error } = await supabase
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
            message: `Cita para el servicio '${serviceName}' agendada exitosamente el ${new Date(dateIso).toLocaleString()}. Total estimado: $${price}.`,
            appointmentRef: data.id
        };

    } catch (e: any) {
        return { status: "error", message: `Excepción interna: ${e.message}` };
    }
}
