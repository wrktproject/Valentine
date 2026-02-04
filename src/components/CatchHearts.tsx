import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CatchHearts.css';
import frameOne from '../assets/WhatsApp Image 2026-02-04 at 14.01.07.jpeg';
import frameTwo from '../assets/WhatsApp Image 2026-02-04 at 14.01.32.jpeg';
import frameThree from '../assets/WhatsApp Image 2026-02-04 at 14.01.56.jpeg';
import frameFour from '../assets/WhatsApp Image 2026-02-04 at 14.02.08.jpeg';
import frameFive from '../assets/WhatsApp Image 2026-02-04 at 14.02.19.jpeg';
import frameSix from '../assets/WhatsApp Image 2026-02-04 at 14.02.37.jpeg';

interface Heart {
  id: number;
  x: number;
  y: number;
  message: string;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
  droplets: { id: number; dx: number; dy: number; size: number; rotate: number; stretch: number }[];
}

interface CatchHeartsProps {
  onComplete: () => void;
}

export const CatchHearts = ({ onComplete }: CatchHeartsProps) => {
  const heartsAreaRef = useRef<HTMLDivElement>(null);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [caughtCount, setCaughtCount] = useState(0);
  const [showMessage, setShowMessage] = useState<{ text: string; x: number; y: number } | null>(null);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);

  const messages = [
    "Your smile lights up my world",
    "I love talking to you",
    "I miss you when you're not around",
    "You make me laugh like no one else",
    "Being with you completes my day",
    "Your bright energy and dances make me so happy",
  ];

  const totalHearts = messages.length;

  const frames = useMemo(() => {
    const frameImages = [frameOne, frameTwo, frameThree, frameFour, frameFive, frameSix];
    return frameImages.map((src, index) => ({
      id: index,
      src,
      x: 8 + Math.random() * 84,
      y: 12 + Math.random() * 70,
      size: 90 + Math.random() * 120,
      rotate: -6 + Math.random() * 12,
    }));
  }, []);

  useEffect(() => {
    // Generate hearts at random positions
    const generatedHearts: Heart[] = messages.map((message, i) => ({
      id: i,
      x: Math.random() * 90 + 5, // 5% to 95%
      y: Math.random() * 80 + 5,
      message,
    }));
    setHearts(generatedHearts);
  }, []);

  const catchHeart = (heart: Heart, targetEl: HTMLDivElement) => {
    const area = heartsAreaRef.current;
    if (area) {
      const areaRect = area.getBoundingClientRect();
      const heartRect = targetEl.getBoundingClientRect();
      const x = heartRect.left - areaRect.left + heartRect.width / 2;
      const y = heartRect.top - areaRect.top + heartRect.height / 2;
      const droplets = Array.from({ length: 20 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 20 + Math.random() * 0.5;
        const distance = 70 + Math.random() * 70;
        return {
          id: i,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          size: 8 + Math.random() * 12,
          rotate: Math.random() * 180,
          stretch: 0.8 + Math.random() * 0.7,
        };
      });
      const explosion: Explosion = {
        id: Date.now(),
        x,
        y,
        droplets,
      };
      setExplosions(prev => [...prev, explosion]);
      setTimeout(() => {
        setExplosions(prev => prev.filter(e => e.id !== explosion.id));
      }, 1200);
    }

    setHearts(hearts.filter(h => h.id !== heart.id));
    setCaughtCount(caughtCount + 1);

    // Clamp message position to stay within the hearts area
    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
    const messageX = clamp(heart.x, 12, 88);
    const messageY = clamp(heart.y, 18, 82);
    setShowMessage({ text: heart.message, x: messageX, y: messageY });

    const messageDuration = 3500;
    setTimeout(() => setShowMessage(null), messageDuration);

    if (caughtCount + 1 === totalHearts) {
      setTimeout(() => setShowCompletion(true), messageDuration + 200);
      setTimeout(() => onComplete(), messageDuration + 1200);
    }
  };

  return (
    <div className="catch-hearts-container">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hearts-header"
      >
        <h1>Catch All the Hearts</h1>
        <p className="hearts-counter">{caughtCount} / {totalHearts}</p>
      </motion.div>

      <div className="hearts-area" ref={heartsAreaRef}>
        <div className="hearts-frames" aria-hidden="true">
          {frames.map(frame => (
            <div
              key={frame.id}
              className="hearts-frame"
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
        <AnimatePresence>
          {explosions.map(explosion => (
              <motion.div
              key={explosion.id}
              className="heart-explosion"
              style={{ left: explosion.x, top: explosion.y }}
                initial={{ opacity: 1, scale: 0.6 }}
                animate={{ opacity: 0, scale: 1.4 }}
              exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
            >
                <motion.span
                  className="heart-splash"
                  initial={{ scale: 0.6, opacity: 0.9 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              {explosion.droplets.map(droplet => (
                <motion.span
                  key={droplet.id}
                  className="heart-droplet"
                  style={{
                    width: droplet.size,
                    height: droplet.size,
                    transform: `rotate(${droplet.rotate}deg) scaleX(${droplet.stretch})`,
                  }}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{
                    x: droplet.dx,
                    y: droplet.dy,
                      scale: 0.1,
                    opacity: 0,
                  }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                />
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {hearts.map((heart, index) => (
            <motion.div
              key={heart.id}
              className="floating-heart"
              style={{
                left: `${heart.x}%`,
                top: `${heart.y}%`,
              }}
              initial={{ scale: 0.3, opacity: 0, filter: 'blur(6px)' }}
              animate={{
                opacity: 1,
                filter: 'blur(0px)',
                scale: [0.6, 1.15, 1],
                rotate: [0, 6, -6, 0],
                y: [0, -8, 0],
              }}
              exit={{ scale: 0, opacity: 0, rotate: 90 }}
              transition={{
                delay: index * 0.18,
                opacity: { duration: 0.35 },
                filter: { duration: 0.45 },
                scale: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                y: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
              }}
              onClick={event => catchHeart(heart, event.currentTarget)}
              whileHover={{ scale: 1.15 }}
            >
              ♡
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showMessage && (
          <motion.div
            className="heart-message"
            style={{
              left: `${showMessage.x}%`,
              top: `${showMessage.y}%`,
            }}
            initial={{ opacity: 0, y: 30, scale: 0.96, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -60, scale: 0.9, rotate: -2, filter: 'blur(8px)' }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            {showMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {showCompletion && (
        <motion.div
          className="completion-message"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          ✨ All hearts collected! ✨
        </motion.div>
      )}
    </div>
  );
};
