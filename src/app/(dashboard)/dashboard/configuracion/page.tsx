"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, Bell, Shield, Wallet, Save } from "lucide-react";

export default function ConfiguracionPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert("Configuración guardada exitosamente");
        }, 1000);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight">Configuración</h1>
                <p className="text-white/40">Ajustes de cuenta, preferencias y facturación.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar Menu */}
                <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-mint border border-white/10 transition-colors">
                        <User className="w-5 h-5" />
                        <span className="font-bold">Perfil del Negocio</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="font-bold">Notificaciones</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors">
                        <Wallet className="w-5 h-5" />
                        <span className="font-bold">Facturación o Plan</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors">
                        <Shield className="w-5 h-5" />
                        <span className="font-bold">Seguridad</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="p-6 space-y-6">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight mb-1">Información del Negocio</h2>
                            <p className="text-sm text-white/40">Actualizá los datos públicos de tu centro de estética.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-white/60">Nombre del Negocio</label>
                                    <input
                                        type="text"
                                        defaultValue="Mi Estética Pro"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-mint/50 transition-all text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-white/60">Teléfono</label>
                                    <input
                                        type="tel"
                                        defaultValue="+54 11 1234-5678"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-mint/50 transition-all text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-white/60">Email de Contacto</label>
                                <input
                                    type="email"
                                    defaultValue="contacto@miestetica.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-mint/50 transition-all text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-white/60">Dirección</label>
                                <input
                                    type="text"
                                    defaultValue="Av. Libertador 1234, CABA"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-mint/50 transition-all text-white"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex justify-end">
                            <Button onClick={handleSave} disabled={isLoading}>
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Guardar Cambios
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card>

                    <Card className="p-6 space-y-6">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight mb-1">Horarios de Atención</h2>
                            <p className="text-sm text-white/40">Definí los días y horas en los que aceptás citas.</p>
                        </div>

                        <div className="space-y-4">
                            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(dia => (
                                <div key={dia} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                    <span className="font-medium">{dia}</span>
                                    <div className="flex items-center gap-2">
                                        <input type="time" defaultValue="09:00" className="bg-transparent border border-white/10 rounded px-2 py-1 text-sm text-white/60 outline-none" />
                                        <span className="text-white/40">-</span>
                                        <input type="time" defaultValue="18:00" className="bg-transparent border border-white/10 rounded px-2 py-1 text-sm text-white/60 outline-none" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
