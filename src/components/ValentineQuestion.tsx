import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ValentineQuestion.css';

interface ValentineQuestionProps {
  onStartPinkStars?: () => void;
}

export const ValentineQuestion = ({ onStartPinkStars }: ValentineQuestionProps) => {
  const [showTitle, setShowTitle] = useState(false);
  const [showYesButton, setShowYesButton] = useState(false);
  const [showNoButton, setShowNoButton] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [hasMovedOnce, setHasMovedOnce] = useState(false);
  const [yesClicked, setYesClicked] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  // Sequenced appearance: stars pink -> title -> yes button -> no button
  useEffect(() => {
    // Stars start turning pink immediately (via GalaxyBackground)
    const pinkTimer = setTimeout(() => onStartPinkStars?.(), 400);
    // Title appears after stars have been turning pink for a while
    const titleTimer = setTimeout(() => setShowTitle(true), 4000);
    // Yes button appears after title
    const yesTimer = setTimeout(() => setShowYesButton(true), 5500);
    // No button appears last
    const noTimer = setTimeout(() => setShowNoButton(true), 6500);

    return () => {
      clearTimeout(pinkTimer);
      clearTimeout(titleTimer);
      clearTimeout(yesTimer);
      clearTimeout(noTimer);
    };
  }, []);

  // Calculate safe position away from cursor
  const getNewPosition = (mouseX: number, mouseY: number) => {
    const button = noButtonRef.current;
    if (!button) return { x: 0, y: 0 };

    const buttonWidth = button.offsetWidth;
    const buttonHeight = button.offsetHeight;
    const padding = 60;
    const maxX = window.innerWidth - buttonWidth - padding;
    const maxY = window.innerHeight - buttonHeight - padding;

    // Calculate position that's far from the cursor
    let newX: number, newY: number;
    let attempts = 0;
    const minDistance = 250;

    do {
      newX = padding + Math.random() * (maxX - padding);
      newY = padding + Math.random() * (maxY - padding);
      
      const distance = Math.sqrt(
        Math.pow(mouseX - (newX + buttonWidth / 2), 2) +
        Math.pow(mouseY - (newY + buttonHeight / 2), 2)
      );
      
      attempts++;
      if (distance > minDistance || attempts > 10) break;
    } while (true);

    return { x: newX, y: newY };
  };

  // Track mouse and move button away when it gets close
  useEffect(() => {
    if (!showNoButton || yesClicked) return;

    const handleMouseMove = (e: MouseEvent) => {
      const button = noButtonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(e.clientX - buttonCenterX, 2) +
        Math.pow(e.clientY - buttonCenterY, 2)
      );

      // Large detection radius - move when cursor is within 180px
      if (distance < 180) {
        const newPos = getNewPosition(e.clientX, e.clientY);
        setNoButtonPos(newPos);
        setHasMovedOnce(true);
      }
    };

    // Use requestAnimationFrame for smooth tracking
    let rafId: number;
    const throttledMouseMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleMouseMove(e);
        rafId = 0;
      });
    };

    window.addEventListener('mousemove', throttledMouseMove);
    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [showNoButton, yesClicked]);

  const handleYesClick = () => {
    setYesClicked(true);
  };

  return (
    <div className="valentine-question-container">
      {!yesClicked ? (
        <div className="question-content">
          {/* Title */}
          <motion.h1
            className="valentine-title"
            initial={{ opacity: 0, y: -30 }}
            animate={{ 
              opacity: showTitle ? 1 : 0, 
              y: showTitle ? 0 : -30,
              scale: showTitle ? [1, 1.05, 1] : 1,
            }}
            transition={{ 
              opacity: { duration: 1.2 },
              y: { duration: 1.2 },
              scale: { duration: 2, repeat: Infinity, delay: 1.2 }
            }}
          >
            Will You Be My Valentine? 💖
          </motion.h1>

          <div className="buttons-container">
            {/* Yes Button */}
            <motion.button
              className="yes-button"
              onClick={handleYesClick}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: showYesButton ? 1 : 0, 
                scale: showYesButton ? 1 : 0.5,
                boxShadow: showYesButton ? [
                  "0 10px 40px rgba(255, 105, 180, 0.4)",
                  "0 10px 60px rgba(255, 105, 180, 0.8)",
                  "0 10px 40px rgba(255, 105, 180, 0.4)",
                ] : "0 10px 40px rgba(255, 105, 180, 0.4)"
              }}
              transition={{ 
                opacity: { duration: 0.8 },
                scale: { duration: 0.8, type: 'spring' },
                boxShadow: { duration: 2, repeat: Infinity, delay: 0.8 }
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Yes! 💕
            </motion.button>

            {/* No Button - uses CSS transitions for smooth movement */}
            {showNoButton && (
              <button
                ref={noButtonRef}
                className="no-button"
                style={{
                  position: hasMovedOnce ? 'fixed' : 'relative',
                  left: hasMovedOnce ? `${noButtonPos.x}px` : 'auto',
                  top: hasMovedOnce ? `${noButtonPos.y}px` : 'auto',
                  transition: 'left 0.15s ease-out, top 0.15s ease-out, opacity 0.5s ease',
                  opacity: 1,
                }}
              >
                No
              </button>
            )}
          </div>

          <motion.p
            className="hint-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: showNoButton ? 1 : 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
          </motion.p>
        </div>
      ) : (
        <motion.div
          className="success-celebration"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="hearts-explosion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="flying-heart"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 1,
                  scale: 0
                }}
                animate={{
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  opacity: 0,
                  scale: [0, 1.5, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.05,
                  ease: "easeOut"
                }}
              >
                💖
              </motion.div>
            ))}
          </motion.div>

          <motion.h1
            className="celebration-title"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          >
            🎉 She Said Yes! 🎉
          </motion.h1>

          <motion.p
            className="celebration-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Best. Valentine's. Ever. 💕✨
          </motion.p>

          <motion.div
            className="final-hearts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            💖💖💖
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
