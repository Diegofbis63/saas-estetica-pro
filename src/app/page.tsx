'use client';

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  Users,
  Scissors,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Star
} from "lucide-react";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const services = [
  {
    title: "Depilación Láser",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Tratamientos Faciales",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Medicina Estética",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Modelado Corporal",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Rejuvenecimiento",
    image: "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Spa y Relax",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-rose-500/30 selection:text-rose-600 font-sans overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-rose-400/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-400/5 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-[0_0_20px_rgba(251,113,133,0.3)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tight text-foreground">Estética<span className="text-rose-500">Pro</span></span>
          </motion.div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold text-foreground/60 hover:text-foreground transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/login">
              <Button className="h-11 px-6 text-sm bg-rose-500 hover:bg-rose-400 text-white shadow-md">
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
          <div className="absolute inset-0 z-0 flex justify-end">
            <div className="w-full md:w-3/4 h-full relative">
              <img
                src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=2000&q=80"
                alt="Medical Aesthetic Clinic"
                className="w-full h-full object-cover object-center md:object-right opacity-90"
              />
              {/* Elegant overlay to make text highly readable but let image shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 md:via-background/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:hidden" />
            </div>
          </div>

          <div className="max-w-7xl mx-auto w-full px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-[0.2em] shadow-sm backdrop-blur-md">
                <Star className="w-3.5 h-3.5 fill-rose-500" />
                <span>Gestión High-Ticket</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-foreground drop-shadow-sm">
                El estándar de<br />
                <span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">lujo</span> para
                clínicas.
              </h1>
              <p className="text-xl md:text-2xl text-foreground/70 font-medium leading-normal max-w-xl">
                Eleva la experiencia de tus pacientes y automatiza tu operativa con el software más avanzado del sector estético.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link href="/login">
                  <Button className="h-14 px-8 text-lg rounded-2xl bg-rose-500 hover:bg-rose-400 text-white shadow-lg">
                    Probar Gratis
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="secondary" className="h-14 px-8 text-lg rounded-2xl font-bold transition-all bg-white border border-black/5 text-foreground hover:bg-gray-50 shadow-sm">
                    Ver Funciones
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Dashboard Mockup with Light Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              className="relative hidden md:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-400/20 to-transparent blur-3xl rounded-[3rem]" />
              <div className="relative rounded-[2.5rem] bg-white/60 border border-white/50 p-4 backdrop-blur-2xl shadow-2xl skew-y-[-2deg] hover:skew-y-0 transition-transform duration-700 overflow-hidden">
                <div className="w-full h-8 flex items-center gap-2 px-4 mb-4 border-b border-black/5 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80 shadow-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-40 rounded-2xl bg-white/80 border border-black/5 p-6 space-y-4 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                      <Users className="w-5 h-5 text-rose-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-1/2 bg-black/10 rounded-full" />
                      <div className="h-2 w-3/4 bg-black/5 rounded-full" />
                    </div>
                  </div>
                  <div className="h-40 rounded-2xl bg-gradient-to-br from-rose-50 to-white border border-rose-100 p-6 space-y-4 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center shadow-md">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-2/3 bg-rose-300 rounded-full" />
                      <div className="h-2 w-1/2 bg-rose-100 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Brand Bar */}
        <div className="w-full border-y border-black/5 bg-white/40 backdrop-blur-md py-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale">
            {/* Simulating Brand Logos */}
            {['Vogue', 'Estheticon', 'Forbes', 'Elle', 'DermaTech'].map(brand => (
              <span key={brand} className="text-xl font-black tracking-widest uppercase text-foreground">{brand}</span>
            ))}
          </div>
        </div>

        {/* Feature Bento Section */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto space-y-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-6"
            >
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">Innovación en cada módulo.</h2>
              <p className="text-foreground/70 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
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
              <motion.div variants={itemVariants} className="md:col-span-8 group relative overflow-hidden rounded-[2.5rem] bg-white/60 border border-white/50 shadow-sm p-10 hover:bg-white/80 transition-all backdrop-blur-xl">
                <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                  <div className="flex-1 space-y-6">
                    <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center border border-rose-100 shadow-sm">
                      <Calendar className="w-8 h-8 text-rose-500" />
                    </div>
                    <h3 className="text-3xl font-black tracking-tight text-foreground">Agenda de Alta Gama</h3>
                    <p className="text-foreground/70 text-lg leading-relaxed">
                      Control total de tus espacios y especialistas. Sincronización en tiempo real con recordatorios automáticos premium.
                    </p>
                    <div className="flex items-center gap-2 text-sm font-bold text-rose-500">
                      <Zap className="w-4 h-4 fill-rose-500" />
                      <span>Optimización automática de salas</span>
                    </div>
                  </div>
                  <div className="flex-1 relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-black/5 shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80"
                      alt="Agenda Management"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Feature 2: Bento Pacientes */}
              <motion.div variants={itemVariants} className="md:col-span-4 group relative overflow-hidden rounded-[2.5rem] bg-white/60 border border-white/50 shadow-sm p-10 hover:bg-white/80 transition-all backdrop-blur-xl">
                <div className="relative z-10 space-y-6 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center border border-rose-100 shadow-sm mx-auto">
                    <Users className="w-8 h-8 text-rose-500" />
                  </div>
                  <h3 className="text-3xl font-black tracking-tight text-foreground">Gestión de Pacientes</h3>
                  <p className="text-foreground/70 text-md leading-relaxed">
                    Fichas clínicas digitales con historial visual de tratamientos y evolución.
                  </p>
                  <div className="relative h-48 rounded-3xl overflow-hidden border border-black/5 shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80"
                      alt="Data Security"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Feature 3: Small Info Box (Full Width) */}
              <motion.div variants={itemVariants} className="md:col-span-12 group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-rose-50 to-white border border-rose-100 p-12 hover:shadow-md transition-all shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="space-y-4 max-w-xl">
                    <div className="inline-flex items-center gap-2 text-rose-600 text-xs font-bold tracking-[0.3em]">
                      <ShieldCheck className="w-4 h-4 fill-rose-600" /> PRIVACIDAD TOTAL
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter text-foreground">Seguridad de Nivel Bancario.</h3>
                    <p className="text-foreground/70 text-xl leading-relaxed font-medium">
                      Tus datos y los de tus pacientes protegidos con los estándares más altos de encriptación y cumplimiento normativo.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 w-16 rounded-2xl bg-white border border-rose-100 shadow-sm flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-rose-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Medical Aesthetic Services Section */}
        <section className="py-24 px-6 border-t border-black/5 bg-white/30">
          <div className="max-w-7xl mx-auto space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-4"
            >
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Especialidades Integradas</h2>
              <p className="text-foreground/70 text-lg max-w-2xl mx-auto font-medium">
                El software se adapta a cada uno de los tratamientos de tu centro estético.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative overflow-hidden rounded-[2rem] aspect-[4/5] border border-black/5 shadow-sm"
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-2xl font-black tracking-tight drop-shadow-md">{service.title}</h3>
                    <div className="mt-4 flex items-center gap-2 text-sm font-bold text-rose-300 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 drop-shadow-md">
                      VER MÓDULO <Zap className="w-4 h-4 fill-rose-300" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Inmersive Section */}
        <section className="py-32 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto relative rounded-[3rem] overflow-hidden bg-white/60 border border-white/50 shadow-xl p-12 md:p-24 text-center backdrop-blur-xl"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-400/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-foreground">
                ¿Preparado para el<br />
                <span className="text-rose-500">siguiente nivel?</span>
              </h2>
              <p className="text-xl text-foreground/70 font-medium">
                Únete a los centros de estética más prestigiosos que ya operan con EstéticaPro.
                Optimiza hoy tu gestión y deleita a tus pacientes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/login">
                  <Button className="h-16 px-12 text-xl rounded-2xl font-black transition-all bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/30">
                    Comenzar Ahora Gratis
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-white/40 backdrop-blur-md py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span className="font-black tracking-tight text-foreground">Estética<span className="text-rose-500">Pro</span></span>
          </div>
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">
            © {new Date().getFullYear()} SaaS Estética Pro — El Estándar Premium.
          </p>
          <div className="flex items-center gap-6 text-sm font-black text-foreground/50">
            <Link href="#" className="hover:text-foreground transition-colors">Términos</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
