import { useEffect, useRef, useState } from 'react';
import { areas, getLevelInfo, getRecommendationsForArea } from '@/data/auditData';
import { ScoreRing } from './ScoreRing';

interface ResultsScreenProps {
  areaScores: { areaId: number; score: number }[];
  totalScore: number;
  onShare: () => void;
  onReset: () => void;
}

export function ResultsScreen({ areaScores, totalScore, onShare, onReset }: ResultsScreenProps) {
  const level = getLevelInfo(totalScore);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Get 3 weakest areas
  const sortedAreas = [...areaScores].sort((a, b) => a.score - b.score);
  const weakest3 = sortedAreas.slice(0, 3);

  const monthLabels = [
    { label: 'Mes 1', subtitle: 'Lanzamiento y corrección', color: '#2563EB' },
    { label: 'Mes 2', subtitle: 'Escalación y optimización', color: '#7C3AED' },
    { label: 'Mes 3', subtitle: 'Consolidación y automatización', color: '#059669' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center animate-fade-slide-up">
      <div className="w-full max-w-lg mx-auto px-4 py-8 flex flex-col items-center gap-8">
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

        {/* 90-Day Plan */}
        <div className="w-full">
          <h3 className="font-semibold text-foreground mb-4 text-lg">Plan de Acción 90 Días</h3>
          <div className="flex flex-col gap-3">
            {weakest3.map((weak, i) => {
              const area = areas.find(a => a.id === weak.areaId)!;
              const recs = getRecommendationsForArea(area.id, weak.score);
              const month = monthLabels[i];
              return (
                <div key={area.id} className="audit-card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: month.color + '15', color: month.color }}>
                      {month.label}
                    </span>
                    <span className="text-sm text-muted-foreground">{month.subtitle}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{area.icon} {area.name} (Score: {weak.score})</p>
                  <div className="flex flex-col gap-1.5">
                    {recs.slice(0, 3).map((rec, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm">
                        <span className="text-muted-foreground shrink-0">•</span>
                        <span className="text-foreground">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Immediate Action */}
        {weakest3[0] && (
          <div className="w-full audit-card p-4" style={{ borderColor: getLevelInfo(weakest3[0].score).colorHex + '40' }}>
            <h3 className="font-semibold text-foreground mb-3">⚡ Acción inmediata esta semana</h3>
            {getRecommendationsForArea(weakest3[0].areaId, weakest3[0].score).slice(0, 2).map((rec, i) => (
              <div key={i} className="flex items-start gap-2 text-sm mb-2">
                <span>⚡</span>
                <span className="text-foreground">{rec}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="w-full flex flex-col gap-3 pb-8">
          <button onClick={onShare} className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all active:scale-[0.98]">
            Compartir por WhatsApp
          </button>
          <button onClick={onReset} className="w-full py-3 rounded-2xl border-[1.5px] border-border text-muted-foreground font-medium hover:bg-muted transition-colors">
            Nueva Auditoría
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
