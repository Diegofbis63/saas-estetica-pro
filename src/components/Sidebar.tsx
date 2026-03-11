"use client";

import { useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
    Users,
    Calendar,
    Settings,
    LayoutDashboard,
    Scissors,
    Menu,
    ChevronLeft,
    LogOut,
    TrendingUp
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Ingresos', href: '/dashboard/ingresos', icon: TrendingUp },
    { name: 'Citas', href: '/dashboard/citas', icon: Calendar },
    { name: 'Clientes', href: '/dashboard/clientes', icon: Users },
    { name: 'Servicios', href: '/dashboard/servicios', icon: Scissors },
    { name: 'Configuración', href: '/dashboard/configuracion', icon: Settings },
];

export function Sidebar() {
    const { isSidebarOpen, toggleSidebar } = useUIStore();
    const pathname = usePathname();

    return (
        <motion.div
            initial={false}
            animate={{ width: isSidebarOpen ? 256 : 80 }}
            className={cn(
                "fixed left-0 top-0 h-full bg-[#0a0a0a]/80 backdrop-blur-2xl border-r border-white/5 transition-all duration-500 z-50 overflow-hidden",
                "before:absolute before:inset-y-0 before:right-0 before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-white/5 before:to-transparent"
            )}
        >
            <div className="flex flex-col h-full py-8 px-4 relative z-10">
                {/* Logo Section */}
                <div className="flex items-center gap-4 px-2 mb-12 overflow-hidden whitespace-nowrap">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mint to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(32,255,156,0.2)] shrink-0 group-hover:scale-110 transition-transform cursor-pointer">
                        <Scissors className="text-black w-6 h-6 stroke-[2.5px]" />
                    </div>
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-extrabold tracking-tight text-xl text-white"
                            >
                                ESTÉTICA<span className="text-mint text-glow">PRO</span>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 space-y-1.5">
                    {navigation.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block"
                            >
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(
                                        "group flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden",
                                        isActive
                                            ? "bg-white/5 text-mint"
                                            : "text-white/40 hover:text-white hover:bg-white/[0.03]"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-5 h-5 transition-all duration-300",
                                        isActive ? "stroke-[2.5px] text-mint drop-shadow-[0_0_8px_rgba(32,255,156,0.4)]" : "stroke-[1.5px]"
                                    )} />

                                    <AnimatePresence>
                                        {isSidebarOpen && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="font-medium text-[14px] truncate"
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>

                                    {/* Active Indicator bar */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-nav"
                                            className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-mint rounded-r-full shadow-mint"
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer & Toggle */}
                <div className="space-y-4 pt-6 mt-4 border-t border-white/5 relative">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="group flex items-center gap-4 p-3 rounded-xl w-full text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="font-medium text-sm truncate"
                                >
                                    Cerrar Sesión
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>

                    <button
                        onClick={toggleSidebar}
                        className="flex items-center justify-center p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all w-full group active:scale-95"
                    >
                        {isSidebarOpen ? (
                            <ChevronLeft className="w-5 h-5 text-white/40 group-hover:text-mint transition-all" />
                        ) : (
                            <Menu className="w-5 h-5 text-white/40 group-hover:text-mint transition-all" />
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

