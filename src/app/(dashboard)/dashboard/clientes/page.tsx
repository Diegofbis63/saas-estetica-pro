"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Search, Trash2, Edit2, User, Mail, Phone } from "lucide-react";

interface Cliente {
    id: string;
    name: string;
    phone: string;
    email: string;
    created_at: string;
}

interface ClienteFormData {
    name: string;
    email: string;
    phone: string;
}

function ClienteModal({ cliente, onClose, onSuccess }: {
    cliente: Cliente | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [form, setForm] = useState<ClienteFormData>({
        name: cliente?.name || '',
        email: cliente?.email || '',
        phone: cliente?.phone || '',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        if (cliente) {
            await supabase.from('clients').update(form).eq('id', cliente.id);
        } else {
            await supabase.from('clients').insert([form]);
        }
        setSaving(false);
        onSuccess();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <Card className="w-full max-w-md mx-4">
                <h2 className="text-xl font-black mb-6">{cliente ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-white/40 mb-2 block">Nombre</label>
                        <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-mint/50 transition-all text-white" />
                    </div>
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-white/40 mb-2 block">Email</label>
                        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-mint/50 transition-all text-white" />
                    </div>
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-white/40 mb-2 block">Teléfono</label>
                        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-mint/50 transition-all text-white" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" className="flex-1" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export default function ClientesPage() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchClientes = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('clients')
            .select('id, name, email, phone, created_at')
            .order('name', { ascending: true });

        if (error) console.error("Error cargando clientes:", error);
        if (data) setClientes(data as Cliente[]);
        setLoading(false);
    }, []);

    useEffect(() => { fetchClientes(); }, [fetchClientes]);

    const deleteCliente = async (id: string) => {
        if (!confirm("¿Eliminar este cliente? Esta acción es irreversible.")) return;
        const { error } = await supabase.from('clients').delete().eq('id', id);
        if (!error) fetchClientes();
        else alert("No se puede eliminar: tiene citas asociadas.");
    };

    const filtered = clientes.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {showModal && (
                <ClienteModal
                    cliente={editingCliente}
                    onClose={() => { setShowModal(false); setEditingCliente(null); }}
                    onSuccess={() => { fetchClientes(); setShowModal(false); setEditingCliente(null); }}
                />
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Clientes</h1>
                    <p className="text-white/40">Gestioná tu base de datos de pacientes.</p>
                </div>
                <Button onClick={() => { setEditingCliente(null); setShowModal(true); }}>
                    <Plus className="w-5 h-5" />
                    Nuevo Cliente
                </Button>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, teléfono o email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-mint/50 transition-all text-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-white/20">
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4"><Phone className="w-3 h-3 inline mr-1" />Teléfono</th>
                                <th className="px-6 py-4"><Mail className="w-3 h-3 inline mr-1" />Email</th>
                                <th className="px-6 py-4">Registrado</th>
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
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <User className="w-12 h-12 text-white/5 mx-auto mb-4" />
                                        <p className="text-white/20 font-bold">No se encontraron clientes.</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(cliente => (
                                    <tr key={cliente.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-mint/10 border border-mint/20 flex items-center justify-center text-mint font-bold text-xs">
                                                    {cliente.name?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <span className="font-bold text-sm tracking-tight">{cliente.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white/60">{cliente.phone || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-white/60">{cliente.email || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-white/40">
                                            {new Date(cliente.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => { setEditingCliente(cliente); setShowModal(true); }}
                                                    className="p-2 rounded-lg hover:bg-mint/10 text-white/20 hover:text-mint transition-colors"
                                                    title="Editar cliente"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteCliente(cliente.id)}
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-colors"
                                                    title="Eliminar cliente"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
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
