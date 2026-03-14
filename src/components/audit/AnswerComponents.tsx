import { Question } from '@/data/auditData';
import { AnswerValue } from '@/hooks/useAudit';
import { useState } from 'react';

interface AnswerYesNoProps {
  question: Question;
  answer: AnswerValue | undefined;
  onChange: (val: AnswerValue) => void;
}

export function AnswerYesNo({ question, answer, onChange }: AnswerYesNoProps) {
  const selected = answer?.yesno;

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => onChange({ ...answer, yesno: true })}
        className={`w-full p-4 rounded-2xl border-[1.5px] text-left font-medium transition-all flex items-center gap-3 ${
          selected === true
            ? 'border-level-advanced bg-level-advanced/5 text-level-advanced'
            : 'border-border hover:border-muted-foreground/30 text-foreground'
        }`}
      >
        <span className="text-lg">{selected === true ? '✓' : '○'}</span>
        {question.yesLabel || 'Sí'}
      </button>
      <button
        onClick={() => onChange({ ...answer, yesno: false })}
        className={`w-full p-4 rounded-2xl border-[1.5px] text-left font-medium transition-all flex items-center gap-3 ${
          selected === false
            ? 'border-level-critical bg-level-critical/5 text-level-critical'
            : 'border-border hover:border-muted-foreground/30 text-foreground'
        }`}
      >
        <span className="text-lg">{selected === false ? '✗' : '○'}</span>
        {question.noLabel || 'No'}
      </button>
    </div>
  );
}

export function AnswerYesNoText({ question, answer, onChange }: AnswerYesNoProps) {
  const selected = answer?.yesno;

  return (
    <div className="flex flex-col gap-3">
      <AnswerYesNo question={question} answer={answer} onChange={onChange} />
      {selected === true && question.followUp && (
        <div className="animate-slide-down">
          <FollowUpField question={question} answer={answer} onChange={onChange} />
        </div>
      )}
    </div>
  );
}

