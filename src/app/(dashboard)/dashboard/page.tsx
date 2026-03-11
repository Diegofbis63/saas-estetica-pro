/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import {
    Users,
    TrendingUp,
    Plus,
    ArrowUpRight,
    Clock,
    Sparkles,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QuickActionButtons } from "./QuickActionButtons";
import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

// URLs de imágenes premium para centros de estética
const STYLIST_IMAGES = [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=100&q=80",
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=100&q=80",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=100&q=80"
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "circOut" as any } }
};


export default function DashboardPage() {
    const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
    const [clientsCount, setClientsCount] = useState(0);
    const [totalRev, setTotalRev] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Buscar citas más recientes
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

                const mappedAppos = (appos as any[])?.map((appo: any, idx: number) => ({
                    id: appo.id,
                    name: (Array.isArray(appo.clients) ? appo.clients[0]?.name : appo.clients?.name) || 'Cliente Genérico',
                    service: (Array.isArray(appo.services) ? appo.services[0]?.name : appo.services?.name) || 'Servicio General',
                    time: new Date(appo.date).toLocaleDateString('es-AR', { hour: '2-digit', minute: '2-digit' }),
                    status: appo.status,
                    image: STYLIST_IMAGES[idx % STYLIST_IMAGES.length]
                })) || [];

                setUpcomingAppointments(mappedAppos);

                // Stats rápidos
                const { count } = await supabase.from('clients').select('*', { count: 'exact', head: true });
                setClientsCount(count || 0);

                const { data: allAppos } = await supabase.from('appointments').select('total_price');
                const rev = allAppos?.reduce((acc, curr) => acc + (curr.total_price || 0), 0) || 0;
                setTotalRev(rev);
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const stats = [
        { name: 'Ingresos Totales', value: `$${totalRev.toLocaleString('es-AR')}`, icon: TrendingUp, color: 'text-rose-500', href: '/dashboard/ingresos', description: 'Crecimiento mensual +12%' },
        { name: 'Clientes Activos', value: clientsCount.toString(), icon: Users, color: 'text-rose-400', href: '/dashboard/clientes', description: '4 nuevos esta semana' },
    ];

    if (loading) return (
        <div className="h-[60vh] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12 pb-20"
        >
            {/* Premium Header */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Sistema Operativo v2.0</span>
                        </div>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight text-foreground mb-3">
                        Bienvenido, <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-rose-400 to-rose-300">Studio Manager</span>
                    </h1>
                    <p className="text-foreground/50 text-lg font-medium max-w-xl">
                        Control total sobre tu centro de estética. Cada detalle, optimizado para el lujo.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/citas">
                        <Button className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all active:scale-95 group">
                            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                            Agendar Cita
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <Link href={stat.href} key={stat.name} className="group">
                        <Card className="relative h-full p-8 bg-white/70 border-black/5 hover:border-black/10 hover:bg-white transition-all duration-500 overflow-hidden shadow-sm">
                            <div className="flex items-start justify-between relative z-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("p-2 rounded-lg bg-rose-50 border border-rose-100", stat.color)}>
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                        <p className="text-foreground/50 text-[10px] font-bold uppercase tracking-widest">{stat.name}</p>
                                    </div>
                                    <p className="text-4xl font-extrabold tracking-tighter text-foreground group-hover:text-rose-600 transition-all">
                                        {stat.value}
                                    </p>
                                    <p className="text-[11px] font-medium text-foreground/40">{stat.description}</p>
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-foreground/20 group-hover:text-rose-400 transition-colors" />
                            </div>

                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-100 transition-colors" />
                        </Card>
                    </Link>
                ))}

                {/* AI Insight Card */}
                <Card className="p-8 bg-gradient-to-br from-rose-50 to-white border-rose-100 relative overflow-hidden group flex flex-col justify-between shadow-sm">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-sm shadow-rose-500/50" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 transition-all">IA Insight</span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2 italic">"Tus jueves son los días de mayor demanda."</h3>
                        <p className="text-foreground/60 text-xs leading-relaxed">Considera agregar un refuerzo en tratamientos faciales para maximizar el ROI.</p>
                    </div>
                    <div className="mt-8 relative z-10">
                        <div className="w-full h-1.5 bg-rose-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "75%" }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                                className="h-full bg-rose-500 shadow-sm shadow-rose-500/50"
                            />
                        </div>
                        <p className="text-[9px] font-bold text-foreground/40 mt-2 uppercase tracking-widest text-right">Optimización: 75%</p>
                    </div>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Upcoming Appointments */}
                <Card className="lg:col-span-8 p-0 bg-transparent border-none overflow-visible shadow-none">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Citas Prioritarias</h2>
                            <span className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-100 text-[10px] font-bold text-rose-600">{upcomingAppointments.length} hoy</span>
                        </div>
                        <Link href="/dashboard/citas" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-rose-500 transition-colors">
                            Ver Calendario Completo
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {upcomingAppointments.length === 0 ? (
                        <div className="h-64 rounded-3xl border border-dashed border-black/10 flex items-center justify-center text-foreground/30 text-sm font-medium">
                            No hay citas pendientes para hoy.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {upcomingAppointments.map((appo, idx) => (
                                <motion.div
                                    key={appo.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative p-5 rounded-[2rem] bg-white border border-black/5 flex items-center justify-between hover:border-rose-200 transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden grayscale-[30%] group-hover:grayscale-0 transition-all duration-500 border border-black/5">
                                                <img src={appo.image} alt={appo.name} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-white border border-rose-100 flex items-center justify-center shadow-sm">
                                                <Clock className="w-3 h-3 text-rose-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-foreground group-hover:text-rose-600 transition-colors">{appo.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[11px] font-medium text-foreground/60 bg-black/5 px-2 py-0.5 rounded-md border border-black/5">{appo.service}</span>
                                                <span className="w-1 h-1 rounded-full bg-black/10" />
                                                <span className="text-[11px] font-medium text-foreground/40 uppercase tracking-widest">{appo.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-foreground tracking-tighter transition-all">
                                            {appo.time.split(',')[1]?.trim() || appo.time}
                                        </div>
                                        <div className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mt-1">
                                            Confirmado
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Growth / Pro Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="p-8 bg-rose-500 border-none text-white relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all shadow-md">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-black leading-tight mb-4">Lanza tu campaña de verano.</h2>
                            <p className="text-white/80 text-sm font-medium mb-8 leading-relaxed">Impacta a +200 clientes inactivos con nuestro motor de IA.</p>
                            <Button className="w-full py-6 rounded-2xl bg-white text-rose-600 border-none shadow-none hover:bg-white/90 font-black uppercase text-xs tracking-widest">
                                Activar Ahora
                            </Button>
                        </div>
                        <TrendingUp className="absolute -right-8 -bottom-8 w-40 h-40 text-black/10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                    </Card>

                    <Card className="p-0 bg-white border-black/5 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-black/5 flex items-center justify-between bg-black/[0.02]">
                            <h3 className="text-xs font-black uppercase tracking-widest text-foreground/40">Enlaces Rápidos</h3>
                        </div>
                        <div className="p-2">
                            <QuickActionButtons />
                        </div>
                    </Card>
                </div>
            </motion.div>
        </motion.div>
    );
}

