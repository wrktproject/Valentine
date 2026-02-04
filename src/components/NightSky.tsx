import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './NightSky.css';

interface Star {
  id: number;
  x: number;
  y: number;
  message: string;
  clicked: boolean;
}

interface NightSkyProps {
  onComplete: () => void;
}

export const NightSky = ({ onComplete }: NightSkyProps) => {
  const messages = [
    "I appreciate how you always listen",
    "I love our late-night conversations",
    "You make ordinary moments special",
    "I look forward to making more memories with you",
    "Your kindness inspires me every day",
    "I cherish every moment we spend together",
  ];

  const [stars, setStars] = useState<Star[]>(
    messages.map((message, i) => ({
      id: i,
      x: 20 + (i % 3) * 30 + Math.random() * 10,
      y: 20 + Math.floor(i / 3) * 35 + Math.random() * 10,
      message,
      clicked: false,
    }))
  );

  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [clickedCount, setClickedCount] = useState(0);

  const handleStarClick = (starId: number) => {
    const star = stars.find(s => s.id === starId);
    if (!star || star.clicked) return;

    setStars(stars.map(s => 
      s.id === starId ? { ...s, clicked: true } : s
    ));

    setCurrentMessage(star.message);
    setClickedCount(clickedCount + 1);

    setTimeout(() => setCurrentMessage(null), 3000);

    if (clickedCount + 1 === messages.length) {
      setTimeout(() => onComplete(), 3500);
    }
  };

  const allClicked = clickedCount === messages.length;

  return (
    <div className="night-sky-container">
      <motion.h1
        className="night-sky-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Click the Stars
      </motion.h1>

      <motion.p
        className="night-sky-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {clickedCount} / {messages.length} discovered
      </motion.p>

      <div className="stars-container">
        {stars.map(star => (
          <motion.div
            key={star.id}
            className={`clickable-star ${star.clicked ? 'clicked' : ''}`}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: star.clicked ? 1.5 : 1,
              opacity: star.clicked ? 1 : 0.7,
            }}
            transition={{ 
              delay: star.id * 0.1,
              duration: 0.5 
            }}
            whileHover={{ scale: star.clicked ? 1.5 : 1.3 }}
            onClick={() => handleStarClick(star.id)}
          >
            ⭐
          </motion.div>
        ))}

        {/* Constellation lines appear when all stars are clicked */}
        {allClicked && (
          <svg className="constellation-svg">
            {stars.map((star, i) => {
              if (i === stars.length - 1) return null;
              const nextStar = stars[i + 1];
              return (
                <motion.line
                  key={`line-${i}`}
                  x1={`${star.x}%`}
                  y1={`${star.y}%`}
                  x2={`${nextStar.x}%`}
                  y2={`${nextStar.y}%`}
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                />
              );
            })}
          </svg>
        )}
      </div>

      <AnimatePresence>
        {currentMessage && (
          <motion.div
            className="star-message"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            {currentMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {allClicked && (
        <motion.div
          className="constellation-complete"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <div className="heart-constellation">💖</div>
          <p className="complete-text">All the stars align for you ✨</p>
        </motion.div>
      )}
    </div>
  );
};
