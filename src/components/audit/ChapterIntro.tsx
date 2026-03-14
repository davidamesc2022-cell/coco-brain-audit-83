import { Area, getQuestionsForArea } from '@/data/auditData';

interface ChapterIntroProps {
  area: Area;
  areaIndex: number;
  onStart: () => void;
  onBack: () => void;
}

export function ChapterIntro({ area, areaIndex, onStart, onBack }: ChapterIntroProps) {
  const questions = getQuestionsForArea(area.id);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center animate-fade-slide-up">
      <div className="w-full max-w-lg mx-auto px-4 py-8 flex flex-col items-center gap-6">
        {/* Badge */}
        <span
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium"
          style={{ backgroundColor: area.colorHex + '15', color: area.colorHex }}
        >
          Área {areaIndex + 1} de 6
        </span>

        {/* Icon */}
        <span className="text-6xl">{area.icon}</span>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">{area.name}</h2>
          <p className="text-muted-foreground mt-1">{area.subtitle}</p>
          <p className="text-sm text-muted-foreground mt-3 max-w-sm">{area.description}</p>
        </div>

        {/* Questions preview */}
        <div className="w-full audit-card p-4" style={{ backgroundColor: area.colorHex + '08', borderColor: area.colorHex + '30' }}>
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Preguntas de esta sección</p>
          <div className="flex flex-col gap-2.5">
            {questions.map((q, i) => (
              <div key={q.id} className="flex items-start gap-2.5 text-sm">
                <span className="font-semibold text-muted-foreground shrink-0" style={{ color: area.colorHex }}>{i + 1}.</span>
                <span className="text-foreground/80">{q.question}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nav */}
        <div className="w-full flex gap-3 mt-2">
          <button onClick={onBack} className="flex-1 py-3 px-4 rounded-2xl border-[1.5px] border-border text-muted-foreground font-medium hover:bg-muted transition-colors">
            ← Anterior
          </button>
          <button onClick={onStart} className="flex-1 py-3 px-4 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors active:scale-[0.98]">
            Comenzar {area.name.split(' ')[0]} →
          </button>
        </div>
      </div>
    </div>
  );
}
