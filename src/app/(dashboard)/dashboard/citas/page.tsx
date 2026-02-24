"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Calendar as CalendarIcon, Clock, User, Scissors, CheckCircle2, XCircle } from "lucide-react";
import { AppointmentForm } from "@/components/AppointmentForm";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function CitasPage() {
    const [citas, setCitas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchCitas();
    }, []);

    async function fetchCitas() {
        setLoading(true);
        const { data, error } = await supabase
            .from('citas')
            .select(`
        *,
        clientes (nombre, telefono),
        servicios (nombre_servicio, precio)
      `)
            .order('fecha_hora', { ascending: true });

        if (data) setCitas(data);
        setLoading(false);
    }

    const updateStatus = async (id: number, newStatus: string) => {
        const { error } = await supabase
            .from('citas')
            .update({ estado: newStatus })
            .eq('id', id);

        if (!error) {
            fetchCitas();
        } else {
            console.error("Error updating status:", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completado': return 'text-mint bg-mint/10 border-mint/20';
            case 'cancelado': return 'text-red-400 bg-red-400/10 border-red-400/20';
            case 'no-show': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            default: return 'text-white/40 bg-white/5 border-white/10';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Citas</h1>
                    <p className="text-white/40">Gestión de turnos y agenda.</p>
                </div>
                <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-5 h-5" />
                    Nueva Cita
                </Button>
            </div>

            {showForm && (
                <AppointmentForm
                    onClose={() => setShowForm(false)}
                    onSuccess={() => {
                        fetchCitas();
                        setShowForm(false);
                    }}
                />
            )}

            <div className="space-y-4">
                {loading ? (
                    [1, 2, 3].map(i => <Card key={i} className="animate-pulse h-24 bg-white/[0.01]"> </Card>)
                ) : citas.length === 0 ? (
                    <Card className="py-20 text-center">
                        <CalendarIcon className="w-12 h-12 text-white/5 mx-auto mb-4" />
                        <p className="text-white/20 font-bold">No hay citas programadas.</p>
                    </Card>
                ) : (
                    citas.map((cita) => (
                        <Card key={cita.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                            <div className="flex items-center gap-6">
                                {/* Date/Time Badge */}
                                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 min-w-[100px] group-hover:bg-mint/5 group-hover:border-mint/20 transition-all duration-500">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-mint/60">
                                        {format(new Date(cita.fecha_hora), "EEE", { locale: es })}
                                    </span>
                                    <span className="text-2xl font-black tracking-tighter">
                                        {format(new Date(cita.fecha_hora), "HH:mm")}
                                    </span>
                                    <span className="text-[10px] font-black text-white/20 px-2 py-0.5 rounded-full bg-white/5 mt-1">
                                        {format(new Date(cita.fecha_hora), "dd MMM", { locale: es })}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-mint" />
                                        <h3 className="font-bold text-lg tracking-tight">{cita.clientes?.nombre}</h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/40 text-sm">
                                        <Scissors className="w-3.5 h-3.5" />
                                        <span className="font-medium">{cita.servicios?.nombre_servicio}</span>
                                        <span className="w-1 h-1 rounded-full bg-white/10" />
                                        <span className="text-mint/60 font-bold">${cita.servicios?.precio}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 ml-auto md:ml-0">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${getStatusColor(cita.estado)}`}>
                                    {cita.estado}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateStatus(cita.id, 'completado')}
                                        className="p-2 rounded-xl hover:bg-mint/10 text-white/20 hover:text-mint transition-all"
                                        title="Marcar como completada"
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => updateStatus(cita.id, 'cancelado')}
                                        className="p-2 rounded-xl hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all"
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
