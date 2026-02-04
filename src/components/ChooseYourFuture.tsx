import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChooseYourFuture.css';
import futureFrameOne from '../assets/WhatsApp Image 2026-02-04 at 14.03.01.jpeg';
import futureFrameTwo from '../assets/WhatsApp Image 2026-02-04 at 14.03.11.jpeg';
import futureFrameThree from '../assets/WhatsApp Image 2026-02-04 at 14.03.20.jpeg';

interface ChooseYourFutureProps {
  onComplete: () => void;
}

export const ChooseYourFuture = ({ onComplete }: ChooseYourFutureProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const steps = [
    {
      text: "You are about to make a very important life decision...",
      buttons: [{ text: "Continue", isGood: true }]
    }
  ];

  const frames = useMemo(() => {
    const frameImages = [futureFrameOne, futureFrameTwo, futureFrameThree];
    const frameDates = ['24 Nov 2025', '24 Nov 2025', '18 Nov 2025'];
    const frameLayouts = [
      { x: 10, y: 32, size: 220, rotate: -6 },
      { x: 88, y: 26, size: 230, rotate: 5 },
      { x: 72, y: 74, size: 210, rotate: -4 },
    ];

    return frameImages.map((src, index) => ({
      id: index,
      src,
      date: frameDates[index % frameDates.length],
      x: frameLayouts[index % frameLayouts.length].x,
      y: frameLayouts[index % frameLayouts.length].y,
      size: frameLayouts[index % frameLayouts.length].size,
      rotate: frameLayouts[index % frameLayouts.length].rotate,
    }));
  }, []);

  const [selectedResult, setSelectedResult] = useState<string | null>(null);

  const handleChoice = (button: any) => {
    if (button.result) {
      setSelectedResult(button.result);
      setTimeout(() => {
        setSelectedResult(null);
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          setTimeout(() => onComplete(), 500);
        }
      }, 5500);
    } else {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete();
      }
    }
  };

  const currentStepData = steps[currentStep];

  useEffect(() => {
    let index = 0;
    let isActive = true;

    const pauseChars = new Set([',', '.', '?', '!', ':', ';']);
    const slowChars = new Set(['a', 'e', 'i', 'o', 'u', 't', 'h']);

    const typeNext = () => {
      if (!isActive) return;
      if (index < currentStepData.text.length) {
        const nextChar = currentStepData.text[index];
        const prevChar = index > 0 ? currentStepData.text[index - 1] : '';
        const isPause = pauseChars.has(nextChar);
        const isSpace = nextChar === ' ';
        const isSlow = slowChars.has(nextChar.toLowerCase());

        let delay = 52 + Math.floor(Math.random() * 25);

        if (isPause) {
          delay = 220 + Math.floor(Math.random() * 180);
        } else if (isSpace && Math.random() < 0.12) {
          delay = 200 + Math.floor(Math.random() * 200);
        } else if (isSlow) {
          delay += 20 + Math.floor(Math.random() * 25);
        }

        if (pauseChars.has(prevChar) && isSpace) {
          delay = 140 + Math.floor(Math.random() * 120);
        }

        if (Math.random() < 0.06) {
          delay = Math.floor(delay * 0.5);
        }

        setDisplayedText(currentStepData.text.slice(0, index + 1));
        index += 1;
        setTimeout(typeNext, delay);
      }
    };

    setDisplayedText('');
    typeNext();

    return () => {
      isActive = false;
    };
  }, [currentStepData.text]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="choose-future-container">
      <div className="future-frames" aria-hidden="true">
        {frames.map(frame => (
          <div
            key={frame.id}
            className="future-frame"
            style={{
              left: `${frame.x}%`,
              top: `${frame.y}%`,
              width: `${frame.size}px`,
              transform: `translate(-50%, -50%) rotate(${frame.rotate}deg)`,
            }}
          >
            <img src={frame.src} alt="" />
              <span className="future-frame-date">{frame.date}</span>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {!selectedResult ? (
          <motion.div
            key={currentStep}
            className="choice-content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="choice-title"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {displayedText}
              <span className={`typewriter-cursor ${showCursor ? 'visible' : ''}`}>|</span>
            </motion.h1>

            <div className="choice-buttons">
              {currentStepData.buttons.map((button, index) => (
                <motion.button
                  key={index}
                  className={`choice-button ${button.isGood ? 'good' : 'bad'}`}
                  onClick={() => handleChoice(button)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.2 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(255, 255, 255, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {button.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            className="result-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
          >
            <p className="result-text">{selectedResult}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {currentStep === steps.length - 1 && !selectedResult && (
        <motion.p
          className="final-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
        </motion.p>
      )}
    </div>
  );
};
