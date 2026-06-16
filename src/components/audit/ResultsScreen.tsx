import { useEffect, useState } from 'react';
import { areas, getLevelInfo } from '@/data/auditData';
import { ScoreRing } from './ScoreRing';
import { OnboardingData } from '@/hooks/useAudit';
import { Mail, MessageSquare, Copy, Check, Share2, RotateCcw, Award, AlertTriangle, Play, HelpCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

// Número de WhatsApp configurado (código de país + número)
const WHATSAPP_NUMBER = '51913321222'; 

interface ResultsScreenProps {
  areaScores: { areaId: number; score: number }[];
  totalScore: number;
  onShare: () => void;
  onReset: () => void;
  onboardingData: OnboardingData | null;
}

const bottleneckData: Record<number, { impact: string; priority: string }> = {
  1: {
    impact: "Sin un análisis real de tu punto de partida, de tu competencia y de tu sector, estarás tomando decisiones de marketing basadas en suposiciones, lo que usualmente lleva a desperdiciar presupuesto en canales o públicos equivocados.",
    priority: "Tu primera prioridad es detenerte a analizar el panorama actual. Investiga qué está haciendo tu competencia, define con datos el estado de tu mercado y valida dónde están realmente tus oportunidades antes de invertir más dinero."
  },
  2: {
    impact: "Si no sabes exactamente a dónde vas, es imposible medir si tus campañas o tu equipo están funcionando. Seguirás ejecutando acciones de marketing sueltas sin saber si realmente están aportando a la facturación final.",
    priority: "Tu primera prioridad es definir metas numéricas claras para los próximos 90 días: ¿cuántos clientes nuevos necesitas?, ¿cuánto quieres facturar? y ¿cuál es tu presupuesto máximo de adquisición?"
  },
  3: {
    impact: "Si tu marca se comunica igual que el resto, tu negocio se convertirá en un 'comodity' y te verás obligado a competir únicamente por precio bajo, reduciendo tus márgenes y perdiendo clientes valiosos.",
    priority: "Tu primera prioridad es estructurar tu propuesta única de valor. Define qué te hace diferente de la competencia y aclara tu mensaje principal para que tu cliente ideal entienda de inmediato por qué debe elegirte a ti."
  },
  4: {
    impact: "Puedes tener un excelente producto o servicio, pero si tus redes, correos o publicidad no comunican con claridad y persuasión, el mercado no te prestará atención y tus publicaciones no generarán ventas.",
    priority: "Tu primera prioridad es ordenar tu comunicación. Crea una ruta de contenidos atractivos conectada directamente con tu oferta, y selecciona solo los 2 o 3 canales donde tu cliente ideal está más activo para enfocar tus esfuerzos."
  },
  5: {
    impact: "Estás operando a ciegas. Sin registrar tus métricas de conversión, costo de adquisición y retorno de inversión, no sabrás qué acciones te dan dinero y cuáles te lo están haciendo perder, haciendo imposible escalar el negocio.",
    priority: "Tu primera prioridad es implementar un cuadro de control simple. Empieza a registrar cada semana de dónde vienen tus leads, cuántos pasan a ser clientes y cuál es tu porcentaje real de conversión."
  },
  6: {
    impact: "Tu negocio tiene un balde roto: estás gastando mucho dinero en conseguir clientes nuevos solo para perderlos inmediatamente después de la primera compra. Esto hace que tu costo de adquisición sea altísimo y reduce el valor de vida del cliente.",
    priority: "Tu primera prioridad es fidelizar a quienes ya te compraron. Diseña una secuencia sencilla de seguimiento post-compra (por WhatsApp o correo), pide testimonios a tus clientes actuales y ofréceles promociones exclusivas para incentivar la recompra."
  }
};

export function ResultsScreen({ areaScores, totalScore, onShare, onReset, onboardingData }: ResultsScreenProps) {
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

  const companyName = onboardingData?.companyName || 'tu negocio';

  // 1. Obtener niveles y diagnóstico ejecutivo
  let levelLabel = "";
  let levelColor = "";
  let executiveDiagnosis = "";

  if (totalScore <= 39) {
    levelLabel = "Negocio en caos operativo";
    levelColor = "#EF4444"; // Rojo
    executiveDiagnosis = "Tu negocio se encuentra actualmente en un estado de caos operativo. Las acciones de marketing se ejecutan de forma reactiva y desorganizada, lo que consume gran parte de tu energía y presupuesto sin generar retornos estables. El primer paso es estructurar las bases de tu comunicación y ventas para frenar las fugas de dinero.";
  } else if (totalScore <= 59) {
    levelLabel = "Negocio con potencial, pero sin sistema";
    levelColor = "#F97316"; // Naranja
    executiveDiagnosis = "Tu negocio cuenta con un gran potencial y un producto/servicio validado, pero carece de un sistema comercial ordenado. Los clientes llegan principalmente de forma espontánea o por esfuerzos aislados. Necesitas estructurar tus procesos de captación y contenido para no depender del día a día.";
  } else if (totalScore <= 74) {
    levelLabel = "Negocio en construcción estratégica";
    levelColor = "#EAB308"; // Amarillo
    executiveDiagnosis = "Tu negocio se encuentra en construcción estratégica. Cuentas con un marketing estructurado en ciertas áreas, pero varios procesos funcionan desconectados entre sí. El siguiente paso es unificar tu mensaje, optimizar tus canales de venta y automatizar el seguimiento para dar el salto de crecimiento.";
  } else if (totalScore <= 89) {
    levelLabel = "Negocio con sistema en crecimiento";
    levelColor = "#3B82F6"; // Azul
    executiveDiagnosis = "¡Felicitaciones! Cuentas con un negocio con sistema en crecimiento. Tienes una base sólida, tracción en ventas y orden en tus operaciones. Tu oportunidad principal ahora está en afinar la conversión, medir al milímetro el costo de adquisición y optimizar la fidelización para escalar la rentabilidad.";
  } else {
    levelLabel = "Negocio optimizado y escalable";
    levelColor = "#10B981"; // Verde
    executiveDiagnosis = "Tu negocio está optimizado y es altamente escalable. Cuentas con procesos eficientes, medición constante y una marca diferenciada. Tu prioridad estratégica es la innovación, la implementación avanzada de IA en procesos y el liderazgo en tu sector comercial.";
  }

  // 2. Ordenar áreas de mayor a menor puntuación para extraer fortalezas y debilidades
  const sortedAreas = [...areaScores]
    .map(scoreData => {
      const areaInfo = areas.find(a => a.id === scoreData.areaId)!;
      return {
        ...scoreData,
        name: areaInfo.name,
        icon: areaInfo.icon,
        colorHex: areaInfo.colorHex
      };
    })
    .sort((a, b) => b.score - a.score);

  const strengths = sortedAreas.slice(0, 2);
  const weaknesses = sortedAreas.slice(-2).reverse();
  
  // Si el puntaje global es crítico (< 40), excluimos Post-Venta (6) de ser el cuello de botella principal,
  // ya que a ese nivel el problema crítico es siempre fundacional.
  let bottleneck = sortedAreas[sortedAreas.length - 1];
  if (totalScore < 40) {
    const foundationalAreas = sortedAreas.filter(a => a.areaId !== 6);
    if (foundationalAreas.length > 0) {
      bottleneck = foundationalAreas[foundationalAreas.length - 1];
    }
  }

  const bottleneckInfo = bottleneckData[bottleneck.areaId] || {
    impact: "Sin corrección, el crecimiento de tu facturación seguirá viéndose afectado.",
    priority: "Reorganiza tus prioridades de marketing e implementa medición."
  };

  // 3. Definir la ruta recomendada y el plan de acción inicial personalizado
  let recommendedRoute = "";
  let routeDescription = "";
  let actionSteps: string[] = [];

  const bType = onboardingData?.businessType || "";
  const cType = onboardingData?.clientType || "";
  const isB2BOrServiceOrDigital = cType === "B2B" || bType === "servicios" || bType === "digital";

  if (bottleneck.areaId === 2 || bottleneck.areaId === 3 || bottleneck.areaId === 4) {
    recommendedRoute = "Método 4C";
    routeDescription = "Porque necesitas ordenar claridad, creatividad, comunicación y conversión antes de avanzar hacia una estrategia más compleja.";
    
    if (isB2BOrServiceOrDigital) {
      actionSteps = [
        "Clarificar tu cliente ideal (Buyer Persona) y estructurar una oferta irresistible de entrada (Lead Magnet o sesión inicial gratuita).",
        "Crear una ruta de contenidos educativos en tus canales activos que resuelvan las 3 objeciones principales de tus prospectos.",
        "Diseñar un proceso estructurado de ventas por mensajes (DMs/WhatsApp) orientado a agendar llamadas de asesoría o demostración."
      ];
    } else {
      actionSteps = [
        "Clarificar tu cliente ideal final y entender qué los impulsa a comprar (moda, estatus, necesidad inmediata).",
        "Crear una ruta de contenido en redes sociales (TikTok/Instagram) mostrando el producto en uso, sus beneficios y el desempaque (unboxing).",
        "Diseñar un flujo de respuesta rápida y cierre de ventas llevando a los interesados directo a WhatsApp con un mensaje preconfigurado."
      ];
    }
  } else if (bottleneck.areaId === 1 || bottleneck.areaId === 5) {
    recommendedRoute = "Marketing Base con SOSTAC";
    routeDescription = "Porque necesitas de manera sistemática estructurar situación, objetivos, estrategia, tácticas, acción y control.";
    
    if (isB2BOrServiceOrDigital) {
      actionSteps = [
        "Analizar el posicionamiento y la propuesta de valor de tus 3 principales competidores en el mercado digital.",
        "Definir tus objetivos de captación de leads calificados y presupuesto de pauta comercial para los próximos 90 días.",
        "Implementar un cuadro de control semanal para medir el origen exacto de tus prospectos (redes, recomendación, publicidad) y tasa de cierre."
      ];
    } else {
      actionSteps = [
        "Analizar a tus 3 competidores físicos o digitales más cercanos y documentar sus precios y promociones.",
        "Establecer metas de venta numéricas y volumen de clientes nuevos semanales para los próximos 90 días.",
        "Implementar un registro simple (Excel o libreta) para anotar cuántas personas preguntan precio y cuántas compran realmente."
      ];
    }
  } else {
    recommendedRoute = "Implementación Coco Brain";
    routeDescription = "Porque tu negocio necesita una intervención completa de sistemas comerciales, procesos, canales, ventas, métricas y optimización.";
    
    if (isB2BOrServiceOrDigital) {
      actionSteps = [
        "Diseñar una secuencia de seguimiento post-venta por correo o WhatsApp a los 7 y 30 días para asegurar que estén logrando resultados con tu servicio.",
        "Crear un proceso formal para solicitar testimonios escritos o en video de tus clientes actuales y usarlos como prueba social en tus propuestas.",
        "Auditar a tus últimos 10 clientes corporativos o recurrentes para proponerles una renovación, ampliación de servicio o plan anual con beneficios exclusivos."
      ];
    } else {
      actionSteps = [
        "Diseñar una secuencia de mensajes de agradecimiento por WhatsApp para enviar a las 24 horas de la compra con un cupón de descuento para su siguiente visita.",
        "Crear un programa básico de referidos ofreciendo un incentivo (regalo o descuento especial) tanto al cliente actual como al nuevo recomendado.",
        "Auditar a tus últimos 10 compradores para identificar qué productos te compran con mayor frecuencia y ofrecerles promociones cruzadas."
      ];
    }
  }

  // 4. Configurar URLs dinámicas para el agendamiento enfocado en la ruta
  const whatsappMessage = `Hola David, acabo de completar mi auditoría para ${companyName} y obtuve un puntaje de ${totalScore}/100 (${levelLabel}). Mi Ruta Recomendada es: ${recommendedRoute}. Quiero agendar una llamada de diagnóstico gratuita contigo.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  const mailtoSubject = `Quiero agendar mi llamada de diagnóstico - ${companyName}`;
  const mailtoBody = `Hola David,\n\nobtuve un puntaje de ${totalScore}/100 en la auditoría de ${companyName} (${levelLabel}).\n\nMi Ruta Recomendada es: ${recommendedRoute}.\n\nMe interesa agendar una llamada de diagnóstico gratuita contigo.\n\nSaludos.`;
  const mailtoUrl = `mailto:hablemos@davidamesc.com?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center animate-fade-slide-up">
      <div className="w-full max-w-lg mx-auto px-4 py-8 flex flex-col items-center gap-6">
        
        {/* TÍTULO */}
        <h1 className="text-2xl font-bold text-foreground text-center">Tu diagnóstico de marketing</h1>

        {/* 1. PUNTAJE GENERAL */}
        <div className="relative my-2">
          <ScoreRing score={totalScore} size={190} strokeWidth={13} animate={animated} />
        </div>

        {/* 2. NIVEL ACTUAL DEL NEGOCIO */}
        <div className="text-center w-full">
          <span
            className="px-5 py-2 rounded-full font-bold text-sm inline-block shadow-sm"
            style={{ backgroundColor: levelColor + '15', color: levelColor, border: `1px solid ${levelColor}30` }}
          >
            Nivel actual: {levelLabel}
          </span>
        </div>

        {/* 3. DIAGNÓSTICO EJECUTIVO */}
        <div className="w-full audit-card p-5 bg-card border-border shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Sparkles size={16} />
            <span>Diagnóstico Ejecutivo</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {executiveDiagnosis}
          </p>
        </div>

        {/* 4. PUNTAJE POR ÁREAS */}
        <div className="w-full audit-card p-5">
          <h3 className="font-bold text-foreground text-sm mb-4">Detalle por área</h3>
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
                      <span className="text-xs font-semibold text-foreground truncate">{area.name}</span>
                      <span className="text-xs font-bold ml-2" style={{ color: areaLevel.colorHex }}>{score}/20</span>
                    </div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <AnimatedBar score={(score / 20) * 100} color={areaLevel.colorHex} animate={animated} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5 y 6. PUNTOS FUERTES Y DEBILIDADES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {/* PUNTOS FUERTES */}
          <div className="audit-card p-4 bg-green-50/20 border-green-200/50 space-y-2">
            <div className="flex items-center gap-2 text-green-700 font-bold text-xs">
              <Award size={16} />
              <span>Puntos Fuertes</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              {strengths.map(s => (
                <li key={s.areaId} className="flex items-start gap-1">
                  <span>•</span>
                  <strong>{s.name}</strong>
                </li>
              ))}
            </ul>
          </div>

          {/* PUNTOS DÉBILES */}
          <div className="audit-card p-4 bg-red-50/10 border-red-100/50 space-y-2">
            <div className="flex items-center gap-2 text-red-600 font-bold text-xs">
              <AlertTriangle size={15} />
              <span>Puntos Débiles</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              {weaknesses.map(w => (
                <li key={w.areaId} className="flex items-start gap-1">
                  <span>•</span>
                  <strong>{w.name}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 7 y 8. CUELLO DE BOTELLA E IMPACTO */}
        <div className="w-full audit-card p-5 border-l-4 border-l-red-500 bg-red-50/5 space-y-3">
          <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
            <ShieldAlert size={16} />
            <span>Cuello de Botella Principal: {bottleneck.name}</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Impacto en tu negocio:</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {bottleneckInfo.impact}
            </p>
          </div>
        </div>

        {/* 9. PRIORIDAD ESTRATÉGICA */}
        <div className="w-full audit-card p-5 bg-gradient-to-br from-primary/5 to-transparent border-primary/10 space-y-2">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Play size={14} className="fill-primary" />
            <span>Prioridad Estratégica</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {bottleneckInfo.priority}
          </p>
        </div>

        {/* 10 y 11. RUTA RECOMENDADA Y PLAN DE ACCIÓN INICIAL */}
        <div className="w-full bg-slate-50 border border-slate-200 p-5 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <HelpCircle size={16} />
            <span>Ruta Recomendada: <strong className="text-primary">{recommendedRoute}</strong></span>
          </div>
          
          <p className="text-xs text-muted-foreground leading-relaxed italic">
            {routeDescription}
          </p>

          <div className="border-t border-slate-200 pt-3 space-y-2.5">
            <p className="text-xs font-bold text-foreground">Tus próximos pasos recomendados:</p>
            <ul className="space-y-2">
              {actionSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="leading-tight">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 12. CTA FINAL (Lead Magnet y Agendamiento) */}
        <div className="w-full bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl border border-primary/20 p-6 text-center shadow-lg space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">¿Cómo implementar esta ruta?</h3>
          
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tu diagnóstico ya muestra dónde está la oportunidad. El siguiente paso es convertir esta información en acción. Solicita tu llamada de diagnóstico para descubrir cómo implementar el <strong>{recommendedRoute}</strong> en tu negocio.
          </p>

          <div className="grid grid-cols-1 gap-3 pt-2">
            {/* Solicitar por WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20ba5a] transition-colors shadow-sm active:scale-[0.98]"
            >
              <MessageSquare size={18} />
              Solicitar Ruta por WhatsApp
            </a>

            {/* Solicitar por Correo */}
            <a
              href={mailtoUrl}
              className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-orange-600 text-white font-semibold text-sm hover:bg-orange-700 transition-colors shadow-sm active:scale-[0.98]"
            >
              <Mail size={18} />
              Agendar llamada por Email
            </a>
          </div>

          {/* Fallback de copia de correo por si falla el mailto */}
          <div className="pt-2 border-t border-border flex flex-col items-center gap-1.5">
            <p className="text-[10px] text-muted-foreground">
              Si no cuentas con un cliente de correo configurado, copia nuestra dirección:
            </p>
            <div className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-lg border border-border max-w-full mx-auto">
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
