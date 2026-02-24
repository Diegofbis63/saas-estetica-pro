import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Calendar, Users, Scissors, ChevronRight, Star, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-mint/30 selection:text-mint font-sans overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-mint/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-mint/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-mint to-mint/50 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <span className="font-black text-xl tracking-tight">Estética<span className="text-mint">Pro</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-white/60 hover:text-white transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/login">
              <Button className="h-10 px-6 text-sm">
                Comenzar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/10 border border-mint/20 text-mint text-xs font-bold uppercase tracking-widest mb-4">
              <Star className="w-3 h-3" />
              <span>La nueva era de la gestión</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1]">
              Gestión <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint to-white">Premium</span> para<br />Clínicas Estéticas.
            </h1>
            <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
              Elevá el nivel de tu centro de belleza con una plataforma diseñada para la excelencia. Agenda, clientes y facturación en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/login">
                <Button className="h-14 px-8 text-lg group">
                  Empezar Ahora
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login" className="h-14 px-8 inline-flex items-center justify-center rounded-xl font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white">
                Agendar Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">Todo lo que necesitás,<br />diseñado con elegancia.</h2>
              <p className="text-white/40">Herramientas poderosas envueltas en una interfaz intuitiva y lujosa.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
                <div className="w-14 h-14 rounded-2xl bg-mint/10 border border-mint/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Calendar className="w-7 h-7 text-mint" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">Agenda Inteligente</h3>
                <p className="text-white/40 leading-relaxed">
                  Gestioná tus turnos con facilidad. Evitá superposiciones y reducí el ausentismo con un sistema visual claro.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
                <div className="w-14 h-14 rounded-2xl bg-mint/10 border border-mint/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-mint" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">Base de Pacientes</h3>
                <p className="text-white/40 leading-relaxed">
                  Crea perfiles detallados de tus clientes. Historial de tratamientos, preferencias y datos de contacto siempre a mano.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
                <div className="w-14 h-14 rounded-2xl bg-mint/10 border border-mint/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Scissors className="w-7 h-7 text-mint" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">Catálogo de Servicios</h3>
                <p className="text-white/40 leading-relaxed">
                  Organizá tus tratamientos, establecé duraciones y precios. Un menú digital interactivo para administrar tus ofertas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto p-12 md:p-16 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-mint/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 relative z-10">
              ¿Listo para transformar<br />tu estética?
            </h2>
            <p className="text-lg text-white/40 mb-10 max-w-xl mx-auto relative z-10">
              Unite a los centros más exclusivos que ya están utilizando EstéticaPro para llevar su gestión al siguiente nivel.
            </p>
            <Link href="/login" className="relative z-10">
              <Button className="h-14 px-10 text-lg shadow-[0_0_40px_-10px_rgba(32,255,156,0.3)]">
                Crear mi cuenta gratis
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-mint" />
            <span className="font-black tracking-tight">Estética<span className="text-mint">Pro</span></span>
          </div>
          <p className="text-sm font-bold text-white/40">
            © {new Date().getFullYear()} SaaS Estética Pro. Desarrollado para la excelencia.
          </p>
          <div className="flex items-center gap-6 text-sm font-bold text-white/40">
            <Link href="#" className="hover:text-white transition-colors">Términos</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacidad</Link>
            <Link href="#" className="hover:text-white transition-colors">Soporte</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
