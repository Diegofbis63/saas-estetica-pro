"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Scissors, Trash2, Edit2 } from "lucide-react";

interface Servicio {
    id: string;
    name: string;
    price: number;
    duration: number;
}

export default function ServiciosPage() {
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchServicios = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('services')
            .select('id, name, price, duration')
            .order('name', { ascending: true });

        if (error) console.error("Error cargando servicios:", error);
        if (data) setServicios(data as Servicio[]);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchServicios();
    }, [fetchServicios]);

    const deleteServicio = async (id: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este servicio?")) return;

        const { error } = await supabase
            .from('services')
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
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Servicios</h1>
                    <p className="text-foreground/50">Gestioná tu catálogo de tratamientos.</p>
                </div>
                <Button onClick={fetchServicios} variant="outline" className="bg-white/80 hover:bg-white shadow-[0_4px_10px_rgba(0,0,0,0.03)] border-black/5">
                    <Plus className="w-5 h-5 mr-1 text-rose-500" />
                    Actualizar
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <Card key={i} className="animate-pulse h-40 bg-white border border-black/5 shadow-sm"> </Card>)
                ) : servicios.length === 0 ? (
                    <Card className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-white border border-black/5 shadow-sm">
                        <Scissors className="w-12 h-12 text-foreground/10 mx-auto mb-4" />
                        <p className="text-foreground/40 font-bold">No hay servicios registrados.</p>
                        <p className="text-foreground/30 text-xs mt-2">Pedile al Copilot que cree uno, ej: &quot;crea radiofrecuencia por 80000 pesos&quot;</p>
                    </Card>
                ) : (
                    servicios.map((servicio) => (
                        <Card key={servicio.id} className="group relative bg-white border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-rose-50 border border-rose-100/50">
                                    <Scissors className="w-5 h-5 text-rose-500" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        className="p-1.5 rounded-lg hover:bg-rose-50 text-foreground/30 hover:text-rose-500 transition-colors"
                                        title="Editar servicio"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteServicio(servicio.id)}
                                        className="p-1.5 rounded-lg hover:bg-red-50 text-foreground/30 hover:text-red-500 transition-colors"
                                        title="Eliminar servicio"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-black tracking-tight mb-1 text-foreground">{servicio.name}</h3>
                            <div className="flex items-center justify-between mt-6">
                                <span className="text-2xl font-black text-rose-600">
                                    ${servicio.price?.toLocaleString('es-AR')}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 bg-black/5 px-3 py-1 rounded-full border border-black/5">
                                    {servicio.duration ?? 60} min
                                </span>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
