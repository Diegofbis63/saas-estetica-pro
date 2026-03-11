'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LogIn, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("admin@estetica.pro");
    const [password, setPassword] = useState("admin123");
    const [isLoading, setIsLoading] = useState(false);

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await signIn("credentials", {
            email,
            password,
            callbackUrl: "/dashboard"
        });
        setIsLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-rose-400/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-400/5 rounded-full blur-[100px] pointer-events-none" />

            <Card className="w-full max-w-md border-black/5 bg-white/70 p-8 backdrop-blur-xl relative z-10 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 shadow-sm flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-6 h-6 text-rose-500" />
                    </div>
                    <h1 className="mb-2 text-3xl font-black tracking-tight text-foreground">Bienvenido de nuevo</h1>
                    <p className="text-sm text-foreground/50">Iniciá sesión para gestionar tu centro estético</p>
                </div>

                <form onSubmit={handleCredentialsLogin} className="space-y-4 mb-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/50">Email de acceso</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/50 border border-black/10 rounded-xl py-3 pl-11 pr-4 text-sm text-foreground focus:outline-none focus:border-rose-400/50 focus:bg-white transition-all placeholder:text-foreground/30 shadow-sm"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/50">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/50 border border-black/10 rounded-xl py-3 pl-11 pr-4 text-sm text-foreground focus:outline-none focus:border-rose-400/50 focus:bg-white transition-all placeholder:text-foreground/30 shadow-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 text-sm font-bold bg-rose-500 text-white hover:bg-rose-400 shadow-md"
                    >
                        {isLoading ? "Iniciando sesión..." : "Ingresar a mi panel"}
                        {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-black/5" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
                        <span className="bg-[#faf7f5] px-4 text-foreground/30 rounded-full">O continuá con</span>
                    </div>
                </div>

                <Button
                    type="button"
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="w-full h-12 bg-white hover:bg-black/5 text-foreground border border-black/10 transition-colors shadow-sm"
                >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        <path fill="none" d="M1 1h22v22H1z" />
                    </svg>
                    Google
                </Button>

                <p className="mt-8 text-center text-xs text-foreground/30">
                    SaaS Estética Pro © {new Date().getFullYear()}
                </p>
            </Card>
        </div>
    );
}
