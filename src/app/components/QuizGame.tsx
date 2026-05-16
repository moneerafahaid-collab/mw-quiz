import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import RobotMW from './RobotMW';
import type { Question, QuizSettings } from '../App';
import { DEFAULT_TIME_LIMIT } from '../App';
import QuizIntro from './QuizIntro';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Timer } from 'lucide-react';
import {
  playHappySound,
  playSadSound,
  playTickTockSound,
  resetTickTock,
  warmUpAudio,
} from '../utils/quizSounds';

type QuizGameProps = {
  questions: Question[];
  quizSettings: QuizSettings;
};

type GameState = 'waiting' | 'correct' | 'wrong' | 'finished';

export default function QuizGame({ questions, quizSettings }: QuizGameProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME_LIMIT);
  const timedOutRef = useRef(false);

  const currentQuestion = questions[currentQuestionIndex];
  const timeLimit = currentQuestion?.timeLimit ?? DEFAULT_TIME_LIMIT;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const advanceAfterAnswer = useCallback(
    (wasCorrect: boolean) => {
      setTimeout(() => {
        if (isLastQuestion) {
          setGameState('finished');
          if (wasCorrect) {
            confetti({
              particleCount: 200,
              spread: 100,
              origin: { y: 0.5 },
              colors: ['#a855f7', '#06b6d4', '#ec4899'],
            });
          }
        } else {
          setCurrentQuestionIndex((i) => i + 1);
          setGameState('waiting');
          setSelectedAnswer(null);
          timedOutRef.current = false;
        }
      }, 2500);
    },
    [isLastQuestion],
  );

  const handleTimeUp = useCallback(() => {
    if (timedOutRef.current) return;
    timedOutRef.current = true;
    setSelectedAnswer(null);
    setGameState('wrong');
    playSadSound();
    advanceAfterAnswer(false);
  }, [advanceAfterAnswer]);

  useEffect(() => {
    if (!hasStarted || gameState !== 'waiting' || !currentQuestion) return;

    setTimeLeft(timeLimit);
    timedOutRef.current = false;
    resetTickTock();

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        const next = prev - 1;
        playTickTockSound(next <= 10);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, currentQuestionIndex, gameState, timeLimit, currentQuestion?.id, handleTimeUp]);

  const handleAnswer = (answerIndex: number) => {
    if (gameState !== 'waiting' || !currentQuestion || timedOutRef.current) return;

    timedOutRef.current = true;
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore((s) => s + 1);
      setGameState('correct');
      playHappySound();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#06b6d4', '#ec4899'],
      });
    } else {
      setGameState('wrong');
      playSadSound();
    }

    advanceAfterAnswer(isCorrect);
  };

  const restartGame = () => {
    setHasStarted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameState('waiting');
    setSelectedAnswer(null);
    timedOutRef.current = false;
    setTimeLeft(DEFAULT_TIME_LIMIT);
    resetTickTock();
  };

  if (questions.length === 0) {
    return (
      <motion.div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-12 md:p-16 text-center border border-slate-700/50 shadow-2xl">
          <div className="text-6xl md:text-8xl mb-6">🎯</div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">لا توجد أسئلة بعد</h2>
          <p className="text-lg text-slate-400">قم بإضافة أسئلة من واجهة الإدارة لبدء المسابقة</p>
        </div>
      </motion.div>
    );
  }

  if (!hasStarted) {
    return (
      <QuizIntro
        welcomeMessage={quizSettings.welcomeMessage}
        readyMessage={quizSettings.readyMessage}
        onStart={() => {
          warmUpAudio();
          setHasStarted(true);
        }}
      />
    );
  }

  const timerPercent = (timeLeft / timeLimit) * 100;
  const timerUrgent = timeLeft <= 5 && gameState === 'waiting';

  if (gameState === 'finished') {
    const percentage = (score / questions.length) * 100;

    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-3xl mx-auto"
      >
        <motion.div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-slate-700/50 shadow-2xl">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block mb-6"
            >
              <RobotMW mood={score >= questions.length / 2 ? 'happy' : 'sad'} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Trophy className="text-yellow-500" size={40} />
                <h2 className="text-3xl md:text-5xl font-bold text-white">انتهت المسابقة!</h2>
              </div>

              <div className="bg-slate-900/50 rounded-2xl p-8 mb-6 border border-slate-700">
                <p className="text-slate-400 mb-2">نتيجتك النهائية</p>
                <motion.div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                    {score}
                  </span>
                  <span className="text-3xl text-slate-500">/</span>
                  <span className="text-3xl text-slate-400">{questions.length}</span>
                </motion.div>

                <div className="relative w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full rounded-full ${
                      percentage >= 80
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                        : percentage >= 50
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          : 'bg-gradient-to-r from-red-500 to-pink-500'
                    }`}
                  />
                </div>
                <p className="text-sm text-slate-500 mt-2">{percentage.toFixed(0)}% نسبة النجاح</p>
              </div>

              <div className="mb-8">
                {percentage === 100 && (
                  <div className="text-2xl md:text-3xl mb-2">🎉 ممتاز! إجابات صحيحة 100%</div>
                )}
                {percentage >= 80 && percentage < 100 && (
                  <div className="text-2xl md:text-3xl mb-2">👏 رائع! أداء ممتاز</div>
                )}
                {percentage >= 50 && percentage < 80 && (
                  <div className="text-2xl md:text-3xl mb-2">👍 جيد! واصل التحسن</div>
                )}
                {percentage < 50 && (
                  <div className="text-2xl md:text-3xl mb-2">💪 حاول مرة أخرى!</div>
                )}
                <p className="text-slate-400">
                  {percentage >= 80
                    ? 'أداء رائع! أنت تستحق التهنئة'
                    : percentage >= 50
                      ? 'يمكنك تحقيق نتيجة أفضل'
                      : 'لا تقلق، المحاولة القادمة ستكون أفضل'}
                </p>
              </div>

              <button
                onClick={restartGame}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2 mx-auto"
              >
                <RotateCcw size={20} />
                ابدأ من جديد
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-slate-700/50 shadow-2xl">
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-700">
              <span className="text-slate-400 text-sm">السؤال</span>
              <span className="text-white font-bold mx-1">{currentQuestionIndex + 1}</span>
              <span className="text-slate-500">/ {questions.length}</span>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              timerUrgent
                ? 'bg-red-500/20 border-red-500 animate-pulse'
                : 'bg-slate-900/50 border-slate-700'
            }`}
          >
            <Timer className={timerUrgent ? 'text-red-400' : 'text-cyan-400'} size={20} />
            <span className={`text-2xl font-bold tabular-nums ${timerUrgent ? 'text-red-400' : 'text-white'}`}>
              {timeLeft}
            </span>
            <span className="text-slate-500 text-sm">ث</span>
          </div>

          <div className="bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-sm ml-2">النقاط:</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
              {score}
            </span>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="relative w-full bg-slate-900/50 rounded-full h-2 mb-4 overflow-hidden">
          <motion.div
            className={`absolute top-0 right-0 h-full rounded-full transition-colors ${
              timerUrgent
                ? 'bg-gradient-to-l from-red-500 to-orange-500'
                : 'bg-gradient-to-l from-cyan-500 to-purple-500'
            }`}
            initial={false}
            animate={{ width: `${timerPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Progress Bar */}
        <div className="relative w-full bg-slate-900/50 rounded-full h-2 mb-8 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Robot Character */}
        <div className="flex justify-center mb-8">
          <RobotMW mood={gameState} />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-slate-900/30 rounded-2xl p-6 md:p-8 mb-8 border border-slate-700/50">
              <h2 className="text-2xl md:text-3xl text-white text-center leading-relaxed">
                {currentQuestion.question}
              </h2>
              {gameState === 'wrong' && selectedAnswer === null && (
                <p className="text-center text-red-400 mt-4 text-sm">انتهى الوقت!</p>
              )}
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                const showResult = gameState !== 'waiting';

                let buttonClass =
                  'relative p-5 md:p-6 rounded-2xl text-lg md:text-xl transition-all border-2 font-medium ';

                if (!showResult) {
                  buttonClass +=
                    'bg-slate-900/50 border-slate-700 hover:border-purple-500 hover:bg-slate-900/70 text-white';
                } else if (isCorrect) {
                  buttonClass +=
                    'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/20';
                } else if (isSelected && !isCorrect) {
                  buttonClass += 'bg-red-500/20 border-red-500 text-white shadow-lg shadow-red-500/20';
                } else {
                  buttonClass += 'bg-slate-900/30 border-slate-800 text-slate-600';
                }

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={gameState !== 'waiting'}
                    className={buttonClass}
                    whileHover={gameState === 'waiting' ? { scale: 1.02, y: -2 } : {}}
                    whileTap={gameState === 'waiting' ? { scale: 0.98 } : {}}
                  >
                    {showResult && isCorrect && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center"
                      >
                        ✓
                      </motion.div>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        ✗
                      </motion.div>
                    )}
                    {option}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
