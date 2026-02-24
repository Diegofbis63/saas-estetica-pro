"use client";

import { Card } from "@/components/ui/Card";
import {
    Users,
    TrendingUp,
    Calendar as CalendarIcon,
    Plus,
    ArrowUpRight,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
    const stats = [
        { name: 'Citas de Hoy', value: '8', icon: CalendarIcon, color: 'text-mint' },
        { name: 'Ingresos del Mes', value: '$124.500', icon: TrendingUp, color: 'text-mint' },
        { name: 'Nuevos Clientes', value: '12', icon: Users, color: 'text-mint' },
    ];

    const upcomingAppointments = [
        { id: 1, name: 'Martina Rodríguez', service: 'Limpieza Facial Profunda', time: '14:30', status: 'confirmada' },
        { id: 2, name: 'Julián Sosa', service: 'Dermapen + Vitaminas', time: '16:00', status: 'pendiente' },
        { id: 3, name: 'Sofía Benítez', service: 'Peeling Químico', time: '17:30', status: 'confirmada' },
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Resumen General</h1>
                    <p className="text-white/40 font-medium">Gestioná tu estética con precisión quirúrgica.</p>
                </div>
                <Button className="h-fit">
                    <Plus className="w-5 h-5" />
                    Nueva Cita
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.name} className="relative overflow-hidden group">
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
                            <span>+12.5% respecto al mes pasado</span>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Appointments */}
                <Card className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black tracking-tight">Próximos 3 Clientes</h2>
                        <Link href="/dashboard/citas" className="text-xs font-black uppercase tracking-widest text-mint hover:underline">
                            Ver todos
                        </Link>
                    </div>
                    <div className="space-y-4 flex-1">
                        {upcomingAppointments.map((appo) => (
                            <div key={appo.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-bold text-lg border border-white/5">
                                        {appo.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">{appo.name}</h3>
                                        <p className="text-white/40 text-xs">{appo.service}</p>
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
                            <Button variant="secondary" className="w-full">Manual Pro</Button>
                            <Button variant="secondary" className="w-full">Soporte</Button>
                        </div>
                    </div>
                    {/* Subtle background decoration */}
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-mint/10 rounded-full blur-3xl" />
                </Card>
            </div>
        </div>
    );
}

// Helper Link for the component
import Link from "next/link";
