import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import RobotMW from './RobotMW';
import { Play, ChevronLeft } from 'lucide-react';
import { playIntroSpeech, stopIntroSpeech, unlockIntroAudio } from '../utils/introAudio';
import { warmUpAudio } from '../utils/quizSounds';
import { startBackgroundMusic } from '../utils/backgroundMusic';

type QuizIntroProps = {
  welcomeMessage: string;
  readyMessage: string;
  onStart: () => void;
};

type IntroStep = 'idle' | 'welcome' | 'ready';

export default function QuizIntro({ welcomeMessage, readyMessage, onStart }: QuizIntroProps) {
  const [step, setStep] = useState<IntroStep>('idle');
  const [displayedText, setDisplayedText] = useState('');

  const fullText = step === 'welcome' ? welcomeMessage : step === 'ready' ? readyMessage : '';

  useEffect(() => {
    if (step !== 'welcome' && step !== 'ready') {
      setDisplayedText('');
      return;
    }

    setDisplayedText('');
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setDisplayedText(fullText.slice(0, index));
      if (index >= fullText.length) clearInterval(interval);
    }, 45);

    return () => clearInterval(interval);
  }, [step, fullText]);

  useEffect(() => () => stopIntroSpeech(), []);

  return (
    <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 md:p-8 border border-slate-700/50 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <RobotMW mood={step === 'ready' ? 'happy' : 'waiting'} size="sm" />

          <AnimatePresence mode="wait">
            {step === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-10 text-center w-full"
              >
                <p className="text-slate-400 mb-6">اضغطي للبدء مع MW</p>
                <button
                  onClick={() => {
                    warmUpAudio();
                    unlockIntroAudio();
                    void startBackgroundMusic();
                    setStep('welcome');
                    void playIntroSpeech(welcomeMessage, 'welcome');
                  }}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-12 py-4 rounded-2xl text-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-3 mx-auto"
                >
                  <Play size={24} />
                  بدا
                </button>
              </motion.div>
            )}

            {(step === 'welcome' || step === 'ready') && (
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-8 w-full"
              >
                <motion.div className="relative bg-slate-900/60 border border-purple-500/30 rounded-2xl p-6 md:p-8 shadow-lg">
                  <div className="absolute -top-3 right-8 w-6 h-6 bg-slate-900/60 border-l border-t border-purple-500/30 rotate-45" />
                  <p className="text-xl md:text-2xl text-white text-center leading-relaxed min-h-[3rem]">
                    {displayedText}
                    {displayedText.length < fullText.length && (
                      <span className="inline-block w-0.5 h-6 bg-cyan-400 mr-1 animate-pulse align-middle" />
                    )}
                  </p>
                </motion.div>

                {displayedText.length >= fullText.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex justify-center"
                  >
                    {step === 'welcome' ? (
                      <button
                        onClick={() => {
                          stopIntroSpeech();
                          setStep('ready');
                          void playIntroSpeech(readyMessage, 'ready');
                        }}
                        className="text-slate-300 hover:text-white px-6 py-3 rounded-xl border border-slate-600 hover:border-purple-500 transition-all flex items-center gap-2"
                      >
                        التالي
                        <ChevronLeft size={20} />
                      </button>
                    ) : (
                      <button
                        onClick={onStart}
                        className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-12 py-4 rounded-2xl text-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                      >
                        بدء المسابقة
                      </button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
