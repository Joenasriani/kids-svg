import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer as TimerIcon } from 'lucide-react';

const Timer = ({ isRunning, onTimeUpdate }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          return newTime;
        });
      }, 1000);
    } else {
      setTime(0);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (onTimeUpdate && isRunning) {
      onTimeUpdate(time);
    }
  }, [time, onTimeUpdate, isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      data-testid="game-timer"
      className="bg-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full border-4 border-orange-300 text-xl sm:text-2xl lg:text-4xl font-mono font-bold text-orange-500 shadow-lg flex items-center gap-2"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <TimerIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-10 lg:h-10" />
      {formatTime(time)}
    </motion.div>
  );
};

export default Timer;
