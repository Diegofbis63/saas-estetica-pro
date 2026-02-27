"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { X, Scissors, DollarSign, Clock, Save } from "lucide-react";

interface ServiceFormProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

export function ServiceForm({ onClose, onSuccess, initialData }: ServiceFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre_servicio: initialData?.nombre_servicio || "",
        precio: initialData?.precio?.toString() || "",
        duracion_minutos: initialData?.duracion_minutos?.toString() || "30"
    });
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            nombre_servicio: formData.nombre_servicio,
            precio: parseFloat(formData.precio),
            duracion_minutos: parseInt(formData.duracion_minutos)
        };

        let supabaseError;

        if (initialData) {
            const { error: err } = await supabase
                .from('servicios')
                .update(payload)
                .eq('id', initialData.id);
            supabaseError = err;
        } else {
            const { error: err } = await supabase
                .from('servicios')
                .insert([payload]);
            supabaseError = err;
        }

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
                    <h2 className="text-xl font-black tracking-tight">{initialData ? "Editar Servicio" : "Nuevo Servicio"}</h2>
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
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Nombre del Servicio</label>
                            <div className="relative">
                                <Scissors className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input
                                    required
                                    type="text"
                                    value={formData.nombre_servicio}
                                    onChange={(e) => setFormData({ ...formData, nombre_servicio: e.target.value })}
                                    placeholder="Ej: Limpieza Facial Profunda"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-mint/50 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-white/40">Precio ($)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        value={formData.precio}
                                        onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                        placeholder="0.00"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-mint/50 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-white/40">Duración (Minutos)</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        required
                                        type="number"
                                        value={formData.duracion_minutos}
                                        onChange={(e) => setFormData({ ...formData, duracion_minutos: e.target.value })}
                                        placeholder="30"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-mint/50 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button variant="secondary" className="flex-1" type="button" onClick={onClose}>Cancelar</Button>
                        <Button className="flex-1" type="submit" disabled={loading}>
                            <Save className="w-5 h-5" />
                            {loading ? "Guardando..." : "Guardar Servicio"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
