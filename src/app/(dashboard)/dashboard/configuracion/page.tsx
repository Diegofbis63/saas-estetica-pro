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
                <h1 className="text-3xl font-black tracking-tight text-foreground">Configuración</h1>
                <p className="text-foreground/50">Ajustes de cuenta, preferencias y facturación.</p>
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
                                    ? "bg-rose-50 text-rose-600 border border-rose-100 font-bold"
                                    : "hover:bg-black/5 text-foreground/60 hover:text-foreground font-medium border border-transparent"
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
                            <Card className="p-6 space-y-6 bg-white border border-black/5 shadow-sm">
                                <div>
                                    <h2 className="text-xl font-bold tracking-tight mb-1 text-foreground">Información del Negocio</h2>
                                    <p className="text-sm text-foreground/50">Actualizá los datos públicos de tu centro de estética.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-foreground/60">Nombre del Negocio</label>
                                            <input
                                                type="text"
                                                defaultValue="Mi Estética Pro"
                                                className="w-full bg-white border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 focus:bg-rose-50/10 transition-all text-foreground shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-foreground/60">Teléfono</label>
                                            <input
                                                type="tel"
                                                defaultValue="+54 11 1234-5678"
                                                className="w-full bg-white border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 focus:bg-rose-50/10 transition-all text-foreground shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-foreground/60">Email de Contacto</label>
                                        <input
                                            type="email"
                                            defaultValue="contacto@miestetica.com"
                                            className="w-full bg-white border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 focus:bg-rose-50/10 transition-all text-foreground shadow-sm"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-foreground/60">Dirección</label>
                                        <input
                                            type="text"
                                            defaultValue="Av. Libertador 1234, CABA"
                                            className="w-full bg-white border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 focus:bg-rose-50/10 transition-all text-foreground shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-black/5 flex justify-end">
                                    <Button onClick={handleSave} disabled={isLoading} className="bg-rose-500 hover:bg-rose-600 text-white shadow-md">
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Guardar Cambios
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Card>

                            <Card className="p-6 space-y-6 bg-white border border-black/5 shadow-sm">
                                <div>
                                    <h2 className="text-xl font-bold tracking-tight mb-1 text-foreground">Horarios de Atención</h2>
                                    <p className="text-sm text-foreground/50">Definí los días y horas en los que aceptás citas.</p>
                                </div>

                                <div className="space-y-4">
                                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map(dia => (
                                        <div key={dia} className="flex items-center justify-between p-3 rounded-xl bg-black/[0.02] border border-black/5">
                                            <span className="font-medium text-foreground">{dia}</span>
                                            <div className="flex items-center gap-2">
                                                <input type="time" defaultValue="09:00" className="bg-transparent border border-black/10 rounded px-2 py-1 text-sm text-foreground/60 outline-none focus:border-rose-400 bg-white" />
                                                <span className="text-foreground/40">-</span>
                                                <input type="time" defaultValue="18:00" className="bg-transparent border border-black/10 rounded px-2 py-1 text-sm text-foreground/60 outline-none focus:border-rose-400 bg-white" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </>
                    )}

                    {activeTab === 'notificaciones' && (
                        <Card className="p-6 space-y-6 bg-white border border-black/5 shadow-sm">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight mb-1 text-foreground">Preferencias de Notificaciones</h2>
                                <p className="text-sm text-foreground/50">Elegí cómo y cuándo querés recibir alertas.</p>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { id: '1', title: 'Nuevas Citas', desc: 'Recibir un email cuando un cliente agende una nueva cita.', checked: true },
                                    { id: '2', title: 'Cancelaciones', desc: 'Alertas inmediatas si un cliente cancela su turno.', checked: true },
                                    { id: '3', title: 'Recordatorios Diarios', desc: 'Un resumen por la mañana con todas las citas del día.', checked: false },
                                    { id: '4', title: 'Promociones del Sistema', desc: 'Novedades y actualizaciones de SaaS Estética Pro.', checked: false },
                                ].map((notif) => (
                                    <div key={notif.id} className="flex items-start gap-4 p-4 rounded-xl bg-black/[0.02] border border-black/5">
                                        <div className="mt-1">
                                            <input type="checkbox" defaultChecked={notif.checked} className="w-4 h-4 accent-rose-500 bg-white border-black/20 rounded shadow-sm" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground/90">{notif.title}</h3>
                                            <p className="text-sm text-foreground/50">{notif.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4 border-t border-black/5 flex justify-end">
                                <Button onClick={handleSave} disabled={isLoading} className="bg-rose-500 hover:bg-rose-600 text-white shadow-md">
                                    <Save className="w-4 h-4 mr-2" /> Guardar Preferencias
                                </Button>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'facturacion' && (
                        <Card className="p-6 space-y-6 bg-white border border-black/5 shadow-sm">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight mb-1 text-foreground">Facturación y Planes</h2>
                                <p className="text-sm text-foreground/50">Gestioná tu suscripción a SaaS Estética Pro.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-50/80 to-transparent border border-rose-100 flex flex-col items-center text-center space-y-4">
                                <span className="px-3 py-1 bg-rose-100/50 text-rose-600 text-xs font-black uppercase tracking-widest rounded-full border border-rose-200/50">Plan Actual</span>
                                <h3 className="text-3xl font-black text-foreground">Pro Business</h3>
                                <p className="text-foreground/60 max-w-sm">Tenés acceso ilimitado a todas las herramientas de gestión de clientes, servicios y calendario.</p>
                                <span className="text-xl font-bold text-foreground">$29.99 / mes</span>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-foreground/80">Método de Pago</h3>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-black/[0.02] border border-black/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-8 bg-black/5 rounded flex items-center justify-center font-black text-xs text-foreground/60 border border-black/10">VISA</div>
                                        <div>
                                            <p className="font-bold text-foreground">Visa terminada en 4242</p>
                                            <p className="text-xs text-foreground/40">Expira en 12/26</p>
                                        </div>
                                    </div>
                                    <button className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors">Actualizar</button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-black/5 flex justify-end gap-4">
                                <Button variant="outline" className="border-black/10 bg-white">Ver Facturas</Button>
                                <Button onClick={() => alert('Administración de pagos en desarrollo.')} className="bg-rose-500 hover:bg-rose-600 text-white shadow-md">Administrar Plan</Button>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'seguridad' && (
                        <Card className="p-6 space-y-6 bg-white border border-black/5 shadow-sm">
                            <div>
                                <h2 className="text-xl font-bold tracking-tight mb-1 text-foreground">Seguridad de la Cuenta</h2>
                                <p className="text-sm text-foreground/50">Protegé tu acceso y gestioná tus contraseñas.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground/60">Contraseña Actual</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-white border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 focus:bg-rose-50/10 transition-all text-foreground shadow-sm placeholder:text-foreground/30"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-foreground/60">Nueva Contraseña</label>
                                        <input
                                            type="password"
                                            placeholder="Nueva contraseña"
                                            className="w-full bg-white border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 focus:bg-rose-50/10 transition-all text-foreground shadow-sm placeholder:text-foreground/30"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-foreground/60">Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            placeholder="Repetir nueva contraseña"
                                            className="w-full bg-white border border-black/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 focus:bg-rose-50/10 transition-all text-foreground shadow-sm placeholder:text-foreground/30"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-black/5 space-y-4">
                                <h3 className="font-bold text-foreground/80">Autenticación de Dos Factores (2FA)</h3>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-black/[0.02] border border-black/5">
                                    <div>
                                        <p className="font-bold text-foreground">Aplicación Autenticadora</p>
                                        <p className="text-sm text-foreground/50">Añade una capa extra de seguridad a tu cuenta.</p>
                                    </div>
                                    <button className="px-4 py-2 bg-black/5 text-foreground rounded-lg font-bold text-sm hover:bg-black/10 transition-colors border border-black/5">
                                        Activar
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-black/5 flex justify-end">
                                <Button onClick={handleSave} disabled={isLoading} className="bg-rose-500 hover:bg-rose-600 text-white shadow-md">
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
