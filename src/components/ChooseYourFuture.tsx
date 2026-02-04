import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChooseYourFuture.css';
import futureFrameOne from '../assets/WhatsApp Image 2026-02-04 at 14.02.49.jpeg';
import futureFrameTwo from '../assets/WhatsApp Image 2026-02-04 at 14.03.01.jpeg';
import futureFrameThree from '../assets/WhatsApp Image 2026-02-04 at 14.03.11.jpeg';

interface ChooseYourFutureProps {
  onComplete: () => void;
}

export const ChooseYourFuture = ({ onComplete }: ChooseYourFutureProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      text: "You are about to make a very important life decision...",
      buttons: [{ text: "Continue", isGood: true }]
    }
  ];

  const frames = useMemo(() => {
    const frameImages = [futureFrameOne, futureFrameTwo, futureFrameThree];
    return frameImages.map((src, index) => ({
      id: index,
      src,
      x: 10 + Math.random() * 80,
      y: 12 + Math.random() * 70,
      size: 120 + Math.random() * 140,
      rotate: -5 + Math.random() * 10,
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
              {currentStepData.text}
            </motion.h1>

            <div className="choice-buttons">
              {currentStepData.buttons.map((button, index) => (
                <motion.button
                  key={index}
                  className={`choice-button ${button.isGood ? 'good' : 'bad'}`}
                  onClick={() => handleChoice(button)}
                  initial={{ x: index === 0 ? -100 : 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
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
          All paths lead to the same question... 💫
        </motion.p>
      )}
    </div>
  );
};
