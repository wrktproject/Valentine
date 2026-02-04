import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './GalaxyBackground.css';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
  introDelay: number;
}

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  angle: number;
}

interface GalaxyBackgroundProps {
  startDelayMs?: number;
  introSequence?: boolean;
}

export const GalaxyBackground = ({ startDelayMs = 0, introSequence = false }: GalaxyBackgroundProps) => {
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [introDone, setIntroDone] = useState(!introSequence);

  useEffect(() => {
    let shootingStarInterval: ReturnType<typeof setInterval> | null = null;
    let startTimeout: ReturnType<typeof setTimeout> | null = null;

    const createShootingStar = () => {
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

      const newShootingStar: ShootingStar = {
        id: Date.now(),
        startX: start.x,
        startY: start.y,
        endX: end.x,
        endY: end.y,
        angle,
      };

      setShootingStars(prev => [...prev, newShootingStar]);

      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== newShootingStar.id));
      }, 1500);
    };

    const startBackground = () => {
      setIntroDone(!introSequence);
      const generatedStars: Star[] = Array.from({ length: 150 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleDelay: Math.random() * 3,
        introDelay: i < 25 ? i * 0.2 : 5 + (i - 25) * 0.02,
      }));
      setStars(generatedStars);

      if (introSequence) {
        const maxIntroDelay = generatedStars.reduce(
          (max, star) => Math.max(max, star.introDelay),
          0
        );
        setTimeout(() => setIntroDone(true), (maxIntroDelay + 0.8) * 1000);
      }

      createShootingStar();

      shootingStarInterval = setInterval(() => {
        createShootingStar();
      }, 4000);
    };

    if (startDelayMs > 0) {
      startTimeout = setTimeout(startBackground, startDelayMs);
    } else {
      startBackground();
    }

    return () => {
      if (shootingStarInterval) clearInterval(shootingStarInterval);
      if (startTimeout) clearTimeout(startTimeout);
    };
  }, [startDelayMs, introSequence]);

  return (
    <div className="galaxy-background">
      {/* Stars */}
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          initial={{ opacity: introSequence ? 0 : star.opacity }}
          animate={
            introSequence && !introDone
              ? { opacity: star.opacity }
              : { opacity: [star.opacity, star.opacity * 1.5, star.opacity] }
          }
          transition={
            introSequence && !introDone
              ? {
                  duration: 0.8,
                  ease: 'easeOut',
                  delay: star.introDelay + startDelayMs / 1000,
                }
              : {
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: introSequence ? 0 : star.twinkleDelay,
                }
          }
        />
      ))}

      {/* Shooting Stars */}
      {shootingStars.map(shootingStar => (
        <motion.div
          key={shootingStar.id}
          className="shooting-star"
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
            opacity: [0, 1, 1, 0]
          }}
          transition={{ duration: 1.2, ease: "linear" }}
        />
      ))}
    </div>
  );
};
