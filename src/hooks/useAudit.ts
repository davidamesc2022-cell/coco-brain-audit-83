import { useState, useCallback, useMemo } from 'react';
import { questions, areas, getQuestionsForArea } from '@/data/auditData';

export type AnswerValue = {
  yesno?: boolean;
  followUpText?: string;
  followUpRadio?: string;
  followUpCheckbox?: string[];
  selectedOption?: string;
  selectedOptions?: string[];
  scaleValue?: number;
  numberValue?: number;
};

export type AuditScreen = 'landing' | 'onboarding' | 'intro' | 'question' | 'lead_capture' | 'results';

export interface OnboardingData {
  companyName: string;
  description: string;
  country: string;
  businessType: string;
  operatingTime: string;
  aiUsage: string;
  clientType: string;
  acquisitionChannel: string;
  fileUrl?: string;
}

export function useAudit() {
  const [screen, setScreen] = useState<AuditScreen>('landing');
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  const currentArea = areas[currentAreaIndex];
  const areaQuestions = useMemo(() => getQuestionsForArea(currentArea.id), [currentArea.id]);
  const currentQuestion = areaQuestions[currentQuestionIndex];

  const totalAnswered = useMemo(() => {
    let count = 0;
    for (let ai = 0; ai < areas.length; ai++) {
      const qs = getQuestionsForArea(areas[ai].id);
      for (let qi = 0; qi < qs.length; qi++) {
        if (ai < currentAreaIndex || (ai === currentAreaIndex && qi < currentQuestionIndex)) {
          count++;
        } else if (ai === currentAreaIndex && qi === currentQuestionIndex && answers[qs[qi].id]) {
          count++;
        }
      }
    }
    return count;
  }, [currentAreaIndex, currentQuestionIndex, answers]);

  const globalQuestionNumber = useMemo(() => {
    let num = 0;
    for (let i = 0; i < currentAreaIndex; i++) {
      num += getQuestionsForArea(areas[i].id).length;
    }
    return num + currentQuestionIndex;
  }, [currentAreaIndex, currentQuestionIndex]);

  const setAnswer = useCallback((questionId: string, value: AnswerValue) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const isCurrentAnswered = useCallback((): boolean => {
    if (!currentQuestion) return false;
    const answer = answers[currentQuestion.id];
    if (!answer) return false;
    const q = currentQuestion;
    switch (q.type) {
      case 'yesno': return answer.yesno !== undefined;
      case 'yesno_text': return answer.yesno !== undefined;
      case 'single': return !!answer.selectedOption;
      case 'checkbox': return !!(answer.selectedOptions && answer.selectedOptions.length > 0);
      case 'scale': return answer.scaleValue !== undefined;
      case 'number': return answer.numberValue !== undefined;
      default: return false;
    }
  }, [currentQuestion, answers]);

  const startAudit = useCallback(() => {
    setCurrentAreaIndex(0);
    setCurrentQuestionIndex(0);
    setScreen('onboarding');
  }, []);

  const submitOnboarding = useCallback((data: OnboardingData) => {
    setOnboardingData(data);
    setScreen('intro');
  }, []);

  const startArea = useCallback(() => {
    setScreen('question');
  }, []);

  const goNext = useCallback(() => {
    if (currentQuestionIndex < areaQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentAreaIndex < areas.length - 1) {
      setCurrentAreaIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
      setScreen('intro');
    } else {
      setScreen('lead_capture');
    }
  }, [currentQuestionIndex, areaQuestions.length, currentAreaIndex]);

  const goToResults = useCallback(() => {
    setScreen('results');
  }, []);

  const goBack = useCallback(() => {
    if (screen === 'onboarding') {
      setScreen('landing');
    } else if (screen === 'question' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (screen === 'question' && currentQuestionIndex === 0) {
      setScreen('intro');
    } else if (screen === 'intro' && currentAreaIndex > 0) {
      setCurrentAreaIndex(prev => prev - 1);
      const prevQuestions = getQuestionsForArea(areas[currentAreaIndex - 1].id);
      setCurrentQuestionIndex(prevQuestions.length - 1);
      setScreen('question');
    } else if (screen === 'intro' && currentAreaIndex === 0) {
      setScreen('onboarding');
    }
  }, [screen, currentQuestionIndex, currentAreaIndex]);

  const calculateScore = useCallback((areaId: number): number => {
    const qs = getQuestionsForArea(areaId);
    let total = 0;
    for (const q of qs) {
      const a = answers[q.id];
      if (!a) continue;
      switch (q.type) {
        case 'yesno':
        case 'yesno_text':
          total += a.yesno ? (q.yesPoints || 0) : (q.noPoints || 0);
          break;
        case 'single':
          if (a.selectedOption && q.options) {
            const opt = q.options.find(o => o.label === a.selectedOption);
            total += opt?.points || 0;
          }
          break;
        case 'checkbox':
          if (a.selectedOptions && q.options) {
            let pts = 0;
            for (const sel of a.selectedOptions) {
              if (sel === q.exclusiveOption) { pts = 0; break; }
              const opt = q.options.find(o => o.label === sel);
              pts += opt?.points || 0;
            }
            total += Math.min(pts, q.maxPoints || 20);
          }
          break;
        case 'scale':
          if (a.scaleValue !== undefined && q.scalePoints) {
            total += q.scalePoints[a.scaleValue - 1] || 0;
          }
          break;
        case 'number':
          if (a.numberValue !== undefined && q.numberRanges) {
            const val = a.numberValue;
            for (const range of q.numberRanges) {
              if (val >= range.min && val <= range.max) {
                total += range.points;
                break;
              }
            }
          }
          break;
      }
    }
    return total;
  }, [answers]);

  const areaScores = useMemo(() => {
    return areas.map(a => ({ areaId: a.id, score: calculateScore(a.id) }));
  }, [calculateScore]);

  const totalScore = useMemo(() => {
    const sum = areaScores.reduce((acc, s) => acc + s.score, 0);
    return Math.round(sum / areas.length);
  }, [areaScores]);

  const resetAudit = useCallback(() => {
    setScreen('landing');
    setOnboardingData(null);
    setCurrentAreaIndex(0);
    setCurrentQuestionIndex(0);
    setAnswers({});
  }, []);

  const isLastQuestion = currentAreaIndex === areas.length - 1 && currentQuestionIndex === areaQuestions.length - 1;

  return {
    screen, onboardingData, currentArea, currentQuestion, currentQuestionIndex, currentAreaIndex,
    areaQuestions, answers, totalAnswered, globalQuestionNumber, isLastQuestion,
    setAnswer, isCurrentAnswered, startAudit, submitOnboarding, startArea, goNext, goBack, goToResults,
    areaScores, totalScore, resetAudit,
  };
}
