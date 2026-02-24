"use client";

import { Sidebar } from "@/components/Sidebar";
import { useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { isSidebarOpen } = useUIStore();

    return (
        <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
            <Sidebar />
            <main
                className={cn(
                    "flex-1 transition-all duration-500 min-h-screen overflow-y-auto",
                    isSidebarOpen ? "ml-64" : "ml-20"
                )}
            >
                <div className="max-w-7xl mx-auto p-4 md:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
