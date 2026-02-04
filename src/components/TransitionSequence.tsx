import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TransitionSequence.css';

interface TransitionSequenceProps {
  onComplete: () => void;
  onStarsStart?: () => void;
}

type Phase = 
  | 'dark' 
  | 'lights-out-text' 
  | 'flash-white' 
  | 'too-much' 
  | 'subtitle' 
  | 'back-to-dark' 
  | 'better-text' 
  | 'stars' 
  | 'done';

const TypewriterText = ({
  text,
  onComplete,
  speed = 55
}: {
  text: string;
  onComplete?: () => void;
  speed?: number;
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    let isActive = true;

    const pauseChars = new Set([',', '.', '?', '!', ':', ';']);
    const slowdownChars = new Set(['a', 'e', 'i', 'o', 'u', 't', 'h']);

    const typeNext = () => {
      if (!isActive) return;

      if (index < text.length) {
        const nextChar = text[index];
        const prevChar = index > 0 ? text[index - 1] : '';
        const isPause = pauseChars.has(nextChar);
        const isSpace = nextChar === ' ';
        const isSlowChar = slowdownChars.has(nextChar.toLowerCase());
        
        // Base jitter
        let jitter = Math.floor(Math.random() * 30);
        
        // Calculate delay based on character type
        let delay = speed + jitter;
        
        if (isPause) {
          // Long pause after punctuation
          delay = 280 + Math.floor(Math.random() * 180);
        } else if (isSpace) {
          // Slight pause between words, sometimes longer (thinking)
          const thinkingPause = Math.random() < 0.15;
          delay = thinkingPause ? 200 + Math.floor(Math.random() * 250) : speed + jitter;
        } else if (isSlowChar) {
          // Slower on common characters for realism
          delay = speed + 15 + jitter;
        }
        
        // Random "stutter" - occasionally type faster then slow down
        if (Math.random() < 0.08) {
          delay = Math.floor(delay * 0.4); // Quick burst
        } else if (Math.random() < 0.05) {
          delay = delay + Math.floor(Math.random() * 120); // Random hesitation
        }
        
        // After punctuation followed by space, extra pause
        if (pauseChars.has(prevChar) && isSpace) {
          delay = 150 + Math.floor(Math.random() * 100);
        }

        setDisplayedText(text.slice(0, index + 1));
        index += 1;

        setTimeout(typeNext, delay);
      } else {
        setTimeout(() => {
          onComplete?.();
        }, 450);
      }
    };

    typeNext();

    return () => {
      isActive = false;
    };
  }, [text, onComplete, speed]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className="typewriter-text">
      {displayedText}
      <span className={`typewriter-cursor ${showCursor ? 'visible' : ''}`}>|</span>
    </span>
  );
};

export const TransitionSequence = ({ onComplete, onStarsStart }: TransitionSequenceProps) => {
  const [phase, setPhase] = useState<Phase>('dark');
  const [shootingStar, setShootingStar] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    angle: number;
  } | null>(null);

  useEffect(() => {
    // Start sequence after mount
    const timer = setTimeout(() => {
      setPhase('lights-out-text');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLightsOutComplete = () => {
    setTimeout(() => {
      setPhase('flash-white');
      setTimeout(() => {
        setPhase('too-much');
      }, 100);
    }, 800);
  };

  const handleTooMuchComplete = () => {
    setTimeout(() => {
      setPhase('subtitle');
    }, 300);
  };

  useEffect(() => {
    if (phase === 'subtitle') {
      const timer = setTimeout(() => {
        setPhase('back-to-dark');
        setTimeout(() => {
          setPhase('better-text');
        }, 1200);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleBetterTextComplete = () => {
    setTimeout(() => {
      setPhase('stars');
      onStarsStart?.();

      // Trigger shooting star after stars start appearing
      setTimeout(() => {
        // Random direction - pick random edge to start and end
        const edges = ['top', 'bottom', 'left', 'right'];
        const startEdge = edges[Math.floor(Math.random() * 4)];
        let endEdge = edges[Math.floor(Math.random() * 4)];
        while (endEdge === startEdge) {
          endEdge = edges[Math.floor(Math.random() * 4)];
        }

        const getEdgePosition = (edge: string) => {
          switch (edge) {
            case 'top': return { x: Math.random() * 100, y: -5 };
            case 'bottom': return { x: Math.random() * 100, y: 105 };
            case 'left': return { x: -5, y: Math.random() * 100 };
            case 'right': return { x: 105, y: Math.random() * 100 };
            default: return { x: 0, y: 0 };
          }
        };

        const start = getEdgePosition(startEdge);
        const end = getEdgePosition(endEdge);
        const width = window.innerWidth || 1;
        const height = window.innerHeight || 1;
        const dx = ((end.x - start.x) / 100) * width;
        const dy = ((end.y - start.y) / 100) * height;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        setShootingStar({
          startX: start.x,
          startY: start.y,
          endX: end.x,
          endY: end.y,
          angle,
        });
      }, 2800);

      // Complete sequence after the star intro finishes
      setTimeout(() => {
        setPhase('done');
        onComplete();
      }, 7700);
    }, 2000);
  };

  const bgColor =
    phase === 'flash-white' || phase === 'too-much' || phase === 'subtitle'
      ? '#ffffff'
      : phase === 'stars' || phase === 'done'
        ? 'transparent'
        : '#0a0a0f';

  return (
    <motion.div 
      className="transition-sequence"
      animate={{ backgroundColor: bgColor }}
      transition={{ duration: phase === 'flash-white' ? 0.05 : 0.8 }}
    >
      <AnimatePresence mode="wait">
        {phase === 'dark' && (
          <motion.div
            key="dark"
            className="transition-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {phase === 'lights-out-text' && (
          <motion.div
            key="lights-out"
            className="transition-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="transition-text dark-text">
              <TypewriterText 
                text="Wait, where'd the lights go?" 
                onComplete={handleLightsOutComplete}
              />
            </h1>
          </motion.div>
        )}

        {(phase === 'too-much' || phase === 'subtitle') && (
          <motion.div
            key="too-much"
            className="transition-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <h1 className="transition-text light-text">
              {phase === 'too-much' ? (
                <TypewriterText 
                  text="TOO MUCH!!" 
                  onComplete={handleTooMuchComplete}
                  speed={40}
                />
              ) : (
                "TOO MUCH!!"
              )}
            </h1>
            {phase === 'subtitle' && (
              <motion.p
                className="transition-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
              </motion.p>
            )}
          </motion.div>
        )}

        {phase === 'better-text' && (
          <motion.div
            key="better"
            className="transition-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="transition-text dark-text">
              <TypewriterText 
                text="Now that's better, let's do it correctly this time." 
                onComplete={handleBetterTextComplete}
                speed={50}
              />
            </h1>
          </motion.div>
        )}

        {(phase === 'stars' || phase === 'done') && (
          <motion.div
            key="stars"
            className="transition-content stars-phase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {shootingStar && (
              <motion.div
                className="intro-shooting-star"
                style={{
                  left: `${shootingStar.startX}%`,
                  top: `${shootingStar.startY}%`,
                  transform: `rotate(${shootingStar.angle}deg)`,
                  transformOrigin: '0% 50%'
                }}
                initial={{ opacity: 0 }}
                animate={{ 
                  left: `${shootingStar.endX}%`,
                  top: `${shootingStar.endY}%`,
                  opacity: [0, 1, 1, 0],
                }}
                transition={{ duration: 1.4, ease: 'linear' }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
