"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

type Message = {
    role: "user" | "model";
    content: string;
};

export function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "model", content: "¡Hola! Soy la IA nativa de Estética Pro. ¿En qué puedo ayudarte a optimizar tu clínica hoy?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: "user", content: userMessage }]
                }),
            });

            if (!response.ok) throw new Error('Error en la respuesta de la IA');

            const data = await response.json();
            setMessages(prev => [...prev, { role: data.role, content: data.content }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: "model", content: "Lo siento, tuve un problema procesando tu solicitud. Por favor intenta de nuevo." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="mb-4 w-[380px] h-[550px] max-h-[calc(100vh-120px)] sm:w-[400px] liquid-glass rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-white">Estética Pro Copilot</h3>
                                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-black">Powered by Gemini</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-white/70" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={i}
                                    className={cn(
                                        "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                                        msg.role === "user"
                                            ? "bg-indigo-500 tracking-tight text-white ml-auto rounded-tr-sm"
                                            : "bg-white/5 border border-white/5 text-white/90 mr-auto rounded-tl-sm"
                                    )}
                                >
                                    {/* Handle basic markdown-like bold text **text** from Gemini */}
                                    <span dangerouslySetInnerHTML={{
                                        __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
                                    }} />
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white/5 border border-white/5 text-muted-foreground mr-auto rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2"
                                >
                                    <Loader2 className="w-4 h-4 animate-spin text-mint" />
                                    <span className="text-xs font-medium">Analizando datos...</span>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-black/20 border-t border-white/5">
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Preguntale por los ingresos de la semana..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-mint/50 transition-all"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={!input.trim() || isLoading}
                                    className="rounded-xl w-10 h-10 p-0 flex items-center justify-center bg-mint hover:bg-mint/80 text-background shrink-0"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-mint p-[2px] shadow-[0_0_30px_rgba(99,102,241,0.4)] relative group"
            >
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                    {isOpen ? (
                        <X className="w-6 h-6 text-white" />
                    ) : (
                        <Sparkles className="w-6 h-6 text-mint animate-pulse" />
                    )}
                </div>
                {/* Glow behind button */}
                <div className="absolute inset-0 rounded-full bg-indigo-500 blur-xl opacity-50 group-hover:opacity-70 transition-opacity -z-10" />
            </motion.button>
        </div>
    );
}
