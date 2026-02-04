import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import './VerificationGate.css';

interface VerificationGateProps {
  onComplete: () => void;
}

const questions = [
  {
    id: 'color',
    label: "What's your favorite color?",
    type: 'text' as const,
    answer: 'red',
  },
  {
    id: 'birthday',
    label: "When's your birthday?",
    type: 'date' as const,
    answer: '2007-07-06',
  },
  {
    id: 'flower',
    label: "What's your favorite flower?",
    type: 'text' as const,
    answer: 'panzie',
  },
  {
    id: 'lastName',
    label: "What's your last name?",
    type: 'text' as const,
    answer: 'madnick',
  },
];

export const VerificationGate = ({ onComplete }: VerificationGateProps) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);

  const floatingCards = useMemo(
    () =>
      questions.map((q, index) => {
        const baseX = 6 + index * 28;
        const baseY = 16 + (index % 2) * 32;
        const rotation = index === 2 ? 170 : -12 + index * 8;
        const driftX = (Math.random() * 30 + 20) * (index % 2 === 0 ? 1 : -1);
        const driftY = (Math.random() * 20 + 10) * (index % 2 === 0 ? -1 : 1);
        const duration = 8 + index * 1.5;

        return { baseX, baseY, rotation, driftX, driftY, duration, id: q.id };
      }),
    []
  );

  const handleChange = (id: string, value: string) => {
    setValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const allCorrect = questions.every(q => {
      const value = (values[q.id] || '').trim().toLowerCase();
      const expected = q.answer.toLowerCase();
      return value === expected;
    });

    if (!allCorrect) {
      setError("Either this isn't for you, or you don't even know your own stats. Try again?");
      return;
    }

    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <div className={`verification-gate ${isFadingOut ? 'fading-out' : ''}`}>
      <motion.div
        className="verification-darken"
        initial={{ opacity: 0 }}
        animate={{ opacity: isFadingOut ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      <motion.h1
        className="verification-title"
        initial={{ opacity: 0, y: -30, filter: 'blur(6px)' }}
        animate={
          isFadingOut
            ? { opacity: 0, y: -20, scale: 0.98, filter: 'blur(8px)' }
            : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
        }
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        Hang on, lets check that you're MY Elisheva.
      </motion.h1>

      <motion.p
        className="verification-subtitle"
        initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
        animate={
          isFadingOut
            ? { opacity: 0, y: -10, filter: 'blur(8px)' }
            : { opacity: 1, y: 0, filter: 'blur(0px)' }
        }
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeInOut' }}
      >
        Answer these to unlock the story 💖
      </motion.p>

      <div className="floating-questions">
        {questions.map((q, index) => {
          const card = floatingCards[index];
          return (
            <motion.div
              key={q.id}
              className="question-card"
              style={{
                left: `${card.baseX}%`,
                top: `${card.baseY}%`,
                rotate: `${card.rotation}deg`,
              }}
              animate={
                isFadingOut
                  ? { opacity: 0, y: -40, scale: 0.9, filter: 'blur(8px)' }
                  : {
                      opacity: 1,
                      filter: 'blur(0px)',
                      x: [0, card.driftX, -card.driftX, 0],
                      y: [0, card.driftY, -card.driftY, 0],
                    }
              }
              transition={
                isFadingOut
                  ? { duration: 0.6, ease: 'easeInOut' }
                  : { duration: card.duration, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <p className="question-label">{q.label}</p>
              {q.type === 'date' ? (
                <input
                  type="date"
                  className="question-input"
                  value={values[q.id] || ''}
                  onChange={e => handleChange(q.id, e.target.value)}
                  disabled={isFadingOut}
                />
              ) : (
                <input
                  type="text"
                  className="question-input"
                  placeholder="Type here..."
                  value={values[q.id] || ''}
                  onChange={e => handleChange(q.id, e.target.value)}
                  disabled={isFadingOut}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <form className="verification-form" onSubmit={handleSubmit}>
        <motion.button
          type="submit"
          className="verification-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isFadingOut}
        >
          Unlock
        </motion.button>
        {error && <p className="verification-error">{error}</p>}
      </form>
    </div>
  );
};
