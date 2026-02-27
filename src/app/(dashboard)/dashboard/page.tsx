/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import {
    Users,
    TrendingUp,
    Plus,
    ArrowUpRight,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    // Buscar citas más recientes (futuras si es posible, o las últimas agregadas)
    const { data: appos } = await supabase
        .from('appointments')
        .select(`
            id, 
            date, 
            status,
            clients (name),
            services (name)
        `)
        .order('date', { ascending: false })
        .limit(3);

    const upcomingAppointments = (appos as any[])?.map((appo: any) => ({
        id: appo.id,
        name: (Array.isArray(appo.clients) ? appo.clients[0] : appo.clients)?.name || 'Cliente Genérico',
        service: (Array.isArray(appo.services) ? appo.services[0] : appo.services)?.name || 'Servicio General',
        time: new Date(appo.date).toLocaleDateString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        status: appo.status
    })) || [];

    // Calcular stats rápidos (Simplificado para el demo - todos los clientes e ingresos)
    const { count: clientsCount } = await supabase.from('clients').select('*', { count: 'exact', head: true });

    // Obtenemos ingresos totales sumando total_price
    const { data: allAppos } = await supabase.from('appointments').select('total_price');
    const totalRev = allAppos?.reduce((acc, curr) => acc + (curr.total_price || 0), 0) || 0;

    const stats = [
        { name: 'Ingresos Totales', value: `$${totalRev.toLocaleString('es-AR')}`, icon: TrendingUp, color: 'text-mint', href: '/dashboard/ingresos' },
        { name: 'Clientes Registrados', value: clientsCount?.toString() || '0', icon: Users, color: 'text-mint', href: '/dashboard/clientes' },
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Resumen General</h1>
                    <p className="text-white/40 font-medium">Gestioná tu estética con precisión quirúrgica.</p>
                </div>
                <Link href="/dashboard/citas">
                    <Button className="h-fit">
                        <Plus className="w-5 h-5 mr-2" />
                        Nueva Cita
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <Link href={stat.href} key={stat.name} className="block w-full">
                        <Card className="relative overflow-hidden group h-full transition-colors hover:bg-white/[0.05]">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-4">{stat.name}</p>
                                    <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-mint/5 border border-mint/10 group-hover:scale-110 transition-transform duration-500">
                                    <stat.icon className="w-6 h-6 text-mint" />
                                </div>
                            </div>
                            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-mint/60">
                                <ArrowUpRight className="w-4 h-4" />
                                <span>Datos actualizados en tiempo real</span>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Appointments */}
                <Card className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black tracking-tight">Citas Recientes</h2>
                        <Link href="/dashboard/citas" className="text-xs font-black uppercase tracking-widest text-mint hover:underline">
                            Ver todas
                        </Link>
                    </div>

                    {upcomingAppointments.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
                            No hay citas registradas aún.
                        </div>
                    ) : (
                        <div className="space-y-4 flex-1">
                            {upcomingAppointments.map((appo) => (
                                <div key={appo.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-bold text-lg border border-white/5">
                                            {appo.name[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm">{appo.name}</h3>
                                            <p className="text-white/40 text-xs truncate max-w-[150px]">{appo.service}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-1.5 text-mint font-black text-sm">
                                            <Clock className="w-4 h-4" />
                                            {appo.time}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                                            {appo.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Quick Actions / Integration Info */}
                <Card className="bg-mint/5 border-mint/10 relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight mb-4 group-hover:text-glow transition-all">Listo para crecer.</h2>
                            <p className="text-white/60 text-sm leading-relaxed mb-8">
                                Tu base de datos está conectada de forma segura mediante **Supabase RLS**.
                                Cada registro está protegido y encriptado.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant="secondary"
                                className="w-full"
                                onClick={() => window.open('https://github.com/diegofbis63', '_blank')}
                            >
                                Manual Pro
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full"
                                onClick={() => window.location.href = 'mailto:soporte@esteticapro.com'}
                            >
                                Soporte
                            </Button>
                        </div>
                    </div>
                    {/* Subtle background decoration */}
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-mint/10 rounded-full blur-3xl" />
                </Card>
            </div>
        </div>
    );
}
