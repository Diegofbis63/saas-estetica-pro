import { subDays, format } from "date-fns";

export interface Appointment {
    id: string;
    clientName: string;
    service: string;
    price: number;
    date: string;
    status: 'pagado' | 'pendiente';
}

const services = [
    { name: 'Bótox Facial Completo', price: 45000 },
    { name: 'Relleno de Labios AC', price: 35000 },
    { name: 'Hilos Tensores', price: 80000 },
    { name: 'Peeling Químico Premium', price: 25000 },
    { name: 'Dermapen + Vitaminas', price: 28000 }
];

const firstNames = ['María', 'Valentina', 'Camila', 'Sofía', 'Martina', 'Lucía', 'Catalina', 'Emilia', 'Zoe', 'Isabella'];
const lastNames = ['González', 'Rodríguez', 'Gómez', 'Fernández', 'López', 'Díaz', 'Martínez', 'Pérez', 'García', 'Sánchez'];

export function generateMockAppointments(): Appointment[] {
    const appointments: Appointment[] = [];
    const today = new Date();

    for (let i = 0; i < 20; i++) {
        // Distribute 20 appts over the last 7 days
        const daysAgo = Math.floor(Math.random() * 7);
        const date = subDays(today, daysAgo);

        const service = services[Math.floor(Math.random() * services.length)];
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

        appointments.push({
            id: `appo-${i}-${Date.now()}`,
            clientName: `${firstName} ${lastName}`,
            service: service.name,
            price: service.price,
            date: format(date, 'yyyy-MM-dd'),
            status: 'pagado'
        });
    }

    // Sort by date ascending
    return appointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Single instance for consistency across the app
export const mockAppointments = generateMockAppointments();

export function getFinancialSummary(appointments: Appointment[] = mockAppointments) {
    const totalRevenue = appointments.reduce((sum, app) => sum + app.price, 0);
    const averageTicket = totalRevenue / Math.max(1, appointments.length);

    // Group by date for charts
    const revenueByDate = appointments.reduce((acc, app) => {
        const date = app.date;
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += app.price;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(revenueByDate).map(([date, amount]) => ({
        date,
        // Short readable format like "15 Mar"
        displayDate: format(new Date(date + 'T12:00:00'), 'dd MMM'),
        ingresos: amount
    }));

    return {
        totalRevenue,
        averageTicket,
        chartData
    };
}
