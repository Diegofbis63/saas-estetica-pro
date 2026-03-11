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
        completado: 'text-rose-600 border-rose-500/30 bg-rose-50',
        cancelado: 'text-red-600 border-red-500/30 bg-red-50',
        'no-show': 'text-orange-600 border-orange-500/30 bg-orange-50',
        confirmada: 'text-indigo-600 border-indigo-500/30 bg-indigo-50',
        agendada: 'text-blue-600 border-blue-500/30 bg-blue-50',
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative w-full max-w-lg mx-4 bg-white/95 border border-black/5 rounded-3xl shadow-2xl overflow-hidden">
                {/* Gradient header */}
                <div className="bg-gradient-to-r from-rose-50 via-transparent to-rose-100 border-b border-black/5 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black tracking-tight text-foreground">Editar Transacción</h2>
                            <p className="text-foreground/50 text-sm mt-0.5">{tx.clientName} · {tx.service}</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-black/5 text-foreground/40 hover:text-foreground transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 mb-2 block">Fecha y Hora</label>
                            <input type="datetime-local" value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })}
                                className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-rose-400 focus:bg-rose-50/10 transition-all text-foreground shadow-sm" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 mb-2 block">Monto ($)</label>
                            <input type="number" value={form.total_price}
                                onChange={e => setForm({ ...form, total_price: Number(e.target.value) })}
                                className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-rose-400 focus:bg-rose-50/10 transition-all text-foreground shadow-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 mb-2 block">Estado</label>
                        <div className="flex flex-wrap gap-2">
                            {statusOptions.map(s => (
                                <button type="button" key={s}
                                    onClick={() => setForm({ ...form, status: s })}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${form.status === s ? statusColors[s] || 'text-foreground border-black/30 bg-black/5' : 'text-foreground/50 border-black/10 bg-transparent hover:border-black/20'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 mb-2 block">Cliente</label>
                        <select value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })}
                            className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-rose-400 focus:bg-rose-50/10 transition-all text-foreground shadow-sm">
                            <option value="">— Sin cambiar —</option>
                            {clientes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/50 mb-2 block">Servicio</label>
                        <select value={form.service_id} onChange={e => {
                            const srv = servicios.find(s => s.id === e.target.value);
                            setForm({ ...form, service_id: e.target.value, total_price: srv?.price || form.total_price });
                        }}
                            className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-rose-400 focus:bg-rose-50/10 transition-all text-foreground shadow-sm">
                            <option value="">— Sin cambiar —</option>
                            {servicios.map(s => <option key={s.id} value={s.id}>{s.name} — ${s.price?.toLocaleString('es-AR')}</option>)}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-2 border-t border-black/5">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-black/10 text-sm font-bold text-foreground/60 hover:bg-black/5 transition-all">
                            Cancelar
                        </button>
                        <button type="submit" disabled={saving}
                            className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-black tracking-tight hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-md shadow-rose-500/20">
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
    completado: 'text-rose-600 bg-rose-50 border-rose-200',
    cancelado: 'text-red-500 bg-red-50 border-red-200',
    'no-show': 'text-orange-500 bg-orange-50 border-orange-200',
    confirmada: 'text-indigo-500 bg-indigo-50 border-indigo-200',
    agendada: 'text-blue-500 bg-blue-50 border-blue-200',
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
                <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                    <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
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
                    <h1 className="text-4xl font-black tracking-tight mb-1 text-foreground">Ingresos y Finanzas</h1>
                    <p className="text-foreground/50 font-medium">Análisis de facturación en vivo · <span className="text-rose-600 font-bold">{PERIOD_LABEL[period]}</span></p>
                </div>
                <Button variant="secondary" onClick={fetchData} className="h-fit self-start md:self-auto bg-white/80 hover:bg-white shadow-sm border border-black/5">
                    <TrendingUp className="w-4 h-4 mr-2 text-rose-500" />
                    Recargar
                </Button>
            </div>

            {/* ── Filter Bar ── */}
            <Card className="p-4 bg-white/70 border-black/5 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 bg-black/5 rounded-xl p-1">
                        {PERIODS.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setPeriod(p.id)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${period === p.id
                                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                                    : 'text-foreground/50 hover:text-foreground hover:bg-black/5'
                                    }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {period === 'custom' && (
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-black/10 rounded-xl shadow-sm">
                                <CalendarIcon className="w-4 h-4 text-rose-500" />
                                <input
                                    type="date"
                                    value={customFrom}
                                    onChange={e => setCustomFrom(e.target.value)}
                                    className="bg-transparent text-sm font-medium text-foreground focus:outline-none w-36"
                                    placeholder="Desde"
                                />
                            </div>
                            <span className="text-foreground/30 font-bold">→</span>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-black/10 rounded-xl shadow-sm">
                                <CalendarIcon className="w-4 h-4 text-rose-500" />
                                <input
                                    type="date"
                                    value={customTo}
                                    onChange={e => setCustomTo(e.target.value)}
                                    className="bg-transparent text-sm font-medium text-foreground focus:outline-none w-36"
                                    placeholder="Hasta"
                                />
                            </div>
                        </div>
                    )}

                    <div className="ml-auto text-xs font-bold text-foreground/40 tracking-widest uppercase">
                        {finances.appointmentsCount} transacciones · ${finances.totalRevenue.toLocaleString('es-AR')}
                    </div>
                </div>
            </Card>

            {/* ── Quick Metrics ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white/70 border-black/5 hover:bg-white shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground/50">Facturación Total</h3>
                        <div className="p-2 rounded-lg bg-rose-50 border border-rose-100">
                            <DollarSign className="w-4 h-4 text-rose-600" />
                        </div>
                    </div>
                    <p className="text-4xl font-black tracking-tighter text-foreground">${finances.totalRevenue.toLocaleString('es-AR')}</p>
                    <p className="text-xs text-rose-600 mt-2 font-bold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {PERIOD_LABEL[period]}
                    </p>
                </Card>
                <Card className="bg-white/70 border-black/5 hover:bg-white shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground/50">Ticket Promedio</h3>
                        <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100">
                            <TrendingUp className="w-4 h-4 text-indigo-500" />
                        </div>
                    </div>
                    <p className="text-4xl font-black tracking-tighter text-foreground">${Math.round(finances.averageTicket).toLocaleString('es-AR')}</p>
                    <p className="text-xs text-indigo-500 mt-2 font-bold">Por servicio realizado</p>
                </Card>
                <Card className="bg-white/70 border-black/5 hover:bg-white shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground/50">Citas en Período</h3>
                        <div className="p-2 rounded-lg bg-purple-50 border border-purple-100">
                            <CalendarIcon className="w-4 h-4 text-purple-500" />
                        </div>
                    </div>
                    <p className="text-4xl font-black tracking-tighter text-foreground">{finances.appointmentsCount}</p>
                    <p className="text-xs text-purple-500 mt-2 font-bold">{PERIOD_LABEL[period]}</p>
                </Card>
            </div>

            {/* ── Chart ── */}
            <Card className="p-6 bg-white/70 border border-black/5 shadow-sm">
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-foreground">Evolución de Ingresos</h2>
                        <p className="text-sm text-foreground/50 font-medium">Facturación de servicios premium · {PERIOD_LABEL[period]}</p>
                    </div>
                </div>
                <div className="h-[360px] w-full">
                    {finances.chartData.length === 0 ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-foreground/30 text-sm">
                            <TrendingUp className="w-8 h-8 mb-4 opacity-50" />
                            Sin datos para el período seleccionado.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={finances.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
                                <XAxis dataKey="displayDate" stroke="#00000050" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#00000050" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}
                                    itemStyle={{ color: '#f43f5e', fontWeight: 'bold' }}
                                    labelStyle={{ color: 'rgba(0,0,0,0.5)', marginBottom: '4px' }}
                                />
                                <Area type="monotone" dataKey="ingresos" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" animationDuration={800} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Card>

            {/* ── Transactions Table ── */}
            <Card className="overflow-hidden bg-white/70 shadow-sm border-black/5">
                <div className="p-6 border-b border-black/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-foreground">Últimos Pagos Recibidos</h2>
                        <p className="text-xs text-foreground/40 mt-0.5 font-medium">
                            {finances.transactions.length} registros · haz clic en ✏️ para editar
                        </p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] uppercase bg-black/[0.02] text-foreground/40 border-b border-black/5">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-black tracking-widest">Cliente</th>
                                <th scope="col" className="px-6 py-4 font-black tracking-widest">Servicio</th>
                                <th scope="col" className="px-6 py-4 font-black tracking-widest">Fecha</th>
                                <th scope="col" className="px-6 py-4 font-black tracking-widest">Monto</th>
                                <th scope="col" className="px-6 py-4 font-black tracking-widest">Estado</th>
                                <th scope="col" className="px-6 py-4 font-black tracking-widest text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {finances.transactions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-foreground/30">
                                        Sin transacciones en el período seleccionado.
                                    </td>
                                </tr>
                            )}
                            {finances.transactions.map((appo, i) => (
                                <tr key={appo.id || i} className="hover:bg-black/[0.02] bg-white transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 font-black text-xs flex-shrink-0">
                                                {appo.clientName[0]?.toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-foreground">{appo.clientName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-foreground/60">{appo.service}</td>
                                    <td className="px-6 py-4 text-foreground/40 font-medium">{appo.date}</td>
                                    <td className="px-6 py-4">
                                        <span className="font-black text-foreground text-base">${appo.price.toLocaleString('es-AR')}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${STATUS_COLORS[appo.status] || 'text-foreground/40 bg-black/5 border-black/10'}`}>
                                            {appo.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setEditingTx(appo)}
                                            className="p-2 rounded-xl hover:bg-rose-50 text-foreground/30 hover:text-rose-500 transition-all ml-auto block"
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
