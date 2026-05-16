import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Star } from 'lucide-react';

type RobotMWProps = {
  mood: 'waiting' | 'correct' | 'wrong' | 'happy' | 'sad';
};

export default function RobotMW({ mood }: RobotMWProps) {
  return (
    <div className="relative inline-block">
      {/* Floating Elements */}
      <AnimatePresence>
        {(mood === 'waiting' || mood === 'correct' || mood === 'happy') && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0.3, 1, 0.3],
                y: [-20, -40, -20],
                x: [-10, -15, -10]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-8 left-4"
            >
              <Star className="text-yellow-300 fill-yellow-300" size={16} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0.3, 1, 0.3],
                y: [-20, -40, -20],
                x: [10, 15, 10]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute -top-12 right-8"
            >
              <Sparkles className="text-pink-300 fill-pink-300" size={14} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0.3, 1, 0.3],
                y: [-15, -30, -15],
                x: [5, 0, 5]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="absolute -top-6 right-2"
            >
              <Star className="text-purple-300 fill-purple-300" size={12} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Character Container */}
      <motion.div
        animate={
          mood === 'waiting'
            ? { y: [0, -12, 0] }
            : mood === 'correct' || mood === 'happy'
            ? {
                y: [0, -15, -5, -15, 0],
                rotate: [0, -5, 5, -5, 0]
              }
            : mood === 'wrong' || mood === 'sad'
            ? {
                x: [-3, 3, -3, 3, 0],
                rotate: [0, -2, 2, -2, 0]
              }
            : {}
        }
        transition={{
          duration: mood === 'waiting' ? 1.5 : 0.8,
          repeat: (mood === 'waiting' || mood === 'correct' || mood === 'happy') ? Infinity : 2,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        {/* Soft Glow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute -inset-8 rounded-full blur-3xl ${
            mood === 'correct' || mood === 'happy'
              ? 'bg-pink-300'
              : mood === 'wrong' || mood === 'sad'
              ? 'bg-blue-300'
              : 'bg-purple-300'
          }`}
        />

        <div className="relative z-10">
          {/* Cute Antenna with Ball */}
          <div className="flex justify-center mb-2">
            <motion.div
              animate={{
                rotate: mood === 'correct' ? [0, -15, 15, -15, 15, 0] : 0,
              }}
              transition={{ duration: 0.5, repeat: mood === 'correct' ? Infinity : 0 }}
              className="relative"
            >
              <div className="w-0.5 h-12 bg-gradient-to-b from-pink-400 to-transparent mx-auto" />
              <motion.div
                animate={{
                  scale: mood === 'correct' ? [1, 1.4, 1] : mood === 'waiting' ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: mood === 'correct' ? 0.5 : 1.5,
                  repeat: Infinity
                }}
                className={`absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full ${
                  mood === 'correct' || mood === 'happy'
                    ? 'bg-gradient-to-br from-yellow-300 to-pink-400'
                    : mood === 'wrong' || mood === 'sad'
                    ? 'bg-gradient-to-br from-blue-300 to-purple-400'
                    : 'bg-gradient-to-br from-pink-300 to-purple-400'
                } shadow-lg`}
              >
                <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-80" />
              </motion.div>
            </motion.div>
          </div>

          {/* Head */}
          <div className="relative w-40 h-40 md:w-48 md:h-48">
            {/* Main Face Circle */}
            <div className={`absolute inset-0 rounded-full ${
              mood === 'correct' || mood === 'happy'
                ? 'bg-gradient-to-br from-pink-100 to-pink-200'
                : mood === 'wrong' || mood === 'sad'
                ? 'bg-gradient-to-br from-blue-100 to-purple-100'
                : 'bg-gradient-to-br from-purple-100 to-pink-100'
            } shadow-2xl`}>
              {/* Shine Effect */}
              <div className="absolute top-4 left-4 w-20 h-20 bg-white rounded-full opacity-30 blur-2xl" />
            </div>

            {/* Cute Ears */}
            <motion.div
              animate={{
                rotate: mood === 'correct' ? [0, -10, 0] : 0,
              }}
              transition={{ duration: 0.5, repeat: mood === 'correct' ? Infinity : 0 }}
              className={`absolute -left-6 top-12 w-12 h-16 rounded-full ${
                mood === 'correct' || mood === 'happy'
                  ? 'bg-gradient-to-br from-pink-200 to-pink-300'
                  : mood === 'wrong' || mood === 'sad'
                  ? 'bg-gradient-to-br from-blue-200 to-purple-200'
                  : 'bg-gradient-to-br from-purple-200 to-pink-200'
              } shadow-lg`}
            >
              <div className="absolute inset-2 rounded-full bg-pink-50 opacity-50" />
            </motion.div>
            <motion.div
              animate={{
                rotate: mood === 'correct' ? [0, 10, 0] : 0,
              }}
              transition={{ duration: 0.5, repeat: mood === 'correct' ? Infinity : 0 }}
              className={`absolute -right-6 top-12 w-12 h-16 rounded-full ${
                mood === 'correct' || mood === 'happy'
                  ? 'bg-gradient-to-br from-pink-200 to-pink-300'
                  : mood === 'wrong' || mood === 'sad'
                  ? 'bg-gradient-to-br from-blue-200 to-purple-200'
                  : 'bg-gradient-to-br from-purple-200 to-pink-200'
              } shadow-lg`}
            >
              <div className="absolute inset-2 rounded-full bg-pink-50 opacity-50" />
            </motion.div>

            {/* Face Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Eyes */}
              <div className="flex items-end gap-8 mb-3 mt-8">
                {/* Left Eye */}
                <motion.div
                  animate={{
                    scaleY: mood === 'wrong' || mood === 'sad' ? 0.3 : 1,
                  }}
                  className="relative"
                >
                  <div className={`w-10 h-12 rounded-full ${
                    mood === 'correct' || mood === 'happy'
                      ? 'bg-gradient-to-b from-pink-800 to-pink-900'
                      : mood === 'wrong' || mood === 'sad'
                      ? 'bg-gradient-to-b from-blue-800 to-blue-900'
                      : 'bg-gradient-to-b from-purple-800 to-purple-900'
                  }`}>
                    {/* Eye Shine - Large */}
                    <motion.div
                      animate={{
                        scale: mood === 'correct' ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.5, repeat: mood === 'correct' ? Infinity : 0 }}
                      className="absolute top-1.5 left-2 w-4 h-4 bg-white rounded-full"
                    />
                    {/* Eye Shine - Small */}
                    <div className="absolute bottom-2 right-1.5 w-2 h-2 bg-white rounded-full opacity-70" />
                  </div>
                </motion.div>

                {/* Right Eye */}
                <motion.div
                  animate={{
                    scaleY: mood === 'wrong' || mood === 'sad' ? 0.3 : 1,
                  }}
                  className="relative"
                >
                  <div className={`w-10 h-12 rounded-full ${
                    mood === 'correct' || mood === 'happy'
                      ? 'bg-gradient-to-b from-pink-800 to-pink-900'
                      : mood === 'wrong' || mood === 'sad'
                      ? 'bg-gradient-to-b from-blue-800 to-blue-900'
                      : 'bg-gradient-to-b from-purple-800 to-purple-900'
                  }`}>
                    {/* Eye Shine - Large */}
                    <motion.div
                      animate={{
                        scale: mood === 'correct' ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.5, repeat: mood === 'correct' ? Infinity : 0 }}
                      className="absolute top-1.5 left-2 w-4 h-4 bg-white rounded-full"
                    />
                    {/* Eye Shine - Small */}
                    <div className="absolute bottom-2 right-1.5 w-2 h-2 bg-white rounded-full opacity-70" />
                  </div>
                </motion.div>
              </div>

              {/* Blush Marks */}
              <div className="absolute top-20 left-0 right-0 flex justify-between px-2">
                <motion.div
                  animate={{
                    scale: (mood === 'correct' || mood === 'happy') ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.5, repeat: (mood === 'correct' || mood === 'happy') ? Infinity : 0 }}
                  className="w-8 h-5 rounded-full bg-pink-300 opacity-60"
                />
                <motion.div
                  animate={{
                    scale: (mood === 'correct' || mood === 'happy') ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.5, repeat: (mood === 'correct' || mood === 'happy') ? Infinity : 0 }}
                  className="w-8 h-5 rounded-full bg-pink-300 opacity-60"
                />
              </div>

              {/* Mouth */}
              <div className="mt-2">
                <AnimatePresence mode="wait">
                  {mood === 'correct' || mood === 'happy' ? (
                    <motion.div
                      key="happy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="relative"
                    >
                      {/* Happy Mouth */}
                      <div className="w-16 h-8 border-4 border-pink-700 border-t-0 rounded-b-full" />
                      {/* Tongue */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-3 bg-pink-400 rounded-b-full" />
                    </motion.div>
                  ) : mood === 'wrong' || mood === 'sad' ? (
                    <motion.div
                      key="sad"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <div className="w-14 h-7 border-4 border-blue-700 border-b-0 rounded-t-full" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="neutral"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-1"
                    >
                      <div className="w-2 h-2 bg-pink-700 rounded-full" />
                      <div className="w-2 h-2 bg-pink-700 rounded-full" />
                      <div className="w-2 h-2 bg-pink-700 rounded-full" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Body - Dress Shape */}
          <motion.div
            className="relative -mt-4"
            animate={{
              scale: mood === 'correct' ? [1, 1.05, 1] : 1,
            }}
            transition={{ duration: 0.5, repeat: mood === 'correct' ? Infinity : 0 }}
          >
            <div className={`w-44 h-28 rounded-t-3xl rounded-b-full ${
              mood === 'correct' || mood === 'happy'
                ? 'bg-gradient-to-b from-pink-200 via-pink-300 to-pink-400'
                : mood === 'wrong' || mood === 'sad'
                ? 'bg-gradient-to-b from-blue-200 via-purple-200 to-purple-300'
                : 'bg-gradient-to-b from-purple-200 via-pink-200 to-pink-300'
            } mx-auto shadow-xl relative overflow-hidden`}>
              {/* Body Shine */}
              <div className="absolute top-2 left-4 right-4 h-8 bg-white rounded-full opacity-20 blur-xl" />

              {/* Heart/Icon in Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {mood === 'correct' || mood === 'happy' ? (
                    <motion.div
                      key="heart"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ type: 'spring', duration: 0.6 }}
                    >
                      <Heart className="text-pink-600 fill-pink-600" size={32} />
                    </motion.div>
                  ) : mood === 'wrong' || mood === 'sad' ? (
                    <motion.div
                      key="broken"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="text-4xl"
                    >
                      💧
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sparkle"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="text-purple-500 fill-purple-400" size={28} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Decorative Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <div className="w-2 h-2 bg-white rounded-full opacity-40" />
                <div className="w-2 h-2 bg-white rounded-full opacity-40" />
                <div className="w-2 h-2 bg-white rounded-full opacity-40" />
              </div>
            </div>

            {/* Cute Little Arms */}
            <motion.div
              animate={{
                rotate: mood === 'correct' || mood === 'happy' ? [0, -25, 0] : 0,
              }}
              transition={{ duration: 0.4, repeat: (mood === 'correct' || mood === 'happy') ? Infinity : 0 }}
              className={`absolute -left-8 top-6 w-6 h-20 rounded-full ${
                mood === 'correct' || mood === 'happy'
                  ? 'bg-gradient-to-b from-pink-200 to-pink-300'
                  : mood === 'wrong' || mood === 'sad'
                  ? 'bg-gradient-to-b from-blue-200 to-purple-200'
                  : 'bg-gradient-to-b from-purple-200 to-pink-200'
              } origin-top shadow-lg`}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-7 bg-pink-100 rounded-full shadow" />
            </motion.div>
            <motion.div
              animate={{
                rotate: mood === 'correct' || mood === 'happy' ? [0, 25, 0] : 0,
              }}
              transition={{ duration: 0.4, repeat: (mood === 'correct' || mood === 'happy') ? Infinity : 0 }}
              className={`absolute -right-8 top-6 w-6 h-20 rounded-full ${
                mood === 'correct' || mood === 'happy'
                  ? 'bg-gradient-to-b from-pink-200 to-pink-300'
                  : mood === 'wrong' || mood === 'sad'
                  ? 'bg-gradient-to-b from-blue-200 to-purple-200'
                  : 'bg-gradient-to-b from-purple-200 to-pink-200'
              } origin-top shadow-lg`}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-7 bg-pink-100 rounded-full shadow" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Name Badge - Kawaii Style */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`mt-6 px-8 py-3 rounded-full shadow-2xl ${
          mood === 'correct' || mood === 'happy'
            ? 'bg-gradient-to-r from-pink-200 to-pink-300'
            : mood === 'wrong' || mood === 'sad'
            ? 'bg-gradient-to-r from-blue-200 to-purple-200'
            : 'bg-gradient-to-r from-purple-200 to-pink-200'
        }`}
      >
        <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          MW ✨
        </span>
      </motion.div>

      {/* Floating Reaction Icons */}
      <AnimatePresence>
        {mood === 'correct' && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0.8],
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, -Math.random() * 80 - 40],
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, delay: i * 0.1 }}
                className="absolute top-1/2 left-1/2 pointer-events-none"
              >
                {i % 3 === 0 ? (
                  <Heart className="text-pink-400 fill-pink-400" size={20} />
                ) : i % 3 === 1 ? (
                  <Star className="text-yellow-400 fill-yellow-400" size={18} />
                ) : (
                  <Sparkles className="text-purple-400 fill-purple-400" size={16} />
                )}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
