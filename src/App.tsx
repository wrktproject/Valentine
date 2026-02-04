import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalaxyBackground } from './components/GalaxyBackground';
import { StoryTimeline } from './components/StoryTimeline';
import { CatchHearts } from './components/CatchHearts';
import { ChooseYourFuture } from './components/ChooseYourFuture';
import { ValentineQuestion } from './components/ValentineQuestion';
import { VerificationGate } from './components/VerificationGate';
import { TransitionSequence } from './components/TransitionSequence';
import './App.css';

type Stage = 'verify' | 'transition' | 'timeline' | 'hearts' | 'future' | 'question';

function App() {
  const [currentStage, setCurrentStage] = useState<Stage>('verify');
  const [showGalaxy, setShowGalaxy] = useState(false);
  const [pinkStars, setPinkStars] = useState(false);

  const stages: Stage[] = ['verify', 'transition', 'timeline', 'hearts', 'future', 'question'];

  const nextStage = () => {
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < stages.length - 1) {
      setCurrentStage(stages[currentIndex + 1]);
    }
  };

  // Different transition variants for each module
  const timelineVariants = {
    initial: { opacity: 0, x: -40, y: -60 },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 40, y: 80 }
  };

  const heartsVariants = {
    initial: { opacity: 0, x: 40, y: -60 },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: -40, y: 80 }
  };

  const futureVariants = {
    initial: { opacity: 0, x: -60, y: -60 },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 60, y: 80 }
  };

  const questionVariants = {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 }
  };

  const pageTransition = {
    duration: 0.8,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
  };

  const fastTransition = {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
  };

  useEffect(() => {
    if (currentStage !== 'question' && pinkStars) {
      setPinkStars(false);
    }
  }, [currentStage, pinkStars]);

  return (
    <div className={`app-container ${pinkStars ? 'pink-stars' : ''}`}>
      {showGalaxy && (
        <GalaxyBackground startDelayMs={0} introSequence />
      )}
      
      <AnimatePresence mode="wait">
        {currentStage === 'verify' && (
          <motion.div
            key="verify"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <VerificationGate onComplete={nextStage} />
          </motion.div>
        )}

        {currentStage === 'transition' && (
          <TransitionSequence
            onComplete={nextStage}
            onStarsStart={() => setShowGalaxy(true)}
          />
        )}

        {currentStage === 'timeline' && (
          <motion.div
            key="timeline"
            variants={timelineVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <StoryTimeline onComplete={nextStage} />
          </motion.div>
        )}

        {currentStage === 'hearts' && (
          <motion.div
            key="hearts"
            variants={heartsVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={fastTransition}
          >
            <CatchHearts onComplete={nextStage} />
          </motion.div>
        )}

        {currentStage === 'future' && (
          <motion.div
            key="future"
            variants={futureVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={fastTransition}
          >
            <ChooseYourFuture onComplete={nextStage} />
          </motion.div>
        )}

        {currentStage === 'question' && (
          <motion.div
            key="question"
            variants={questionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <ValentineQuestion onStartPinkStars={() => setPinkStars(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
