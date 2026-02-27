"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Scissors, Trash2, Edit2 } from "lucide-react";
import { ServiceForm } from "@/components/ServiceForm";

interface Servicio {
    id: number;
    nombre_servicio: string;
    precio: number;
    duracion_minutos: number;
}

export default function ServiciosPage() {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);

    async function fetchServicios(showLoader = true) {
        if (showLoader) setLoading(true);
        const { data } = await supabase
            .from('servicios')
            .select('*')
            .order('nombre_servicio', { ascending: true });

        if (data) setServicios(data);
        setLoading(false);
    }

    useEffect(() => {
        // eslint-disable-next-line
        fetchServicios(false);
    }, []);

    const deleteServicio = async (id: number) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este servicio?")) return;

        const { error } = await supabase
            .from('servicios')
            .delete()
            .eq('id', id);

        if (!error) {
            fetchServicios();
        } else {
            console.error("Error deleting servicio:", error);
            alert("No se puede eliminar el servicio porque tiene citas asociadas.");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Servicios</h1>
                    <p className="text-white/40">Gestioná tu catálogo de tratamientos.</p>
                </div>
                <Button onClick={() => { setEditingServicio(null); setShowForm(true); }}>
                    <Plus className="w-5 h-5" />
                    Nuevo Servicio
                </Button>
            </div>

            {showForm && (
                <ServiceForm
                    initialData={editingServicio}
                    onClose={() => {
                        setShowForm(false);
                        setEditingServicio(null);
                    }}
                    onSuccess={() => {
                        fetchServicios();
                        setShowForm(false);
                        setEditingServicio(null);
                    }}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <Card key={i} className="animate-pulse h-40 bg-white/[0.01]"> </Card>)
                ) : servicios.length === 0 ? (
                    <Card className="col-span-full py-20 text-center">
                        <Scissors className="w-12 h-12 text-white/5 mx-auto mb-4" />
                        <p className="text-white/20 font-bold">No hay servicios registrados.</p>
                    </Card>
                ) : (
                    servicios.map((servicio) => (
                        <Card key={servicio.id} className="group relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-mint/5 border border-mint/10">
                                    <Scissors className="w-5 h-5 text-mint" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => {
                                            setEditingServicio(servicio);
                                            setShowForm(true);
                                        }}
                                        className="p-1.5 rounded-lg hover:bg-mint/10 text-white/20 hover:text-mint transition-colors"
                                        title="Editar servicio"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteServicio(servicio.id)}
                                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-colors"
                                        title="Eliminar servicio"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-black tracking-tight mb-1">{servicio.nombre_servicio}</h3>
                            <div className="flex items-center justify-between mt-6">
                                <span className="text-2xl font-black text-mint">${servicio.precio}</span>
                                <span className="text-xs font-black uppercase tracking-widest text-white/20 bg-white/5 px-3 py-1 rounded-full">
                                    {servicio.duracion_minutos} min
                                </span>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
