import { useEffect, useState } from 'react';
import { areas, getLevelInfo } from '@/data/auditData';
import { ScoreRing } from './ScoreRing';
import { OnboardingData } from '@/hooks/useAudit';
import { Mail, MessageSquare, Copy, Check, Share2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

// TODO: Reemplaza este número por tu número de WhatsApp real (código de país + número, ej: 51987654321)
const WHATSAPP_NUMBER = '51913321222'; 

interface ResultsScreenProps {
  areaScores: { areaId: number; score: number }[];
  totalScore: number;
  onShare: () => void;
  onReset: () => void;
  onboardingData: OnboardingData | null;
}

export function ResultsScreen({ areaScores, totalScore, onShare, onReset, onboardingData }: ResultsScreenProps) {
  const level = getLevelInfo(totalScore);
  const [animated, setAnimated] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('hablemos@davidamesc.com');
    setCopied(true);
    toast.success('Correo hablemos@davidamesc.com copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  // Texto de acuerdo al nivel para el agradecimiento
  let levelDescription = '';
  if (totalScore <= 40) {
    levelDescription = 'un nivel Crítico. Esto indica que existen debilidades importantes en tus procesos de marketing que requieren atención inmediata para evitar perder clientes y presupuesto.';
  } else if (totalScore <= 60) {
    levelDescription = 'un nivel En Desarrollo. Tu negocio tiene bases sólidas, pero hay puntos ciegos clave que están frenando el crecimiento de tu facturación.';
  } else if (totalScore <= 80) {
    levelDescription = 'un nivel Intermedio. Cuentas con un marketing estructurado, pero hay oportunidades importantes para optimizar y escalar tus conversiones.';
  } else {
    levelDescription = 'un nivel Avanzado. ¡Felicidades! Tienes procesos de marketing muy saludables y listos para seguir innovando.';
  }

  const companyName = onboardingData?.companyName || 'tu negocio';
  
  // URL de WhatsApp pre-configurada
  const whatsappMessage = `Hola David, acabo de completar mi auditoría para ${companyName} y obtuve un puntaje de ${totalScore}/100 (${level.label}). Quiero solicitar mi Plan de Acción de 90 días en PDF para implementarlo.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  // Mailto pre-configurado
  const mailtoSubject = `Quiero mi Plan de Acción de 90 días - ${companyName}`;
  const mailtoBody = `Hola David,\n\nobtuve un puntaje de ${totalScore}/100 en la auditoría de ${companyName} (${level.label}) y me interesa recibir el plan de acción de 90 días en PDF para analizarlo.\n\nSaludos.`;
  const mailtoUrl = `mailto:hablemos@davidamesc.com?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center animate-fade-slide-up">
      <div className="w-full max-w-lg mx-auto px-4 py-8 flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold text-foreground">Tu diagnóstico de marketing</h1>

        {/* Score Ring */}
        <div className="relative">
          <ScoreRing score={totalScore} size={200} strokeWidth={14} animate={animated} />
        </div>

        {/* Level Badge */}
        <span
          className="px-5 py-2 rounded-full font-semibold text-sm"
          style={{ backgroundColor: level.colorHex + '15', color: level.colorHex }}
        >
          {level.label}
        </span>

        {/* Area Detail */}
        <div className="w-full audit-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Detalle por área</h3>
          <div className="flex flex-col gap-4">
            {areas.map(area => {
              const scoreData = areaScores.find(s => s.areaId === area.id);
              const score = scoreData?.score || 0;
              const areaLevel = getLevelInfo(score);
              return (
                <div key={area.id} className="flex items-center gap-3">
                  <span className="text-xl shrink-0">{area.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-sm font-medium text-foreground truncate">{area.name}</span>
                      <span className="text-sm font-bold ml-2" style={{ color: areaLevel.colorHex }}>{score}</span>
                    </div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <AnimatedBar score={score} color={areaLevel.colorHex} animate={animated} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tarjeta de Agradecimiento y CTA Persuasivo (Reemplaza la visualización directa del plan) */}
        <div className="w-full bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl border border-primary/20 p-6 text-center shadow-lg space-y-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
            🎉
          </div>
          <h3 className="text-lg font-bold text-foreground">¡Felicidades por completar tu auditoría!</h3>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hemos registrado tus respuestas con éxito. El diagnóstico indica que <strong>{companyName}</strong> tiene {levelDescription}
          </p>
          
          <div className="bg-card border border-border p-4 rounded-2xl text-left space-y-2">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">¿Qué sigue ahora?</p>
            <p className="text-sm text-foreground">
              Tu <strong>Plan de Acción de 90 Días</strong> personalizado ya está generado en nuestros sistemas listo para ser implementado con tu equipo.
            </p>
            <p className="text-xs text-muted-foreground">
              Para recibir el documento completo en PDF de manera gratuita, haz clic en uno de los canales de abajo:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-2">
            {/* Solicitar por WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20ba5a] transition-colors shadow-sm active:scale-[0.98]"
            >
              <MessageSquare size={18} />
              Solicitar Plan por WhatsApp
            </a>

            {/* Solicitar por Correo */}
            <a
              href={mailtoUrl}
              className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-orange-600 text-white font-semibold text-sm hover:bg-orange-700 transition-colors shadow-sm active:scale-[0.98]"
            >
              <Mail size={18} />
              Solicitar Plan por Email
            </a>
          </div>

          {/* Fallback de copia de correo por si falla el mailto */}
          <div className="pt-2 border-t border-border flex flex-col items-center gap-1.5">
            <p className="text-[10px] text-muted-foreground">
              Si no cuentas con un cliente de correo configurado, copia nuestra dirección:
            </p>
            <div className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-lg border border-border max-w-full">
              <span className="text-xs font-mono text-foreground truncate max-w-[200px]">hablemos@davidamesc.com</span>
              <button 
                onClick={handleCopyEmail}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                title="Copiar correo"
              >
                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Acciones Secundarias */}
        <div className="w-full flex flex-col gap-3 pb-8">
          <button 
            onClick={onShare} 
            className="w-full py-4 rounded-2xl border border-border bg-card text-foreground font-semibold hover:bg-muted transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Share2 size={16} /> Compartir Diagnóstico con otros
          </button>
          
          <button 
            onClick={onReset} 
            className="w-full py-3 rounded-2xl text-muted-foreground font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} /> Nueva Auditoría
          </button>
        </div>
      </div>
    </div>
  );
}

function AnimatedBar({ score, color, animate }: { score: number; color: string; animate: boolean }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setWidth(score), 200);
      return () => clearTimeout(t);
    }
  }, [animate, score]);

  return (
    <div
      className="h-full rounded-full transition-all duration-1000 ease-out"
      style={{ width: `${width}%`, backgroundColor: color }}
    />
  );
}
