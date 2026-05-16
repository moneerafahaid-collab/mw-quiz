import { useState } from 'react';
import { Plus, Trash2, Check, Volume2 } from 'lucide-react';
import type { Question, QuizSettings } from '../App';
import { DEFAULT_TIME_LIMIT } from '../App';
import { playIntroSpeech, stopIntroSpeech, unlockIntroAudio } from '../utils/introAudio';
import { warmUpAudio } from '../utils/quizSounds';

type AdminPanelProps = {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  quizSettings: QuizSettings;
  setQuizSettings: (settings: QuizSettings) => void;
};

export default function AdminPanel({
  questions,
  setQuestions,
  quizSettings,
  setQuizSettings,
}: AdminPanelProps) {
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    timeLimit: DEFAULT_TIME_LIMIT,
  });
  const addQuestion = () => {
    if (newQuestion.question && newQuestion.options.every((opt) => opt.trim())) {
      const question: Question = {
        id: Date.now().toString(),
        ...newQuestion,
      };
      setQuestions([...questions, question]);
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        timeLimit: DEFAULT_TIME_LIMIT,
      });
    }
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateOption = (index: number, value: string) => {
    const options = [...newQuestion.options];
    options[index] = value;
    setNewQuestion({ ...newQuestion, options });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 mb-8 border border-slate-700/50 shadow-2xl">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">رسائل الترحيب (MW)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">الرسالة الأولى</label>
            <input
              type="text"
              placeholder="مرحبا طالبات"
              value={quizSettings.welcomeMessage}
              onChange={(e) =>
                setQuizSettings({ ...quizSettings, welcomeMessage: e.target.value })
              }
              className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">الرسالة الثانية</label>
            <input
              type="text"
              placeholder="جاهزون للمسابقة"
              value={quizSettings.readyMessage}
              onChange={(e) =>
                setQuizSettings({ ...quizSettings, readyMessage: e.target.value })
              }
              className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-3">
              صوت بنت (زارية). أي نص تكتبينه يُنطق كما هو — استخدمي «جربي الصوت» بعد التعديل.
              يجب تشغيل الموقع عبر <span className="text-slate-400">npm run dev</span>.
            </p>
            <button
              type="button"
              onClick={() => {
                warmUpAudio();
                unlockIntroAudio();
                stopIntroSpeech();
                void playIntroSpeech(
                  quizSettings.welcomeMessage || 'مرحبا طالبات',
                  'welcome',
                );
              }}
              className="text-slate-300 hover:text-white px-4 py-2 rounded-xl border border-slate-600 hover:border-purple-500 transition-all flex items-center gap-2 text-sm"
            >
              <Volume2 size={16} />
              جربي الصوت
            </button>
          </div>
        </div>
      </div>

      {/* Add New Question Card */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 mb-8 border border-slate-700/50 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Plus className="text-white" size={20} />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">إضافة سؤال جديد</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">نص السؤال</label>
            <input
              type="text"
              placeholder="اكتب السؤال هنا..."
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">وقت السؤال (بالثواني)</label>
            <input
              type="number"
              min={5}
              max={300}
              value={newQuestion.timeLimit}
              onChange={(e) =>
                setNewQuestion({
                  ...newQuestion,
                  timeLimit: Math.min(300, Math.max(5, Number(e.target.value) || DEFAULT_TIME_LIMIT)),
                })
              }
              className="w-full md:w-48 p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">الخيارات (اختر الإجابة الصحيحة)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {newQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    newQuestion.correctAnswer === index
                      ? 'bg-emerald-500/10 border-emerald-500'
                      : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      newQuestion.correctAnswer === index
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-slate-600 hover:border-emerald-500'
                    }`}
                  >
                    {newQuestion.correctAnswer === index && (
                      <Check size={14} className="text-white" />
                    )}
                  </button>
                  <input
                    type="text"
                    placeholder={`الخيار ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={addQuestion}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2 font-semibold"
          >
            <Plus size={20} />
            إضافة السؤال
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            الأسئلة الحالية
          </h2>
          <span className="px-4 py-2 bg-slate-800/50 backdrop-blur-xl rounded-full text-slate-300 border border-slate-700/50">
            {questions.length} سؤال
          </span>
        </div>

        {questions.length === 0 ? (
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-2xl p-12 text-center border border-slate-700/50">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl text-slate-400">لا توجد أسئلة بعد</p>
            <p className="text-sm text-slate-500 mt-2">ابدأ بإضافة أول سؤال</p>
          </div>
        ) : (
          questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-lg text-white">{q.question}</p>
                    <p className="text-sm text-slate-500 mt-1">⏱ {q.timeLimit ?? DEFAULT_TIME_LIMIT} ثانية</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteQuestion(q.id)}
                  className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      optIndex === q.correctAnswer
                        ? 'bg-emerald-500/10 border-emerald-500 text-white'
                        : 'bg-slate-900/30 border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {optIndex === q.correctAnswer && (
                        <Check size={16} className="text-emerald-500 flex-shrink-0" />
                      )}
                      <span className="text-sm">{option}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
