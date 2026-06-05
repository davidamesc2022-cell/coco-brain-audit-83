import { useAudit } from '@/hooks/useAudit';
import { LandingPage } from '@/components/audit/LandingPage';
import { OnboardingScreen } from '@/components/audit/OnboardingScreen';
import { ChapterIntro } from '@/components/audit/ChapterIntro';
import { QuestionScreen } from '@/components/audit/QuestionScreen';
import { ResultsScreen } from '@/components/audit/ResultsScreen';
import { LeadCaptureScreen } from '@/components/audit/LeadCaptureScreen';
import { getLevelInfo } from '@/data/auditData';

const Index = () => {
  const audit = useAudit();

  const handleShare = () => {
    const level = getLevelInfo(audit.totalScore);
    const text = `Acabo de hacer la Auditoría de Marketing con la Metodología Coco Brain y obtuve ${audit.totalScore}/100 (${level.label}) 🎯 ¡Descubre el nivel real de tu marketing digital!`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const globalProgress = (audit.totalAnswered / 30) * 100;

  switch (audit.screen) {
    case 'landing':
      return <LandingPage onStart={audit.startAudit} />;
    case 'onboarding':
      return (
        <OnboardingScreen
          onSubmit={audit.submitOnboarding}
          onBack={audit.goBack}
        />
      );
    case 'intro':
      return (
        <ChapterIntro
          area={audit.currentArea}
          areaIndex={audit.currentAreaIndex}
          onStart={audit.startArea}
          onBack={audit.goBack}
        />
      );
    case 'question':
      return (
        <QuestionScreen
          area={audit.currentArea}
          question={audit.currentQuestion}
          questionIndex={audit.currentQuestionIndex}
          totalAreaQuestions={audit.areaQuestions.length}
          globalProgress={globalProgress}
          answer={audit.answers[audit.currentQuestion.id]}
          isAnswered={audit.isCurrentAnswered()}
          isLast={audit.isLastQuestion}
          onAnswer={(val) => audit.setAnswer(audit.currentQuestion.id, val)}
          onNext={audit.goNext}
          onBack={audit.goBack}
        />
      );
    case 'lead_capture':
      return (
        <LeadCaptureScreen
          onSuccess={() => audit.goToResults()}
          auditData={{
            totalScore: audit.totalScore,
            areaScores: audit.areaScores.reduce((acc, a) => ({ ...acc, [a.areaId]: a.score }), {}),
            answers: audit.answers,
          }}
          onboardingData={audit.onboardingData}
        />
      );
    case 'results':
      return (
        <ResultsScreen
          areaScores={audit.areaScores}
          totalScore={audit.totalScore}
          onShare={handleShare}
          onReset={audit.resetAudit}
          onboardingData={audit.onboardingData}
        />
      );
  }
};

export default Index;
