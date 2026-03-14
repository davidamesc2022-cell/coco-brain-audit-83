import { Area, Question } from '@/data/auditData';
import { AnswerValue } from '@/hooks/useAudit';
import {
  AnswerYesNo, AnswerYesNoText, AnswerSingle,
  AnswerCheckbox, AnswerScale, AnswerNumber
} from './AnswerComponents';

interface QuestionScreenProps {
  area: Area;
  question: Question;
  questionIndex: number;
  totalAreaQuestions: number;
  globalProgress: number;
  answer: AnswerValue | undefined;
  isAnswered: boolean;
  isLast: boolean;
  onAnswer: (val: AnswerValue) => void;
  onNext: () => void;
  onBack: () => void;
}

export function QuestionScreen({
  area, question, questionIndex, totalAreaQuestions,
  globalProgress, answer, isAnswered, isLast, onAnswer, onNext, onBack,
}: QuestionScreenProps) {
  const renderAnswer = () => {
    const props = { question, answer, onChange: onAnswer };
    switch (question.type) {
      case 'yesno': return <AnswerYesNo {...props} />;
      case 'yesno_text': return <AnswerYesNoText {...props} />;
      case 'single': return <AnswerSingle {...props} />;
      case 'checkbox': return <AnswerCheckbox {...props} />;
      case 'scale': return <AnswerScale {...props} />;
      case 'number': return <AnswerNumber {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-border">
        <div className="h-full progress-gradient transition-all duration-500 ease-out" style={{ width: `${globalProgress}%` }} />
      </div>

      <div className="flex-1 w-full max-w-lg mx-auto px-4 py-6 flex flex-col gap-5 animate-fade-slide-up" key={question.id}>
        {/* Area badge */}
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium self-start"
          style={{ backgroundColor: area.colorHex + '15', color: area.colorHex }}
        >
          {area.icon} {area.name}
        </span>

        {/* Counter */}
        <p className="text-sm text-muted-foreground">Pregunta {questionIndex + 1} de {totalAreaQuestions}</p>

        {/* Question */}
        <h2 className="text-xl font-bold text-foreground leading-snug">{question.question}</h2>

        {/* Hint */}
        {question.hint && <p className="text-sm text-muted-foreground -mt-2">{question.hint}</p>}

        {/* Answer */}
        <div className="flex-1">
          {renderAnswer()}
        </div>

        {/* Nav */}
        <div className="flex gap-3 pb-4 sticky bottom-0 bg-background pt-3">
          <button onClick={onBack} className="flex-1 py-3 px-4 rounded-2xl border-[1.5px] border-border text-muted-foreground font-medium hover:bg-muted transition-colors">
            ← Atrás
          </button>
          <button
            onClick={onNext}
            disabled={!isAnswered}
            className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all ${
              isAnswered
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]'
                : 'bg-primary/40 text-primary-foreground/60 cursor-not-allowed'
            }`}
          >
            {isLast ? 'Ver Resultados ✓' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  );
}
