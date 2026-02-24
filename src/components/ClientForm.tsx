"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { X, User, Phone, Mail, Save } from "lucide-react";

interface ClientFormProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any;
}

export function ClientForm({ onClose, onSuccess, initialData }: ClientFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: initialData?.nombre || "",
        telefono: initialData?.telefono || "",
        email: initialData?.email || "",
        notas_medicas: initialData?.notas_medicas || ""
    });
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.telefono.length < 8) {
            setError("El teléfono debe tener al menos 8 caracteres.");
            setLoading(false);
            return;
        }

        let supabaseError;

        if (initialData) {
            const { error: err } = await supabase
                .from('clientes')
                .update(formData)
                .eq('id', initialData.id);
            supabaseError = err;
        } else {
            const { error: err } = await supabase
                .from('clientes')
                .insert([formData]);
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
                    <h2 className="text-xl font-black tracking-tight">{initialData ? "Editar Cliente" : "Nuevo Cliente"}</h2>
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
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Nombre Completo</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input
                                    required
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    placeholder="Ej: Martina Rodríguez"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-mint/50 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-white/40">Teléfono (Requerido)</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        required
                                        type="tel"
                                        value={formData.telefono}
                                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                        placeholder="Ej: 11 1234 5678"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-mint/50 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-white/40">Email (Opcional)</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="martina@email.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-mint/50 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Notas Médicas / Historial</label>
                            <textarea
                                rows={4}
                                value={formData.notas_medicas}
                                onChange={(e) => setFormData({ ...formData, notas_medicas: e.target.value })}
                                placeholder="Alergias, tratamientos previos, etc..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-mint/50 transition-all font-medium resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button variant="secondary" className="flex-1" type="button" onClick={onClose}>Cancelar</Button>
                        <Button className="flex-1" type="submit" disabled={loading}>
                            <Save className="w-5 h-5" />
                            {loading ? "Guardando..." : "Guardar Cliente"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
