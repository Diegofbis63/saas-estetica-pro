"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { X, Calendar, User, Scissors, Clock, Save } from "lucide-react";
import { format } from "date-fns";

interface AppointmentFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export function AppointmentForm({ onClose, onSuccess }: AppointmentFormProps) {
    const [loading, setLoading] = useState(false);
    const [clientes, setClientes] = useState<any[]>([]);
    const [servicios, setServicios] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        cliente_id: "",
        servicio_id: "",
        fecha_hora: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    async function fetchInitialData() {
        const [clientsRes, servicesRes] = await Promise.all([
            supabase.from('clientes').select('id, nombre'),
            supabase.from('servicios').select('id, nombre_servicio')
        ]);
        if (clientsRes.data) setClientes(clientsRes.data);
        if (servicesRes.data) setServicios(servicesRes.data);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: supabaseError } = await supabase
            .from('citas')
            .insert([formData]);

        if (supabaseError) {
            setError(supabaseError.message);
        } else {
            onSuccess();
            onClose();
        }
        setLoading(false);
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

            <Card className="relative w-full max-w-xl p-0 overflow-hidden shadow-2xl border-mint/20 animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <h2 className="text-xl font-black tracking-tight">Nueva Cita</h2>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Seleccionar Cliente</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <select
                                    required
                                    value={formData.cliente_id}
                                    onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-mint/50 transition-all font-medium appearance-none"
                                >
                                    <option value="" className="bg-background">Elegir cliente...</option>
                                    {clientes.map(c => <option key={c.id} value={c.id} className="bg-background">{c.nombre}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Seleccionar Servicio</label>
                            <div className="relative">
                                <Scissors className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <select
                                    required
                                    value={formData.servicio_id}
                                    onChange={(e) => setFormData({ ...formData, servicio_id: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-mint/50 transition-all font-medium appearance-none"
                                >
                                    <option value="" className="bg-background">Elegir tratamiento...</option>
                                    {servicios.map(s => <option key={s.id} value={s.id} className="bg-background">{s.nombre_servicio}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Fecha y Hora</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input
                                    required
                                    type="datetime-local"
                                    value={formData.fecha_hora}
                                    onChange={(e) => setFormData({ ...formData, fecha_hora: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-mint/50 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button variant="secondary" className="flex-1" type="button" onClick={onClose}>Cancelar</Button>
                        <Button className="flex-1" type="submit" disabled={loading}>
                            <Save className="w-5 h-5" />
                            {loading ? "Programando..." : "Confirmar Cita"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
