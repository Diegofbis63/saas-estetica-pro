"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, Bell, Shield, Wallet, Save } from "lucide-react";

export default function ConfiguracionPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('perfil');

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert("Configuración guardada exitosamente");
        }, 1000);
    };

    const tabs = [
        { id: 'perfil', label: 'Perfil del Negocio', icon: User },
        { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
        { id: 'facturacion', label: 'Facturación o Plan', icon: Wallet },
        { id: 'seguridad', label: 'Seguridad', icon: Shield },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight">Configuración</h1>
                <p className="text-white/40">Ajustes de cuenta, preferencias y facturación.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar Menu */}
                <div className="space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                        ? "bg-white/5 text-mint border border-white/10 font-bold"
                                        : "hover:bg-white/5 text-white/60 hover:text-white font-medium border border-transparent"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="md:col-span-2 space-y-6">
                    {activeTab === 'perfil' && (
                        <>
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
                        </>
                    )}

                    {activeTab === 'notificaciones' && (
                        <Card className="p-6 space-y-6">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight mb-1">Preferencias de Notificaciones</h2>
                                <p className="text-sm text-white/40">Elegí cómo y cuándo querés recibir alertas.</p>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { id: '1', title: 'Nuevas Citas', desc: 'Recibir un email cuando un cliente agende una nueva cita.', checked: true },
                                    { id: '2', title: 'Cancelaciones', desc: 'Alertas inmediatas si un cliente cancela su turno.', checked: true },
                                    { id: '3', title: 'Recordatorios Diarios', desc: 'Un resumen por la mañana con todas las citas del día.', checked: false },
                                    { id: '4', title: 'Promociones del Sistema', desc: 'Novedades y actualizaciones de SaaS Estética Pro.', checked: false },
                                ].map((notif) => (
                                    <div key={notif.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                        <div className="mt-1">
                                            <input type="checkbox" defaultChecked={notif.checked} className="w-4 h-4 accent-mint bg-white/10 border-white/20 rounded" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white/90">{notif.title}</h3>
                                            <p className="text-sm text-white/50">{notif.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4 border-t border-white/5 flex justify-end">
                                <Button onClick={handleSave} disabled={isLoading}>
                                    <Save className="w-4 h-4 mr-2" /> Guardar Preferencias
                                </Button>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'facturacion' && (
                        <Card className="p-6 space-y-6">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight mb-1">Facturación y Planes</h2>
                                <p className="text-sm text-white/40">Gestioná tu suscripción a SaaS Estética Pro.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-mint/10 to-transparent border border-mint/20 flex flex-col items-center text-center space-y-4">
                                <span className="px-3 py-1 bg-mint/20 text-mint text-xs font-black uppercase tracking-widest rounded-full">Plan Actual</span>
                                <h3 className="text-3xl font-black">Pro Business</h3>
                                <p className="text-white/60 max-w-sm">Tenés acceso ilimitado a todas las herramientas de gestión de clientes, servicios y calendario.</p>
                                <span className="text-xl font-bold">$29.99 / mes</span>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-white/80">Método de Pago</h3>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center font-black text-xs">VISA</div>
                                        <div>
                                            <p className="font-bold">Visa terminada en 4242</p>
                                            <p className="text-xs text-white/40">Expira en 12/26</p>
                                        </div>
                                    </div>
                                    <button className="text-sm font-bold text-mint hover:text-white transition-colors">Actualizar</button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex justify-end gap-4">
                                <Button variant="secondary">Ver Facturas</Button>
                                <Button onClick={() => alert('Administración de pagos en desarrollo.')}>Administrar Plan</Button>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'seguridad' && (
                        <Card className="p-6 space-y-6">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight mb-1">Seguridad de la Cuenta</h2>
                                <p className="text-sm text-white/40">Protegé tu acceso y gestioná tus contraseñas.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-white/60">Contraseña Actual</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-mint/50 transition-all text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-white/60">Nueva Contraseña</label>
                                        <input
                                            type="password"
                                            placeholder="Nueva contraseña"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-mint/50 transition-all text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-white/60">Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            placeholder="Repetir nueva contraseña"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-mint/50 transition-all text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 space-y-4">
                                <h3 className="font-bold text-white/80">Autenticación de Dos Factores (2FA)</h3>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                    <div>
                                        <p className="font-bold">Aplicación Autenticadora</p>
                                        <p className="text-sm text-white/40">Añade una capa extra de seguridad a tu cuenta.</p>
                                    </div>
                                    <button className="px-4 py-2 bg-white/10 text-white rounded-lg font-bold text-sm hover:bg-white/20 transition-colors">
                                        Activar
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex justify-end">
                                <Button onClick={handleSave} disabled={isLoading}>
                                    Actualizar Contraseña
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
