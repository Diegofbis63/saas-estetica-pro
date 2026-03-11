"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card } from "@/components/ui/Card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar as CalendarIcon, DollarSign, TrendingUp, Loader2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────
type Period = 'hoy' | 'semana' | 'mes' | 'año' | 'custom';

interface RawAppo {
    id: string;
    date: string;
    status: string;
    total_price: number;
    client_id: string;
    service_id: string;
    clients: { name: string } | null;
    services: { name: string } | null;
}

interface Transaction {
    id: string;
    clientName: string;
    service: string;
    rawDate: Date;
    date: string;
    price: number;
    status: string;
    client_id: string;
    service_id: string;
}

interface FinancesState {
    totalRevenue: number;
    averageTicket: number;
    appointmentsCount: number;
    chartData: { displayDate: string; ingresos: number }[];
    transactions: Transaction[];
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditTransactionModal({
    tx,
    clientes,
    servicios,
    onClose,
    onSuccess,
}: {
    tx: Transaction;
    clientes: { id: string; name: string }[];
    servicios: { id: string; name: string; price: number }[];
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [form, setForm] = useState({
        status: tx.status,
        total_price: tx.price,
        client_id: tx.client_id ?? '',
        service_id: tx.service_id ?? '',
        date: tx.rawDate ? new Date(tx.rawDate).toISOString().slice(0, 16) : '',
    });
    const [saving, setSaving] = useState(false);

    const statusOptions = ['agendada', 'confirmada', 'completado', 'cancelado', 'no-show'];

    const statusColors: Record<string, string> = {
        completado: 'text-mint border-mint/30 bg-mint/10',
        cancelado: 'text-red-400 border-red-400/30 bg-red-400/10',
        'no-show': 'text-orange-400 border-orange-400/30 bg-orange-400/10',
        confirmada: 'text-indigo-400 border-indigo-400/30 bg-indigo-400/10',
        agendada: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const payload: Record<string, unknown> = {
            status: form.status,
            total_price: Number(form.total_price),
            date: new Date(form.date).toISOString(),
        };
        if (form.client_id) payload.client_id = form.client_id;
        if (form.service_id) payload.service_id = form.service_id;

        const { error } = await supabase.from('appointments').update(payload).eq('id', tx.id);
        setSaving(false);
        if (!error) onSuccess();
        else console.error("Error al actualizar:", error);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative w-full max-w-lg mx-4 bg-slate-950/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                {/* Gradient header */}
                <div className="bg-gradient-to-r from-mint/10 via-transparent to-indigo-500/10 border-b border-white/5 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black tracking-tight">Editar Transacción</h2>
                            <p className="text-white/40 text-sm mt-0.5">{tx.clientName} · {tx.service}</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Fecha y Hora</label>
                            <input type="datetime-local" value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-mint/50 transition-all text-white" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Monto ($)</label>
                            <input type="number" value={form.total_price}
                                onChange={e => setForm({ ...form, total_price: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-mint/50 transition-all text-white" />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Estado</label>
                        <div className="flex flex-wrap gap-2">
                            {statusOptions.map(s => (
                                <button type="button" key={s}
                                    onClick={() => setForm({ ...form, status: s })}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${form.status === s ? statusColors[s] || 'text-white border-white/30 bg-white/10' : 'text-white/30 border-white/10 bg-transparent hover:border-white/20'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Cliente</label>
                        <select value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-mint/50 transition-all text-white">
                            <option value="">— Sin cambiar —</option>
                            {clientes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Servicio</label>
                        <select value={form.service_id} onChange={e => {
                            const srv = servicios.find(s => s.id === e.target.value);
                            setForm({ ...form, service_id: e.target.value, total_price: srv?.price || form.total_price });
                        }}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-mint/50 transition-all text-white">
                            <option value="">— Sin cambiar —</option>
                            {servicios.map(s => <option key={s.id} value={s.id}>{s.name} — ${s.price?.toLocaleString('es-AR')}</option>)}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-2 border-t border-white/5">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-bold text-white/60 hover:bg-white/5 transition-all">
                            Cancelar
                        </button>
                        <button type="submit" disabled={saving}
                            className="flex-1 py-2.5 rounded-xl bg-mint text-slate-950 text-sm font-black tracking-tight hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Period helpers ───────────────────────────────────────────────────────────
function getDateRange(period: Period, customFrom?: string, customTo?: string): { from: Date; to: Date } {
    const now = new Date();
    if (period === 'custom' && customFrom && customTo) {
        return { from: new Date(customFrom + 'T00:00:00'), to: new Date(customTo + 'T23:59:59') };
    }
    const from = new Date(now);
    const to = new Date(now);
    to.setHours(23, 59, 59, 999);

    if (period === 'hoy') {
        from.setHours(0, 0, 0, 0);
    } else if (period === 'semana') {
        const day = now.getDay();
        from.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
        from.setHours(0, 0, 0, 0);
    } else if (period === 'mes') {
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
    } else if (period === 'año') {
        from.setMonth(0, 1);
        from.setHours(0, 0, 0, 0);
    }
    return { from, to };
}

function buildChartData(appos: RawAppo[], period: Period) {
    const daily: Record<string, number> = {};
    for (const a of appos) {
        const d = new Date(a.date);
        let key: string;
        if (period === 'hoy') {
            key = `${d.getHours()}:00`;
        } else if (period === 'año') {
            key = d.toLocaleDateString('es-AR', { month: 'short' });
        } else {
            key = d.toLocaleDateString('es-AR', { month: 'short', day: 'numeric' });
        }
        if (!daily[key]) daily[key] = 0;
        daily[key] += a.total_price || 0;
    }
    return Object.keys(daily).map(k => ({ displayDate: k, ingresos: daily[k] }));
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────
const PERIODS: { id: Period; label: string }[] = [
    { id: 'hoy', label: 'Hoy' },
    { id: 'semana', label: 'Semana' },
    { id: 'mes', label: 'Mes' },
    { id: 'año', label: 'Año' },
    { id: 'custom', label: 'Personalizado' },
];

const STATUS_COLORS: Record<string, string> = {
    completado: 'text-mint bg-mint/10 border-mint/20',
    cancelado: 'text-red-400 bg-red-400/10 border-red-400/20',
    'no-show': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    confirmada: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    agendada: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function IngresosPage() {
    const [mounted, setMounted] = useState(false);
    const [allAppos, setAllAppos] = useState<RawAppo[]>([]);
    const [clientes, setClientes] = useState<{ id: string; name: string }[]>([]);
    const [servicios, setServicios] = useState<{ id: string; name: string; price: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState<Period>('mes');
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');
    const [editingTx, setEditingTx] = useState<Transaction | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const [{ data: appos }, { data: cls }, { data: srvs }] = await Promise.all([
            supabase
                .from('appointments')
                .select('id, date, status, total_price, client_id, service_id, clients(name), services(name)')
                .order('date', { ascending: true }),
            supabase.from('clients').select('id, name').order('name'),
            supabase.from('services').select('id, name, price').order('name'),
        ]);
        if (appos) setAllAppos(appos as unknown as RawAppo[]);
        if (cls) setClientes(cls);
        if (srvs) setServicios(srvs);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        setMounted(true);
        fetchData();
        const handleRefresh = () => fetchData();
        window.addEventListener('dashboard-refresh', handleRefresh);
        return () => window.removeEventListener('dashboard-refresh', handleRefresh);
    }, [fetchData]);

    // Filter appointments by selected period
    const filteredAppos = useMemo(() => {
        if (period === 'custom' && (!customFrom || !customTo)) return allAppos;
        const { from, to } = getDateRange(period, customFrom, customTo);
        return allAppos.filter(a => {
            const d = new Date(a.date);
            return d >= from && d <= to;
        });
    }, [allAppos, period, customFrom, customTo]);

    // Compute finances from filtered data
    const finances = useMemo((): FinancesState => {
        let total = 0;
        const txs: Transaction[] = [];
        for (const a of filteredAppos) {
            total += a.total_price || 0;
            const d = new Date(a.date);
            txs.push({
                id: a.id,
                clientName: (a.clients as any)?.name || 'Cliente Genérico',
                service: (a.services as any)?.name || 'Servicio General',
                rawDate: d,
                date: d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
                price: a.total_price || 0,
                status: a.status,
                client_id: a.client_id,
                service_id: a.service_id,
            });
        }
        return {
            totalRevenue: total,
            averageTicket: txs.length > 0 ? total / txs.length : 0,
            appointmentsCount: txs.length,
            chartData: buildChartData(filteredAppos, period),
            transactions: txs.reverse(),
        };
    }, [filteredAppos, period]);

    const PERIOD_LABEL: Record<Period, string> = {
        hoy: 'Hoy',
        semana: 'Esta Semana',
        mes: 'Este Mes',
        año: 'Este Año',
        custom: customFrom && customTo ? `${customFrom} → ${customTo}` : 'Rango Libre',
    };

    if (!mounted) return null;

    return (
        <div className="space-y-10 animate-fade-in relative">
            {isLoading && (
                <div className="absolute inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                    <Loader2 className="w-8 h-8 text-mint animate-spin" />
                </div>
            )}

            {editingTx && (
                <EditTransactionModal
                    tx={editingTx}
                    clientes={clientes}
                    servicios={servicios}
                    onClose={() => setEditingTx(null)}
                    onSuccess={() => { fetchData(); setEditingTx(null); }}
                />
            )}

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-1">Ingresos y Finanzas</h1>
                    <p className="text-white/40 font-medium">Análisis de facturación en vivo · <span className="text-mint/70">{PERIOD_LABEL[period]}</span></p>
                </div>
                <Button variant="secondary" onClick={fetchData} className="h-fit self-start md:self-auto">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Recargar
                </Button>
            </div>

            {/* ── Filter Bar ── */}
            <Card className="p-4 bg-white/[0.02] border-white/5">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
                        {PERIODS.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setPeriod(p.id)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${period === p.id
                                    ? 'bg-mint text-slate-950 shadow-lg shadow-mint/20'
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {period === 'custom' && (
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl">
                                <CalendarIcon className="w-4 h-4 text-mint" />
                                <input
                                    type="date"
                                    value={customFrom}
                                    onChange={e => setCustomFrom(e.target.value)}
                                    className="bg-transparent text-sm font-medium text-white focus:outline-none w-36"
                                    placeholder="Desde"
                                />
                            </div>
                            <span className="text-white/20 font-bold">→</span>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl">
                                <CalendarIcon className="w-4 h-4 text-mint" />
                                <input
                                    type="date"
                                    value={customTo}
                                    onChange={e => setCustomTo(e.target.value)}
                                    className="bg-transparent text-sm font-medium text-white focus:outline-none w-36"
                                    placeholder="Hasta"
                                />
                            </div>
                        </div>
                    )}

                    <div className="ml-auto text-xs font-bold text-white/25 tracking-widest uppercase">
                        {finances.appointmentsCount} transacciones · ${finances.totalRevenue.toLocaleString('es-AR')}
                    </div>
                </div>
            </Card>

            {/* ── Quick Metrics ── */}
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
                        {PERIOD_LABEL[period]}
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
                <Card className="bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white/50">Citas en Período</h3>
                        <div className="p-2 rounded-lg bg-purple-500/10">
                            <CalendarIcon className="w-4 h-4 text-purple-400" />
                        </div>
                    </div>
                    <p className="text-4xl font-black tracking-tighter">{finances.appointmentsCount}</p>
                    <p className="text-xs text-purple-400 mt-2 font-bold">{PERIOD_LABEL[period]}</p>
                </Card>
            </div>

            {/* ── Chart ── */}
            <Card className="p-6 bg-white/[0.02] border border-white/5">
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-black tracking-tight">Evolución de Ingresos</h2>
                        <p className="text-sm text-white/40 font-medium">Facturación de servicios premium · {PERIOD_LABEL[period]}</p>
                    </div>
                </div>
                <div className="h-[360px] w-full">
                    {finances.chartData.length === 0 ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/30 text-sm">
                            <TrendingUp className="w-8 h-8 mb-4 opacity-50" />
                            Sin datos para el período seleccionado.
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
                                <XAxis dataKey="displayDate" stroke="#ffffff50" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#ffffff50" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                    labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
                                />
                                <Area type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" animationDuration={800} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Card>

            {/* ── Transactions Table ── */}
            <Card className="overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black tracking-tight">Últimos Pagos Recibidos</h2>
                        <p className="text-xs text-white/30 mt-0.5 font-medium">
                            {finances.transactions.length} registros · haz clic en ✏️ para editar
                        </p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] uppercase bg-white/[0.02] text-white/40">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-black tracking-widest">Cliente</th>
                                <th scope="col" className="px-6 py-4 font-black tracking-widest">Servicio</th>
                                <th scope="col" className="px-6 py-4 font-black tracking-widest">Fecha</th>
                                <th scope="col" className="px-6 py-4 font-black tracking-widest">Monto</th>
                                <th scope="col" className="px-6 py-4 font-black tracking-widest">Estado</th>
                                <th scope="col" className="px-6 py-4 font-black tracking-widest">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {finances.transactions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-white/30">
                                        Sin transacciones en el período seleccionado.
                                    </td>
                                </tr>
                            )}
                            {finances.transactions.map((appo, i) => (
                                <tr key={appo.id || i} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-mint/10 border border-mint/20 flex items-center justify-center text-mint font-black text-xs flex-shrink-0">
                                                {appo.clientName[0]?.toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-white">{appo.clientName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-white/60">{appo.service}</td>
                                    <td className="px-6 py-4 text-white/40 font-medium">{appo.date}</td>
                                    <td className="px-6 py-4">
                                        <span className="font-black text-mint text-base">${appo.price.toLocaleString('es-AR')}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${STATUS_COLORS[appo.status] || 'text-white/40 bg-white/5 border-white/10'}`}>
                                            {appo.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setEditingTx(appo)}
                                            className="p-2 rounded-xl hover:bg-mint/10 text-white/30 hover:text-mint transition-all"
                                            title="Editar transacción"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
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
