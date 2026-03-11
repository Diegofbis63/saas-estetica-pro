"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
    return (
        <div className={cn(
            "glass rounded-2xl p-6 transition-all duration-300",
            hover && "glass-hover shadow-md hover:shadow-xl hover:shadow-rose-500/10 hover:-translate-y-1",
            className
        )}>
            {children}
        </div>
    );
}
