"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Search, MoreHorizontal, User } from "lucide-react";
import { ClientForm } from "@/components/ClientForm";

export default function ClientesPage() {
    const [clientes, setClientes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchClientes();
    }, []);

    async function fetchClientes() {
        setLoading(true);
        const { data, error } = await supabase
            .from('clientes')
            .select('*')
            .order('nombre', { ascending: true });

        if (data) setClientes(data);
        setLoading(false);
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Clientes</h1>
                    <p className="text-white/40">Gestioná tu base de datos de pacientes.</p>
                </div>
                <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-5 h-5" />
                    Nuevo Cliente
                </Button>
            </div>

            {showForm && (
                <ClientForm
                    onClose={() => setShowForm(false)}
                    onSuccess={() => {
                        fetchClientes();
                        setShowForm(false);
                    }}
                />
            )}

            <Card className="p-0 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="Buscar cliente por nombre o teléfono..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-mint/50 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-white/20">
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Teléfono</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Última Cita</th>
                                <th className="px-6 py-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-8 bg-white/[0.01]" />
                                    </tr>
                                ))
                            ) : clientes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <User className="w-12 h-12 text-white/5 mx-auto mb-4" />
                                        <p className="text-white/20 font-bold">No hay clientes registrados aún.</p>
                                    </td>
                                </tr>
                            ) : (
                                clientes.map((cliente) => (
                                    <tr key={cliente.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-mint/10 border border-mint/20 flex items-center justify-center text-mint font-bold text-xs">
                                                    {cliente.nombre[0]}
                                                </div>
                                                <span className="font-bold text-sm tracking-tight">{cliente.nombre}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white/60">{cliente.telefono}</td>
                                        <td className="px-6 py-4 text-sm text-white/60">{cliente.email || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-white/40">Sin registros</td>
                                        <td className="px-6 py-4">
                                            <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                                                <MoreHorizontal className="w-5 h-5 text-white/20" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
