import { useState } from 'react';
import { motion } from 'framer-motion';
import './PuzzleUnlock.css';

interface PuzzleUnlockProps {
  onComplete: () => void;
}

export const PuzzleUnlock = ({ onComplete }: PuzzleUnlockProps) => {
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showError, setShowError] = useState(false);

  // CUSTOMIZE THESE - Make them personal to your relationship!
  const question = "What's my favorite nickname for you?";
  const correctAnswer = "princess"; // Change this to your actual answer (case-insensitive)
  const hint = "Think about what I call you when you're being adorable...";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (answer.toLowerCase().trim() === correctAnswer.toLowerCase()) {
      setIsCorrect(true);
      setTimeout(() => onComplete(), 2500);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  return (
    <div className="puzzle-unlock-container">
      {!isCorrect ? (
        <motion.div
          className="puzzle-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="lock-icon"
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            🔒
          </motion.div>

          <h1 className="puzzle-title">Only One Person Can Unlock This</h1>
          
          <form onSubmit={handleSubmit} className="puzzle-form">
            <label className="puzzle-question">{question}</label>
            
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="puzzle-input"
              placeholder="Type your answer..."
              autoFocus
            />

            <p className="puzzle-hint">{hint}</p>

            <motion.button
              type="submit"
              className="puzzle-submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Unlock 🔓
            </motion.button>
          </form>

          {showError && (
            <motion.p
              className="error-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Not quite... try again! ❌
            </motion.p>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="unlock-success"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="success-icon"
            animate={{ rotate: 360 }}
            transition={{ duration: 1 }}
          >
            🔓
          </motion.div>
          <h2 className="success-text">Unlocked! ✨</h2>
          <p className="success-subtitle">Of course you knew that... 💕</p>
        </motion.div>
      )}
    </div>
  );
};
