import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ card, isFlipped, isMatched, onClick, celebrationMode }) => {
  return (
    <motion.div
      data-testid={`card-${card.id}`}
      className="relative w-full aspect-[3/4] cursor-pointer perspective-1000 max-w-[200px] sm:max-w-[180px] lg:max-w-[220px] xl:max-w-[200px] mx-auto"
      onClick={onClick}
      whileHover={!isFlipped && !isMatched ? { scale: 1.05 } : {}}
      whileTap={!isFlipped && !isMatched ? { scale: 0.95 } : {}}
      animate={celebrationMode && isMatched ? {
        scale: [1, 1.15, 1.05, 1.15, 1],
        rotate: [0, -5, 5, -5, 0],
        y: [0, -20, -10, -20, 0],
      } : {}}
      transition={celebrationMode && isMatched ? {
        duration: 0.8,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.7, 1]
      } : {}}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped || isMatched ? 'flipped' : ''
        }`}
      >
        {/* Back of card */}
        <div className="absolute inset-0 backface-hidden bg-sky-400 border-4 border-sky-200 rounded-2xl flex items-center justify-center shadow-lg pattern-dots">
          <div className="text-4xl sm:text-5xl lg:text-6xl text-white font-black">?</div>
        </div>

        {/* Front of card */}
        <motion.div 
          className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2"
          animate={celebrationMode && isMatched ? {
            borderColor: ['#bae6fd', '#fbbf24', '#34d399', '#f472b6', '#bae6fd'],
            borderWidth: ['4px', '6px', '4px']
          } : {}}
          transition={celebrationMode && isMatched ? {
            duration: 0.6,
            repeat: 2
          } : {}}
          style={{
            borderStyle: 'solid',
            borderColor: '#bae6fd',
            borderWidth: '4px'
          }}
        >
          <img
            src={card.image}
            alt="card"
            className="w-full h-full object-contain"
          />
        </motion.div>
      </div>
      
      {/* Sparkle effect on celebration */}
      {celebrationMode && isMatched && (
        <>
          <motion.div
            className="absolute -top-2 -right-2 text-2xl"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1.5, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            ⭐
          </motion.div>
          <motion.div
            className="absolute -bottom-2 -left-2 text-2xl"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1.5, 0], rotate: [0, -180, -360] }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            ✨
          </motion.div>
          <motion.div
            className="absolute -top-2 -left-2 text-2xl"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 0] }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            🌟
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Card;
