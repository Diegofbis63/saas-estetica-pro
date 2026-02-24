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
    LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Citas', href: '/dashboard/citas', icon: Calendar },
    { name: 'Clientes', href: '/dashboard/clientes', icon: Users },
    { name: 'Servicios', href: '/dashboard/servicios', icon: Scissors },
    { name: 'Configuración', href: '/dashboard/configuracion', icon: Settings },
];

export function Sidebar() {
    const { isSidebarOpen, toggleSidebar } = useUIStore();
    const pathname = usePathname();

    return (
        <div
            className={cn(
                "fixed left-0 top-0 h-full glass border-r border-white/5 transition-all duration-500 z-50",
                isSidebarOpen ? "w-64" : "w-20"
            )}
        >
            <div className="flex flex-col h-full py-6 px-4">
                {/* Logo Section */}
                <div className="flex items-center gap-3 px-2 mb-10 overflow-hidden whitespace-nowrap">
                    <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center shadow-mint shrink-0">
                        <Scissors className="text-background w-6 h-6 stroke-[2.5px]" />
                    </div>
                    <span className={cn(
                        "font-black tracking-tighter text-xl transition-all duration-500",
                        !isSidebarOpen && "opacity-0 translate-x-4 pointer-events-none"
                    )}>
                        ESTÉTICA<span className="text-mint">PRO</span>
                    </span>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden",
                                    isActive
                                        ? "bg-mint/10 text-mint"
                                        : "text-white/50 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-6 h-6 transition-all duration-300",
                                    isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"
                                )} />
                                <span className={cn(
                                    "font-semibold text-sm transition-all duration-500 truncate",
                                    !isSidebarOpen && "opacity-0 translate-x-4 pointer-events-none"
                                )}>
                                    {item.name}
                                </span>

                                {/* Active Indicator Bar */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-mint rounded-r-full shadow-mint" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer & Toggle */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-4 p-3 rounded-xl w-full text-white/50 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <LogOut className="w-6 h-6" />
                        <span className={cn(
                            "font-semibold text-sm transition-all duration-500",
                            !isSidebarOpen && "opacity-0 translate-x-4 pointer-events-none"
                        )}>
                            Cerrar Sesión
                        </span>
                    </button>

                    <button
                        onClick={toggleSidebar}
                        className="flex items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all w-full group"
                    >
                        {isSidebarOpen ? (
                            <ChevronLeft className="w-6 h-6 text-mint transition-transform group-hover:-translate-x-1" />
                        ) : (
                            <Menu className="w-6 h-6 text-mint transition-transform group-hover:scale-110" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
