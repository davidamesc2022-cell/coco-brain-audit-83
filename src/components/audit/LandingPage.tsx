import { ScoreRing } from './ScoreRing';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center animate-fade-slide-up">
      <div className="w-full max-w-lg mx-auto px-4 py-8 flex flex-col items-center gap-8">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
          ✦ Metodología Coco Brain
        </span>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-foreground">
            Descubre el nivel real de tu
            <br />
            <span className="text-secondary">marketing digital</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
            Auditoría gratuita en 10 minutos. Obtén un diagnóstico accionable y un plan de 90 días para escalar tu negocio.
          </p>
        </div>

        {/* Score Ring Example */}
        <div className="relative">
          <ScoreRing score={65} size={160} label="ejemplo" color="#2563EB" />
        </div>

        {/* CTA */}
        <button onClick={onStart} className="w-full max-w-sm bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-8 rounded-2xl text-lg transition-all active:scale-[0.98]">
          Empezar Auditoría Gratis →
        </button>

        <p className="text-sm text-muted-foreground">+500 emprendedores ya la completaron</p>

        {/* Benefits */}
        <div className="w-full flex flex-col gap-3">
          {[
            { icon: '📊', title: 'Diagnóstico Completo', desc: 'Evalúa 6 áreas clave de tu marketing digital' },
            { icon: '🎯', title: 'Plan de Acción 90 Días', desc: 'Checklist personalizado con prioridades claras' },
            { icon: '🔄', title: 'Re-auditoría Mensual', desc: 'Mide tu progreso y ajusta estrategias' },
          ].map(b => (
            <div key={b.title} className="audit-card p-4 flex items-start gap-3">
              <span className="text-2xl">{b.icon}</span>
              <div>
                <h3 className="font-semibold text-foreground">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Includes */}
        <div className="audit-card p-5 w-full">
          <h3 className="font-semibold text-foreground mb-3">Incluye todo esto</h3>
          <div className="flex flex-col gap-2">
            {[
              'Score 0–100 con semáforo visual',
              'Resumen ejecutivo por capítulo',
              'Tareas priorizadas por mes',
              'Reporte descargable PDF',
              'Historial de progreso',
              'Compartible por WhatsApp',
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <span className="text-level-advanced font-bold">✓</span>
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Las 6 áreas evaluadas: Análisis Situacional · Objetivos · Estrategia · Tácticas · Medición · Post-Venta
          </p>
          <a href="/admin" className="text-muted-foreground/30 hover:text-muted-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </a>
        </div>
      </div>
    </div>
  );
}
