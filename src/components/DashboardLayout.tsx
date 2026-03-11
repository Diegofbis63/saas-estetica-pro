"use client";

import { Sidebar } from "@/components/Sidebar";
import { useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { FloatingChat } from "@/components/FloatingChat";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { isSidebarOpen } = useUIStore();

    return (
        <div className="min-h-screen bg-background text-foreground flex overflow-hidden selection:bg-rose-500/30 selection:text-foreground">
            <Sidebar />
            <motion.main
                initial={false}
                animate={{
                    marginLeft: isSidebarOpen ? 256 : 80,
                    width: `calc(100% - ${isSidebarOpen ? 256 : 80}px)`
                }}
                className="flex-1 transition-all duration-500 min-h-screen overflow-y-auto"
            >
                <div className="max-w-[1600px] mx-auto p-6 md:p-12 lg:p-16">
                    {children}
                </div>
            </motion.main>
            <FloatingChat />
        </div>
    );
}

