import { useState } from 'react';
import AdminPanel from './components/AdminPanel';
import QuizGame from './components/QuizGame';
import { warmUpAudio } from './utils/quizSounds';
import { unlockIntroAudio } from './utils/introAudio';
import { startBackgroundMusic } from './utils/backgroundMusic';

export type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
};

export const DEFAULT_TIME_LIMIT = 30;

export type QuizSettings = {
  welcomeMessage: string;
  readyMessage: string;
};

export const DEFAULT_QUIZ_SETTINGS: QuizSettings = {
  welcomeMessage: 'مرحبا طالبات',
  readyMessage: 'جاهزون للمسابقة',
};

export default function App() {
  const [view, setView] = useState<'admin' | 'quiz'>('admin');
  const [quizSession, setQuizSession] = useState(0);
  const [quizSettings, setQuizSettings] = useState<QuizSettings>(DEFAULT_QUIZ_SETTINGS);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      question: 'ما هي عاصمة السعودية؟',
      options: ['جدة', 'الرياض', 'مكة', 'الدمام'],
      correctAnswer: 1,
      timeLimit: 30,
    },
    {
      id: '2',
      question: 'كم عدد أركان الإسلام؟',
      options: ['3', '4', '5', '6'],
      correctAnswer: 2,
      timeLimit: 20,
    },
    {
      id: '3',
      question: 'ما هو لون السماء؟',
      options: ['أحمر', 'أخضر', 'أزرق', 'أصفر'],
      correctAnswer: 2,
      timeLimit: 15,
    },
  ]);

  return (
    <div className="size-full min-h-screen bg-slate-950 relative overflow-hidden" dir="rtl">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto p-4 md:p-6 h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl overflow-hidden shadow-xl ring-2 ring-cyan-400/40 bg-slate-900 flex-shrink-0">
              <img
                src="/images/mw-avatar.png"
                alt="MW"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white">مسابقة MW</h1>
              <p className="text-sm md:text-base text-slate-400">مع الروبوت الذكي</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 bg-slate-800/50 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-700/50">
            <button
              onClick={() => {
                warmUpAudio();
                unlockIntroAudio();
                void startBackgroundMusic();
                setQuizSession((n) => n + 1);
                setView('quiz');
              }}
              className={`px-4 md:px-8 py-2 md:py-3 rounded-xl transition-all text-sm md:text-base ${
                view === 'quiz'
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              المسابقة
            </button>
            <button
              onClick={() => {
                warmUpAudio();
                void startBackgroundMusic();
                setView('admin');
              }}
              className={`px-4 md:px-8 py-2 md:py-3 rounded-xl transition-all text-sm md:text-base ${
                view === 'admin'
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الإدارة
            </button>
          </div>
        </div>

        {/* Content */}
        {view === 'admin' ? (
          <AdminPanel
            questions={questions}
            setQuestions={setQuestions}
            quizSettings={quizSettings}
            setQuizSettings={setQuizSettings}
          />
        ) : (
          <QuizGame key={quizSession} questions={questions} quizSettings={quizSettings} />
        )}
      </div>
    </div>
  );
}
