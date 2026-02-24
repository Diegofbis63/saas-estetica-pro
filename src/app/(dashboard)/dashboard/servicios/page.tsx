"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Scissors, MoreHorizontal } from "lucide-react";
import { ServiceForm } from "@/components/ServiceForm";

export default function ServiciosPage() {
    const [servicios, setServicios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchServicios();
    }, []);

    async function fetchServicios() {
        setLoading(true);
        const { data, error } = await supabase
            .from('servicios')
            .select('*')
            .order('nombre_servicio', { ascending: true });

        if (data) setServicios(data);
        setLoading(false);
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Servicios</h1>
                    <p className="text-white/40">Gestioná tu catálogo de tratamientos.</p>
                </div>
                <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-5 h-5" />
                    Nuevo Servicio
                </Button>
            </div>

            {showForm && (
                <ServiceForm
                    onClose={() => setShowForm(false)}
                    onSuccess={() => {
                        fetchServicios();
                        setShowForm(false);
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
                                <button className="p-1 rounded hover:bg-white/5 transition-colors">
                                    <MoreHorizontal className="w-4 h-4 text-white/20" />
                                </button>
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
