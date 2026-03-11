'use client';

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  Users,
  Scissors,
  ChevronRight,
  Star,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-emerald-500/30 selection:text-emerald-400 font-sans overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)]">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="font-black text-2xl tracking-tight">Estética<span className="text-emerald-400">Pro</span></span>
          </motion.div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold text-white/60 hover:text-white transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/login">
              <Button className="h-11 px-6 text-sm bg-white text-black hover:bg-emerald-400 rounded-2xl font-bold transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Comenzar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1600334129128-685054110230?auto=format&fit=crop&w=1920&q=80"
              alt="Luxury Spa"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em]">
                <Star className="w-3.5 h-3.5 fill-emerald-400" />
                <span>Gestión High-Ticket</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
                El estándar de<br />
                <span className="text-white">lujo para tu clínica.</span>
              </h1>
              <p className="text-xl text-white/50 max-w-xl leading-relaxed font-medium">
                EstéticaPro eleva la gestión de tu centro a un nivel de sofisticación inalcanzable.
                Tecnología inmersiva para resultados excepcionales.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-5 pt-4">
                <Link href="/login">
                  <Button className="h-16 px-10 text-lg bg-emerald-500 text-black hover:bg-emerald-400 rounded-2xl font-black transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] active:scale-95">
                    Empezar Ahora
                    <ArrowRight className="w-6 h-6 ml-2" />
                  </Button>
                </Link>
                <Link href="/login" className="h-16 px-10 inline-flex items-center justify-center rounded-2xl font-black bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white backdrop-blur-md">
                  Solicitar Demo
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-24 space-y-4"
            >
              <h2 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Innovación en cada módulo.</h2>
              <p className="text-white/40 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                Herramientas diseñadas para la excelencia operativa y la satisfacción del paciente.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6"
            >
              {/* Feature 1: Bento Agenda */}
              <motion.div variants={itemVariants} className="md:col-span-8 group relative overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/10 p-10 hover:bg-white/[0.08] transition-all backdrop-blur-xl">
                <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                  <div className="flex-1 space-y-6">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                      <Calendar className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-3xl font-black tracking-tight">Agenda de Alta Gama</h3>
                    <p className="text-white/50 text-lg leading-relaxed">
                      Control total de tus espacios y especialistas. Sincronización en tiempo real con recordatorios automáticos premium.
                    </p>
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-400/60">
                      <Zap className="w-4 h-4 fill-emerald-400" />
                      <span>Optimización automática de salas</span>
                    </div>
                  </div>
                  <div className="flex-1 relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80"
                      alt="Agenda Management"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Feature 2: Bento Pacientes */}
              <motion.div variants={itemVariants} className="md:col-span-4 group relative overflow-hidden rounded-[2.5rem] bg-white/5 border border-white/10 p-10 hover:bg-white/[0.08] transition-all backdrop-blur-xl">
                <div className="relative z-10 space-y-6 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 mx-auto">
                    <Users className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-3xl font-black tracking-tight">Gestión de Pacientes</h3>
                  <p className="text-white/50 text-md leading-relaxed">
                    Fichas clínicas digitales con historial visual de tratamientos y evolución.
                  </p>
                  <div className="relative h-48 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80"
                      alt="Data Security"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Feature 3: Small Info Box (Full Width) */}
              <motion.div variants={itemVariants} className="md:col-span-12 group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-emerald-500/10 to-transparent border border-white/10 p-12 hover:bg-white/[0.05] transition-all">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="space-y-4 max-w-xl">
                    <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold tracking-[0.3em]">
                      <ShieldCheck className="w-4 h-4 fill-emerald-400" /> PRIVACIDAD TOTAL
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter">Seguridad de Nivel Bancario.</h3>
                    <p className="text-white/50 text-xl leading-relaxed font-medium">
                      Tus datos y los de tus pacientes protegidos con los estándares más altos de encriptación y cumplimiento normativo.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400/40" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Inmersive Section */}
        <section className="py-24 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto relative rounded-[3rem] overflow-hidden bg-white/[0.02] border border-white/10 p-12 md:p-24 text-center backdrop-blur-xl"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                ¿Preparado para el<br />
                <span className="text-emerald-400">siguiente nivel?</span>
              </h2>
              <p className="text-xl text-white/40 font-medium">
                Únete a los centros de estética más prestigiosos que ya operan con EstéticaPro.
                Optimiza hoy tu gestión y deleita a tus pacientes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/login">
                  <Button className="h-16 px-12 text-xl bg-white text-black hover:bg-emerald-400 hover:text-black rounded-2xl font-black transition-all shadow-[0_0_40px_-10px_rgba(32,255,156,0.3)] active:scale-95">
                    Comenzar Ahora Gratis
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="font-black tracking-tight">Estética<span className="text-emerald-400">Pro</span></span>
          </div>
          <p className="text-sm font-bold text-white/20 uppercase tracking-widest">
            © {new Date().getFullYear()} SaaS Estética Pro — El Estándar Premium.
          </p>
          <div className="flex items-center gap-6 text-sm font-black text-white/30">
            <Link href="#" className="hover:text-white transition-colors">Términos</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
