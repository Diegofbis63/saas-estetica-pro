"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card } from "@/components/ui/Card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar as CalendarIcon, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function IngresosPage() {
    const [mounted, setMounted] = useState(false);
    const [finances, setFinances] = useState({
        totalRevenue: 0,
        averageTicket: 0,
        appointmentsCount: 0,
        chartData: [] as any[],
        transactions: [] as any[]
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        const { data: appos } = await supabase
            .from('appointments')
            .select(`
                id, 
                date, 
                status,
                total_price,
                clients (name),
                services (name)
            `)
            .order('date', { ascending: true });

        if (appos) {
            let total = 0;
            const daily: Record<string, number> = {};
            const txs: { id: string, clientName: string, service: string, date: string, price: number, status: string }[] = [];

            for (const a of appos) {
                total += a.total_price || 0;

                const d = new Date(a.date);
                const dayKey = d.toLocaleDateString('es-AR', { month: 'short', day: 'numeric' });

                if (!daily[dayKey]) daily[dayKey] = 0;
                daily[dayKey] += a.total_price || 0;

                // Formateamos para la tabla
                txs.push({
                    id: a.id,
                    clientName: (a.clients as any)?.name || 'Cliente Genérico',
                    service: (a.services as any)?.name || 'Servicio General',
                    date: d.toLocaleDateString('es-AR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    price: a.total_price || 0,
                    status: a.status
                });
            }

            setFinances({
                totalRevenue: total,
                averageTicket: appos.length > 0 ? total / appos.length : 0,
                appointmentsCount: appos.length,
                chartData: Object.keys(daily).map(k => ({ displayDate: k, ingresos: daily[k] })),
                transactions: txs.reverse() // Mostrar recientes primero
            });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true);
        // eslint-disable-next-line
        fetchData();

        // Listen for standard updates from AI Copilot
        const handleRefresh = () => {
            fetchData();
        };
        // Next.js router.refresh() triggers a refetch of Server Components,
        // but since this is a Client Component fetching via useEffect, we need to bind to the router manually 
        // or just add an interval/event listener. Let's add an event listener just in case we dispatch it,
        // but Next app router doesn't strictly bubble router.refresh to client component states unless passed as props.
        // As a fallback, we fetch every 5 secs if we want "realtime" or rely on a global event from FloatingChat.
        window.addEventListener('dashboard-refresh', handleRefresh);
        return () => window.removeEventListener('dashboard-refresh', handleRefresh);
    }, []);

    if (!mounted) return null;

    return (
        <div className="space-y-10 animate-fade-in relative">
            {isLoading && (
                <div className="absolute inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                    <Loader2 className="w-8 h-8 text-mint animate-spin" />
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Ingresos y Finanzas</h1>
                    <p className="text-white/40 font-medium">Análisis de facturación en vivo desde Supabase.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-sm font-medium text-white/80">
                        <CalendarIcon className="w-4 h-4 text-mint" />
                        Histórico Total
                    </div>
                    <Button variant="secondary" className="h-fit" onClick={fetchData}>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Recargar
                    </Button>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white/50">Facturación Total</h3>
                        <div className="p-2 rounded-lg bg-mint/10">
                            <DollarSign className="w-4 h-4 text-mint" />
                        </div>
                    </div>
                    <p className="text-4xl font-black tracking-tighter text-glow-mint">${finances.totalRevenue.toLocaleString('es-AR')}</p>
                    <p className="text-xs text-mint mt-2 font-bold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Actualizado en tiempo real
                    </p>
                </Card>
                <Card className="bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white/50">Ticket Promedio</h3>
                        <div className="p-2 rounded-lg bg-indigo-500/10">
                            <TrendingUp className="w-4 h-4 text-indigo-400" />
                        </div>
                    </div>
                    <p className="text-4xl font-black tracking-tighter">${Math.round(finances.averageTicket).toLocaleString('es-AR')}</p>
                    <p className="text-xs text-indigo-400 mt-2 font-bold">Por servicio realizado</p>
                </Card>
                <Card className="bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-all hidden lg:block">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white/50">Citas Pagadas</h3>
                        <div className="p-2 rounded-lg bg-purple-500/10">
                            <CalendarIcon className="w-4 h-4 text-purple-400" />
                        </div>
                    </div>
                    <p className="text-4xl font-black tracking-tighter">{finances.appointmentsCount}</p>
                    <p className="text-xs text-purple-400 mt-2 font-bold">Histórico</p>
                </Card>
            </div>

            {/* Chart */}
            <Card className="p-6 bg-white/[0.02] border border-white/5">
                <div className="mb-6">
                    <h2 className="text-xl font-black tracking-tight">Evolución de Ingresos</h2>
                    <p className="text-sm text-white/40 font-medium">Facturación diaria de servicios premium</p>
                </div>
                <div className="h-[400px] w-full">
                    {finances.chartData.length === 0 ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/30 text-sm">
                            <TrendingUp className="w-8 h-8 mb-4 opacity-50" />
                            Aún no hay datos suficientes para graficar.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={finances.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis
                                    dataKey="displayDate"
                                    stroke="#ffffff50"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#ffffff50"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value / 1000}k`}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#020617',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                                    }}
                                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                    labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="ingresos"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorIngresos)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Card>

            {/* Latest Transactions */}
            <Card className="overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-black tracking-tight">Últimos Pagos Recibidos</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left relative">
                        <thead className="text-xs uppercase bg-white/[0.02] text-white/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-black tracking-widest">Cliente</th>
                                <th scope="col" className="px-6 py-4 font-black tracking-widest">Servicio</th>
                                <th scope="col" className="px-6 py-4 font-black tracking-widest">Fecha/Hora</th>
                                <th scope="col" className="px-6 py-4 font-black tracking-widest">Monto</th>
                                <th scope="col" className="px-6 py-4 font-black tracking-widest">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {finances.transactions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-white/40">
                                        No hay transacciones registradas.
                                    </td>
                                </tr>
                            )}
                            {finances.transactions.slice(0, 7).map((appo, i) => (
                                <tr key={appo.id || i} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 font-semibold text-white">{appo.clientName}</td>
                                    <td className="px-6 py-4 text-white/70">{appo.service}</td>
                                    <td className="px-6 py-4 text-white/50">{appo.date}</td>
                                    <td className="px-6 py-4 font-black text-mint">${appo.price.toLocaleString('es-AR')}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-mint/10 text-mint border border-mint/20">
                                            {appo.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
