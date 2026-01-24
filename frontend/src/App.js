import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import Card from './components/Card';
import Timer from './components/Timer';
import { Sparkles, Trophy, RotateCcw, Maximize, Minimize } from 'lucide-react';
import './App.css';

const CARD_IMAGES = [
  '/cards/ECD 2025 Elements-01.svg',
  '/cards/ECD 2025 Elements-02.svg',
  '/cards/ECD 2025 Elements-03.svg',
  '/cards/ECD 2025 Elements-04.svg',
  '/cards/ECD 2025 Elements-05.svg',
  '/cards/ECD 2025 Elements-06.svg',
  '/cards/ECD 2025 Elements-07.svg',
  '/cards/ECD 2025 Elements-08.svg',
  '/cards/ECD 2025 Elements-09.svg',
  '/cards/ECD 2025 Elements-10.svg',
  '/cards/ECD 2025 Elements-11.svg',
  '/cards/ECD 2025 Elements-12.svg',
  // Excluding Element-13 as it's empty/white
];

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

function App() {
  const [gameState, setGameState] = useState('start');
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [usedImages, setUsedImages] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [lives, setLives] = useState(3);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const getPairsForLevel = (currentLevel) => {
    return currentLevel + 1;
  };

  const initializeLevel = useCallback((currentLevel) => {
    const pairsNeeded = getPairsForLevel(currentLevel);
    const availableImages = CARD_IMAGES.filter((img) => !usedImages.includes(img));

    let imagesToUse;
    if (availableImages.length >= pairsNeeded) {
      imagesToUse = availableImages.slice(0, pairsNeeded);
    } else {
      imagesToUse = availableImages;
      const remaining = pairsNeeded - availableImages.length;
      const reusedImages = CARD_IMAGES.slice(0, remaining);
      imagesToUse = [...imagesToUse, ...reusedImages];
    }

    const newUsedImages = [...usedImages, ...imagesToUse.filter((img) => !usedImages.includes(img))];
    setUsedImages(newUsedImages);

    const cardPairs = imagesToUse.flatMap((image, index) => [
      { id: `${currentLevel}-${index}-a`, image, pairId: index },
      { id: `${currentLevel}-${index}-b`, image, pairId: index },
    ]);

    setCards(shuffleArray(cardPairs));
    setFlippedCards([]);
    setMatchedCards([]);
  }, [usedImages]);

  const startGame = () => {
    setGameState('playing');
    setLevel(1);
    setUsedImages([]);
    setTotalTime(0);
    setLives(3);
    initializeLevel(1);
  };

  const handleCardClick = (card) => {
    if (isChecking || flippedCards.length >= 2 || flippedCards.includes(card.id) || matchedCards.includes(card.id)) {
      return;
    }

    const newFlipped = [...flippedCards, card.id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard.pairId === secondCard.pairId) {
        setTimeout(() => {
          setMatchedCards([...matchedCards, firstId, secondId]);
          setFlippedCards([]);
          setIsChecking(false);
        }, 600);
      } else {
        // Wrong match - lose a life
        setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);
          const newLives = lives - 1;
          setLives(newLives);
          
          // Check if game over
          if (newLives <= 0) {
            setTimeout(() => {
              setGameState('gameOver');
            }, 500);
          }
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matchedCards.length > 0 && matchedCards.length === cards.length && gameState === 'playing') {
      // Trigger celebration animation
      setLevelComplete(true);
      
      if (usedImages.length >= CARD_IMAGES.length) {
        // All images used - go to victory
        setTimeout(() => {
          setGameState('victory');
          setShowConfetti(true);
          setLevelComplete(false);
        }, 1500);
      } else {
        // More levels to go - celebrate then advance
        setTimeout(() => {
          const nextLevel = level + 1;
          setLevel(nextLevel);
          setLevelComplete(false);
          setLives(3); // Reset lives for new level
          initializeLevel(nextLevel);
        }, 1800);
      }
    }
  }, [matchedCards, cards, level, gameState, usedImages, initializeLevel]);

  const resetGame = () => {
    setGameState('start');
    setLevel(1);
    setCards([]);
    setFlippedCards([]);
    setMatchedCards([]);
    setUsedImages([]);
    setTotalTime(0);
    setShowConfetti(false);
    setLives(3);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  const getGridClass = () => {
    const pairCount = getPairsForLevel(level);
    const totalCards = pairCount * 2;
    
    if (totalCards <= 4) {
      return 'grid-cols-2 sm:grid-cols-4 max-w-3xl';
    }
    if (totalCards <= 6) {
      return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 max-w-4xl';
    }
    if (totalCards <= 8) {
      return 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 max-w-7xl';
    }
    if (totalCards <= 12) {
      return 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 max-w-7xl';
    }
    return 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 max-w-[90rem]';
  };

  const ColorfulTitle = ({ size = 'large', floating = true }) => {
    const isLarge = size === 'large';
    return (
      <motion.div
        className={isLarge ? "mb-4 lg:mb-8" : "mb-2"}
        animate={floating ? { 
          y: [0, -12, 0],
        } : {}}
        transition={floating ? { 
          repeat: Infinity, 
          duration: 4,
          ease: [0.45, 0.05, 0.55, 0.95], // Smoother, more gentle ease
        } : {}}
      >
        <h1 className={`${isLarge ? 'text-3xl sm:text-5xl lg:text-6xl xl:text-7xl' : 'text-2xl sm:text-4xl lg:text-5xl'} font-black mb-2 font-['Fredoka'] leading-tight flex flex-wrap justify-center items-center gap-2 sm:gap-3 ${isLarge ? 'lg:gap-4' : ''}`}>
          <motion.span 
            className="inline-block bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent"
            animate={floating ? { rotate: [-2, 2, -2] } : {}}
            transition={floating ? { repeat: Infinity, duration: 1.5 } : {}}
          >
            THE
          </motion.span>
          <motion.span 
            className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent"
            animate={floating ? { rotate: [2, -2, 2] } : {}}
            transition={floating ? { repeat: Infinity, duration: 1.8 } : {}}
          >
            MEMORY
          </motion.span>
          <motion.span 
            className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent"
            animate={floating ? { rotate: [-2, 2, -2] } : {}}
            transition={floating ? { repeat: Infinity, duration: 1.6 } : {}}
          >
            MATCH
          </motion.span>
          <motion.span 
            className="inline-block bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent"
            animate={floating ? { rotate: [2, -2, 2] } : {}}
            transition={floating ? { repeat: Infinity, duration: 2 } : {}}
          >
            GAME
          </motion.span>
          <motion.span
            animate={floating ? { 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            } : {}}
            transition={floating ? { 
              repeat: Infinity, 
              duration: 3,
              ease: "easeInOut"
            } : {}}
          >
            <Sparkles className={`inline ${isLarge ? 'w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14' : 'w-6 h-6 sm:w-8 sm:h-8'} text-pink-400`} />
          </motion.span>
        </h1>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 relative">
      {/* Fullscreen Toggle Button */}
      <motion.button
        data-testid="fullscreen-toggle"
        onClick={toggleFullscreen}
        className="fixed top-4 right-4 z-50 bg-white p-3 sm:p-4 rounded-full shadow-lg border-4 border-purple-300 hover:bg-purple-50 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isFullscreen ? (
          <Minimize className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
        ) : (
          <Maximize className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
        )}
      </motion.button>

      <AnimatePresence mode="wait">
        {gameState === 'start' && (
          <motion.div
            key="start"
            data-testid="start-screen"
            className="text-center max-w-5xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ColorfulTitle size="large" />

            <motion.div
              className="bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border-4 sm:border-8 border-white mb-4 sm:mb-6 lg:mb-8 relative overflow-hidden"
              initial={{ scale: 0.9, rotate: -2 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-yellow-300 rounded-full opacity-30 -mr-10 -mt-10 sm:-mr-16 sm:-mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-40 sm:h-40 bg-pink-300 rounded-full opacity-30 -ml-12 -mb-12 sm:-ml-20 sm:-mb-20"></div>
              
              <motion.h2 
                className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 sm:mb-4 lg:mb-6 flex items-center justify-center gap-2 lg:gap-3 font-['Fredoka']"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Trophy className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-yellow-500 drop-shadow-lg" />
                </motion.span>
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                  HOW TO PLAY
                </span>
              </motion.h2>
              
              <div className="space-y-2 sm:space-y-3 lg:space-y-4 max-w-3xl mx-auto relative z-10">
                <motion.div 
                  className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 lg:p-4 shadow-lg border-2 sm:border-4 border-blue-300"
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                    <motion.div
                      className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-xl sm:text-2xl lg:text-3xl shadow-lg"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      🎯
                    </motion.div>
                    <p className="text-left text-sm sm:text-base lg:text-lg font-bold text-slate-800 leading-tight flex-1">
                      Click cards to flip and find matching pairs!
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 lg:p-4 shadow-lg border-2 sm:border-4 border-green-300"
                  whileHover={{ scale: 1.02, rotate: -1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                    <motion.div
                      className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-red-400 to-pink-600 rounded-full flex items-center justify-center text-xl sm:text-2xl lg:text-3xl shadow-lg"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ❤️
                    </motion.div>
                    <p className="text-left text-sm sm:text-base lg:text-lg font-bold text-slate-800 leading-tight flex-1">
                      You have 3 lives - don't make 3 mistakes!
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 lg:p-4 shadow-lg border-2 sm:border-4 border-yellow-300"
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                    <motion.div
                      className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-xl sm:text-2xl lg:text-3xl shadow-lg"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ⏱️
                    </motion.div>
                    <p className="text-left text-sm sm:text-base lg:text-lg font-bold text-slate-800 leading-tight flex-1">
                      Beat the clock and finish fast!
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 lg:p-4 shadow-lg border-2 sm:border-4 border-purple-300"
                  whileHover={{ scale: 1.02, rotate: -1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                    <motion.div
                      className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-xl sm:text-2xl lg:text-3xl shadow-lg"
                      animate={{ 
                        rotate: [0, -10, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🏆
                    </motion.div>
                    <p className="text-left text-sm sm:text-base lg:text-lg font-bold text-slate-800 leading-tight flex-1">
                      Complete all levels to become a champion!
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.button
              data-testid="start-game-button"
              onClick={startGame}
              className="px-8 sm:px-12 lg:px-16 py-4 sm:py-6 lg:py-8 text-xl sm:text-2xl lg:text-4xl font-black rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-white hover:from-purple-300 hover:to-cyan-300 border-b-4 sm:border-b-8 border-purple-700 shadow-[0_6px_0_rgb(126,34,206)] sm:shadow-[0_8px_0_rgb(126,34,206)] lg:shadow-[0_12px_0_rgb(126,34,206)] active:shadow-none active:translate-y-2 transition-all uppercase tracking-wide"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: [
                  '0 10px 40px rgba(167, 139, 250, 0.5)',
                  '0 10px 60px rgba(236, 72, 153, 0.5)',
                  '0 10px 40px rgba(103, 232, 249, 0.5)',
                  '0 10px 40px rgba(167, 139, 250, 0.5)'
                ]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              Start Game! 🚀
            </motion.button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            key="playing"
            data-testid="game-screen"
            className="w-full max-w-[95vw] mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Title on game screen */}
            <div className="text-center mb-3 sm:mb-4">
              <ColorfulTitle size="small" floating={false} />
            </div>

            <div className="flex flex-wrap justify-center items-center mb-4 sm:mb-6 lg:mb-8 gap-3 sm:gap-4 lg:gap-6">
              <motion.div
                className="bg-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full border-4 border-blue-300 shadow-lg"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <span className="text-xl sm:text-2xl lg:text-4xl font-black text-blue-600">Level {level}</span>
              </motion.div>

              {/* Lives Display */}
              <motion.div
                data-testid="lives-display"
                className="bg-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full border-4 border-red-300 shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <div className="flex items-center gap-2">
                  {[...Array(3)].map((_, index) => (
                    <motion.span
                      key={index}
                      className="text-2xl sm:text-3xl lg:text-5xl"
                      animate={index >= lives ? { 
                        scale: [1, 0.5],
                        opacity: [1, 0.3],
                        filter: ['grayscale(0%)', 'grayscale(100%)']
                      } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {index < lives ? '❤️' : '🖤'}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              <Timer isRunning={gameState === 'playing'} onTimeUpdate={setTotalTime} />

              <motion.button
                data-testid="reset-game-button"
                onClick={resetGame}
                className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-base sm:text-lg lg:text-2xl font-bold rounded-full bg-red-400 text-white hover:bg-red-300 border-b-4 border-red-600 shadow-lg active:shadow-none active:translate-y-1 transition-all flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                Reset
              </motion.button>
            </div>

            <motion.div
              data-testid="game-board"
              className={`grid ${getGridClass()} gap-2 sm:gap-4 lg:gap-6 mx-auto`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {cards.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  isFlipped={flippedCards.includes(card.id)}
                  isMatched={matchedCards.includes(card.id)}
                  onClick={() => handleCardClick(card)}
                  celebrationMode={levelComplete}
                />
              ))}
            </motion.div>
            
            {/* Level Complete Celebration Overlay */}
            {levelComplete && (
              <motion.div
                className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="text-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: [0, 1.2, 1], rotate: 0 }}
                  transition={{ duration: 0.6, ease: "backOut" }}
                >
                  <motion.div
                    className="text-6xl sm:text-8xl lg:text-9xl font-black font-['Fredoka'] bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [-5, 5, -5, 5, 0]
                    }}
                    transition={{ 
                      duration: 0.5,
                      repeat: 2
                    }}
                  >
                    LEVEL {level}
                  </motion.div>
                  <motion.div
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold text-green-500"
                    animate={{ 
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 0.4,
                      repeat: 3,
                      delay: 0.2
                    }}
                  >
                    ✓ COMPLETE! 🎉
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}

        {gameState === 'victory' && (
          <motion.div
            key="victory"
            data-testid="victory-screen"
            className="text-center max-w-5xl mx-auto relative z-10 px-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {showConfetti && (
              <Confetti
                width={windowSize.width}
                height={windowSize.height}
                recycle={false}
                numberOfPieces={800}
                gravity={0.25}
                colors={['#FF6B9D', '#FFA500', '#FFD93D', '#6BCF7F', '#4ECDC4', '#95E1D3', '#A8E6CF', '#C7CEEA', '#F38BA3', '#FF9A76']}
              />
            )}

            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Trophy className="w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 text-yellow-400 mx-auto mb-4 lg:mb-8 drop-shadow-2xl filter drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]" />
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-6xl lg:text-8xl font-black mb-4 lg:mb-8 font-['Fredoka']"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <motion.span 
                className="inline-block bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0%', '100%', '0%']
                }}
              >
                🎉 CONGRATULATIONS! 🎉
              </motion.span>
            </motion.h1>

            <motion.div
              className="bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100 rounded-3xl p-6 sm:p-10 lg:p-16 shadow-2xl border-8 border-white mb-6 lg:mb-10 relative overflow-hidden"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Decorative circles matching the How to Play design */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 rounded-full opacity-30 -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-300 rounded-full opacity-30 -ml-20 -mb-20"></div>
              
              <motion.p 
                className="text-2xl sm:text-4xl lg:text-6xl font-black mb-3 lg:mb-6 relative z-10"
                animate={{ 
                  color: ['#FF6B9D', '#FFD93D', '#6BCF7F', '#4ECDC4', '#FF6B9D']
                }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                YOU'RE A CHAMPION! 🏆
              </motion.p>
              <p className="text-xl sm:text-2xl lg:text-4xl font-bold text-slate-700 mb-3 lg:mb-6 relative z-10">
                All levels completed! ⭐⭐⭐
              </p>
              <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 border-4 border-cyan-300 shadow-lg relative z-10">
                <p className="text-lg sm:text-xl lg:text-3xl text-slate-600 mb-2">
                  Your Time: 
                </p>
                <motion.p 
                  className="text-3xl sm:text-4xl lg:text-6xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                >
                  {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
                </motion.p>
              </div>
              <p className="text-lg sm:text-xl lg:text-3xl text-slate-600 font-bold relative z-10">
                You're a Memory Master! 🧠✨
              </p>
            </motion.div>

            <motion.button
              data-testid="play-again-button"
              onClick={resetGame}
              className="px-8 sm:px-12 lg:px-20 py-4 sm:py-6 lg:py-10 text-xl sm:text-3xl lg:text-5xl font-black rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 text-white hover:from-pink-300 hover:to-cyan-300 border-b-4 sm:border-b-8 border-purple-700 shadow-[0_6px_0_rgb(126,34,206)] sm:shadow-[0_10px_0_rgb(126,34,206)] lg:shadow-[0_16px_0_rgb(126,34,206)] active:shadow-none active:translate-y-3 transition-all uppercase tracking-wide"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: [
                  '0 10px 40px rgba(236, 72, 153, 0.5)',
                  '0 10px 60px rgba(167, 139, 250, 0.5)',
                  '0 10px 40px rgba(103, 232, 249, 0.5)',
                  '0 10px 40px rgba(236, 72, 153, 0.5)'
                ]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              🎮 PLAY AGAIN! 🎮
            </motion.button>
          </motion.div>
        )}

        {gameState === 'gameOver' && (
          <motion.div
            key="gameOver"
            data-testid="game-over-screen"
            className="text-center max-w-5xl mx-auto relative z-10 px-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="text-8xl sm:text-9xl lg:text-[12rem] mb-4 lg:mb-8">
                💔
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-6xl lg:text-8xl font-black mb-4 lg:mb-8 font-['Fredoka']"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <motion.span 
                className="inline-block bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent"
              >
                GAME OVER!
              </motion.span>
            </motion.h1>

            <motion.div
              className="bg-gradient-to-br from-purple-100 via-pink-100 to-cyan-100 rounded-3xl p-6 sm:p-10 lg:p-16 shadow-2xl border-8 border-white mb-6 lg:mb-10 relative overflow-hidden"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Decorative circles matching the victory screen */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 rounded-full opacity-30 -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-300 rounded-full opacity-30 -ml-20 -mb-20"></div>
              
              <p className="text-2xl sm:text-3xl lg:text-5xl font-bold text-slate-700 mb-3 lg:mb-6 relative z-10">
                You ran out of lives! 😢
              </p>
              <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 border-4 border-purple-300 shadow-lg relative z-10">
                <p className="text-lg sm:text-xl lg:text-3xl text-slate-600 mb-2">
                  Reached Level: 
                </p>
                <motion.p 
                  className="text-3xl sm:text-4xl lg:text-6xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
                >
                  {level}
                </motion.p>
              </div>
              <p className="text-lg sm:text-xl lg:text-3xl text-slate-600 font-bold relative z-10">
                Don't give up! Try again! 💪
              </p>
            </motion.div>

            <motion.button
              data-testid="try-again-button"
              onClick={resetGame}
              className="px-8 sm:px-12 lg:px-20 py-4 sm:py-6 lg:py-10 text-xl sm:text-3xl lg:text-5xl font-black rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 text-white hover:from-purple-300 hover:to-cyan-300 border-b-4 sm:border-b-8 border-purple-700 shadow-[0_6px_0_rgb(126,34,206)] sm:shadow-[0_10px_0_rgb(126,34,206)] lg:shadow-[0_16px_0_rgb(126,34,206)] active:shadow-none active:translate-y-3 transition-all uppercase tracking-wide"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: [
                  '0 10px 40px rgba(167, 139, 250, 0.5)',
                  '0 10px 60px rgba(236, 72, 153, 0.5)',
                  '0 10px 40px rgba(103, 232, 249, 0.5)',
                  '0 10px 40px rgba(167, 139, 250, 0.5)'
                ]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              🔄 TRY AGAIN! 🔄
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