function FollowUpField({ question, answer, onChange }: AnswerYesNoProps) {
  const fu = question.followUp!;

  if (fu.type === 'textarea') {
    return (
      <div className="audit-card p-4">
        <label className="text-sm font-medium text-foreground mb-2 block">{fu.label}</label>
        <textarea
          className="w-full p-3 rounded-xl border-[1.5px] border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-secondary/30 min-h-[80px]"
          placeholder={fu.placeholder}
          value={answer?.followUpText || ''}
          onChange={e => onChange({ ...answer, followUpText: e.target.value })}
        />
      </div>
    );
  }

  if (fu.type === 'text') {
    return (
      <div className="audit-card p-4">
        <label className="text-sm font-medium text-foreground mb-2 block">{fu.label}</label>
        <input
          type="text"
          className="w-full p-3 rounded-xl border-[1.5px] border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
          placeholder={fu.placeholder}
          value={answer?.followUpText || ''}
          onChange={e => onChange({ ...answer, followUpText: e.target.value })}
        />
      </div>
    );
  }

  if (fu.type === 'number') {
    return (
      <div className="audit-card p-4">
        <label className="text-sm font-medium text-foreground mb-2 block">{fu.label}</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="flex-1 p-3 rounded-xl border-[1.5px] border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
            placeholder={fu.placeholder}
            value={answer?.followUpText || ''}
            onChange={e => onChange({ ...answer, followUpText: e.target.value })}
          />
          {fu.suffix && <span className="text-muted-foreground font-medium">{fu.suffix}</span>}
        </div>
      </div>
    );
  }

  if (fu.type === 'radio' && fu.options) {
    return (
      <div className="audit-card p-4">
        <label className="text-sm font-medium text-foreground mb-3 block">{fu.label}</label>
        <div className="flex flex-col gap-2">
          {fu.options.map(opt => (
            <button
              key={opt}
              onClick={() => onChange({ ...answer, followUpRadio: opt })}
              className={`w-full p-3 rounded-xl border-[1.5px] text-left text-sm transition-all flex items-center gap-2.5 ${
                answer?.followUpRadio === opt
                  ? 'border-secondary bg-secondary/5 text-secondary font-medium'
                  : 'border-border text-foreground hover:border-muted-foreground/30'
              }`}
            >
              <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                answer?.followUpRadio === opt ? 'border-secondary' : 'border-muted-foreground/40'
              }`}>
                {answer?.followUpRadio === opt && <span className="w-2 h-2 rounded-full bg-secondary" />}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (fu.type === 'checkbox' && fu.options) {
    const selected = answer?.followUpCheckbox || [];
    const toggle = (opt: string) => {
      const next = selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt];
      onChange({ ...answer, followUpCheckbox: next });
    };
    return (
      <div className="audit-card p-4">
        <label className="text-sm font-medium text-foreground mb-3 block">{fu.label}</label>
        <div className="flex flex-col gap-2">
          {fu.options.map(opt => (
            <button key={opt} onClick={() => toggle(opt)}
              className={`w-full p-3 rounded-xl border-[1.5px] text-left text-sm transition-all flex items-center gap-2.5 ${
                selected.includes(opt) ? 'border-secondary bg-secondary/5' : 'border-border hover:border-muted-foreground/30'
              }`}
            >
              <span className={`w-4 h-4 rounded shrink-0 flex items-center justify-center text-xs ${
                selected.includes(opt) ? 'bg-secondary text-primary-foreground' : 'border-2 border-muted-foreground/40'
              }`}>
                {selected.includes(opt) && '✓'}
              </span>
              <span className="text-foreground">{opt}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export function AnswerSingle({ question, answer, onChange }: AnswerYesNoProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {question.options?.map(opt => (
        <button
          key={opt.label}
          onClick={() => onChange({ ...answer, selectedOption: opt.label })}
          className={`w-full p-4 rounded-2xl border-[1.5px] text-left text-sm transition-all flex items-center gap-3 ${
            answer?.selectedOption === opt.label
              ? 'border-secondary bg-secondary/5 font-medium'
              : 'border-border hover:border-muted-foreground/30'
          }`}
        >
          <span className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
            answer?.selectedOption === opt.label ? 'border-secondary' : 'border-muted-foreground/40'
          }`}>
            {answer?.selectedOption === opt.label && <span className="w-2.5 h-2.5 rounded-full bg-secondary" />}
          </span>
          <span className={answer?.selectedOption === opt.label ? 'text-secondary' : 'text-foreground'}>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

export function AnswerCheckbox({ question, answer, onChange }: AnswerYesNoProps) {
  const selected = answer?.selectedOptions || [];

  const toggle = (label: string) => {
    if (label === question.exclusiveOption) {
      onChange({ ...answer, selectedOptions: [label] });
      return;
    }
    let next = selected.filter(s => s !== question.exclusiveOption);
    if (next.includes(label)) {
      next = next.filter(s => s !== label);
    } else {
      next = [...next, label];
    }
    onChange({ ...answer, selectedOptions: next });
  };

  return (
    <div className="flex flex-col gap-2.5">
      {question.options?.map(opt => (
        <button
          key={opt.label}
          onClick={() => toggle(opt.label)}
          className={`w-full p-4 rounded-2xl border-[1.5px] text-left text-sm transition-all flex items-center gap-3 ${
            selected.includes(opt.label) ? 'border-secondary bg-secondary/5' : 'border-border hover:border-muted-foreground/30'
          }`}
        >
          <span className={`w-5 h-5 rounded shrink-0 flex items-center justify-center text-xs font-bold ${
            selected.includes(opt.label) ? 'bg-secondary text-primary-foreground' : 'border-2 border-muted-foreground/40'
          }`}>
            {selected.includes(opt.label) && '✓'}
          </span>
          <span className={selected.includes(opt.label) ? 'text-foreground font-medium' : 'text-foreground'}>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

export function AnswerScale({ question, answer, onChange }: AnswerYesNoProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => onChange({ ...answer, scaleValue: n })}
            className={`w-14 h-14 rounded-2xl font-bold text-lg transition-all ${
              answer?.scaleValue === n
                ? 'bg-secondary text-secondary-foreground shadow-md'
                : 'border-[1.5px] border-border text-foreground hover:border-muted-foreground/30'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>{question.scaleLeftLabel}</span>
        <span>{question.scaleRightLabel}</span>
      </div>
    </div>
  );
}

export function AnswerNumber({ question, answer, onChange }: AnswerYesNoProps) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="number"
        min={0}
        className="flex-1 p-4 rounded-2xl border-[1.5px] border-border bg-card text-foreground text-lg font-medium focus:outline-none focus:ring-2 focus:ring-secondary/30"
        placeholder={question.placeholder}
        value={answer?.numberValue ?? ''}
        onChange={e => {
          const val = e.target.value === '' ? undefined : parseInt(e.target.value);
          onChange({ ...answer, numberValue: val });
        }}
      />
      {question.suffix && <span className="text-muted-foreground font-medium text-sm">{question.suffix}</span>}
    </div>
  );
}
