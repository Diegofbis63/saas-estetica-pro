"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar as CalendarIcon, User, Scissors, CheckCircle2, XCircle, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Cita {
    id: string;
    date: string;
    status: string;
    total_price: number;
    clients?: { name: string };
    services?: { name: string; price: number };
}

interface EditModalProps {
    cita: Cita;
    clientes: { id: string; name: string }[];
    servicios: { id: string; name: string; price: number }[];
    onClose: () => void;
    onSuccess: () => void;
}

function EditCitaModal({ cita, clientes, servicios, onClose, onSuccess }: EditModalProps) {
    const [form, setForm] = useState({
        status: cita.status,
        date: cita.date ? new Date(cita.date).toISOString().slice(0, 16) : '',
        client_id: '',
        service_id: '',
        total_price: cita.total_price,
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const payload: Record<string, unknown> = {
            status: form.status,
            date: new Date(form.date).toISOString(),
            total_price: form.total_price,
        };
        if (form.client_id) payload.client_id = form.client_id;
        if (form.service_id) payload.service_id = form.service_id;

        await supabase.from('appointments').update(payload).eq('id', cita.id);
        setSaving(false);
        onSuccess();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <Card className="w-full max-w-md mx-4 bg-white border border-black/5 shadow-xl">
                <h2 className="text-xl font-black mb-6 text-foreground">Editar Cita</h2>
                <p className="text-foreground/50 text-sm mb-4">
                    {cita.clients?.name} · {cita.services?.name}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-foreground/50 mb-2 block">Fecha y Hora</label>
                        <input type="datetime-local" value={form.date}
                            onChange={e => setForm({ ...form, date: e.target.value })}
                            className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-rose-400 focus:bg-rose-50/10 transition-all text-foreground shadow-sm" />
                    </div>
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-foreground/50 mb-2 block">Estado</label>
                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                            className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-rose-400 focus:bg-rose-50/10 transition-all text-foreground shadow-sm">
                            <option value="agendada">Agendada</option>
                            <option value="completado">Completada</option>
                            <option value="cancelado">Cancelada</option>
                            <option value="no-show">No show</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-foreground/50 mb-2 block">Cliente</label>
                        <select value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })}
                            className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-rose-400 focus:bg-rose-50/10 transition-all text-foreground shadow-sm">
                            <option value="">— Sin cambiar —</option>
                            {clientes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-foreground/50 mb-2 block">Servicio</label>
                        <select value={form.service_id} onChange={e => {
                            const srv = servicios.find(s => s.id === e.target.value);
                            setForm({ ...form, service_id: e.target.value, total_price: srv?.price || form.total_price });
                        }}
                            className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-rose-400 focus:bg-rose-50/10 transition-all text-foreground shadow-sm">
                            <option value="">— Sin cambiar —</option>
                            {servicios.map(s => <option key={s.id} value={s.id}>{s.name} — ${s.price?.toLocaleString('es-AR')}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-foreground/50 mb-2 block">Precio Total</label>
                        <input type="number" value={form.total_price}
                            onChange={e => setForm({ ...form, total_price: Number(e.target.value) })}
                            className="w-full bg-white border border-black/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-rose-400 focus:bg-rose-50/10 transition-all text-foreground shadow-sm" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" className="flex-1 bg-rose-500 hover:bg-rose-600 text-white" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'completado': return 'text-rose-600 bg-rose-50 border-rose-200';
        case 'cancelado': return 'text-red-600 bg-red-50 border-red-200';
        case 'no-show': return 'text-orange-600 bg-orange-50 border-orange-200';
        default: return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    }
};

export default function CitasPage() {
    const [citas, setCitas] = useState<Cita[]>([]);
    const [clientes, setClientes] = useState<{ id: string; name: string }[]>([]);
    const [servicios, setServicios] = useState<{ id: string; name: string; price: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCita, setEditingCita] = useState<Cita | null>(null);

    const fetchCitas = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                id, date, status, total_price,
                clients (name),
                services (name, price)
            `)
            .order('date', { ascending: false });

        if (error) console.error("Error cargando citas:", error);
        if (data) setCitas(data as unknown as Cita[]);
        setLoading(false);
    }, []);

    const fetchSelectData = useCallback(async () => {
        const [{ data: c }, { data: s }] = await Promise.all([
            supabase.from('clients').select('id, name').order('name'),
            supabase.from('services').select('id, name, price').order('name'),
        ]);
        if (c) setClientes(c);
        if (s) setServicios(s);
    }, []);

    useEffect(() => {
        fetchCitas();
        fetchSelectData();
    }, [fetchCitas, fetchSelectData]);

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase.from('appointments').update({ status: newStatus }).eq('id', id);
        if (!error) fetchCitas();
    };

    return (
        <div className="space-y-8">
            {editingCita && (
                <EditCitaModal
                    cita={editingCita}
                    clientes={clientes}
                    servicios={servicios}
                    onClose={() => setEditingCita(null)}
                    onSuccess={() => { fetchCitas(); setEditingCita(null); }}
                />
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Citas</h1>
                    <p className="text-foreground/50">Gestión de turnos y agenda.</p>
                </div>
                <Button onClick={fetchCitas} variant="outline" className="bg-white/80 hover:bg-white shadow-[0_4px_10px_rgba(0,0,0,0.03)] border-black/5">
                    <CalendarIcon className="w-5 h-5 text-rose-500" />
                    Actualizar
                </Button>
            </div>

            <div className="space-y-4">
                {loading ? (
                    [1, 2, 3].map(i => <Card key={i} className="animate-pulse h-24 bg-white border border-black/5 shadow-sm"> </Card>)
                ) : citas.length === 0 ? (
                    <Card className="py-20 text-center bg-white border border-black/5 shadow-sm">
                        <CalendarIcon className="w-12 h-12 text-foreground/10 mx-auto mb-4" />
                        <p className="text-foreground/40 font-bold">No hay citas programadas.</p>
                        <p className="text-foreground/30 text-xs mt-2">Pedile al Copilot que agende una cita.</p>
                    </Card>
                ) : (
                    citas.map((cita) => (
                        <Card key={cita.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-6 group bg-white border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-6">
                                {/* Date Badge */}
                                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/5 border border-black/5 min-w-[100px] group-hover:bg-rose-50/50 group-hover:border-rose-100 transition-all duration-500">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 group-hover:text-rose-500/60">
                                        {format(new Date(cita.date), "EEE", { locale: es })}
                                    </span>
                                    <span className="text-2xl font-black tracking-tighter text-foreground group-hover:text-rose-600">
                                        {format(new Date(cita.date), "HH:mm")}
                                    </span>
                                    <span className="text-[10px] font-black text-foreground/30 px-2 py-0.5 rounded-full bg-black/5 mt-1">
                                        {format(new Date(cita.date), "dd MMM", { locale: es })}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-rose-500" />
                                        <h3 className="font-bold text-lg tracking-tight text-foreground">
                                            {(cita.clients as { name: string })?.name || 'Cliente'}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-foreground/50 text-sm">
                                        <Scissors className="w-3.5 h-3.5" />
                                        <span className="font-medium">
                                            {(cita.services as { name: string; price: number })?.name || 'Servicio'}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-black/10" />
                                        <span className="text-rose-600 font-bold">
                                            ${cita.total_price?.toLocaleString('es-AR')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 ml-auto md:ml-0">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${getStatusColor(cita.status)}`}>
                                    {cita.status}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setEditingCita(cita)}
                                        className="p-2 rounded-xl hover:bg-indigo-50 text-foreground/30 hover:text-indigo-600 transition-all"
                                        title="Editar cita"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => updateStatus(cita.id, 'completado')}
                                        className="p-2 rounded-xl hover:bg-rose-50 text-foreground/30 hover:text-rose-600 transition-all"
                                        title="Marcar como completada"
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => updateStatus(cita.id, 'cancelado')}
                                        className="p-2 rounded-xl hover:bg-red-50 text-foreground/30 hover:text-red-500 transition-all"
                                        title="Cancelar cita"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
