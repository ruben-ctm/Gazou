import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { proposalText } from '../../data/content';
import styles from './Proposal.module.css';

export default function Proposal({ onAccept }) {
  const [noPos, setNoPos] = useState({ x: null, y: null });
  const [answered, setAnswered] = useState(false);
  const noBtnRef = useRef(null);

  // Move NO button when mouse gets close
  const handleMouseMove = (e) => {
    const btn = noBtnRef.current;
    if (!btn || answered) return;
    const rect = btn.getBoundingClientRect();
    const btnCx = rect.left + rect.width / 2;
    const btnCy = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - btnCx, e.clientY - btnCy);
    if (dist < 80) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 80;
      const newX = margin + Math.random() * (vw - 2 * margin);
      const newY = margin + Math.random() * (vh - 2 * margin);
      setNoPos({ x: newX - rect.width / 2, y: newY - rect.height / 2 });
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [answered]);

  const fireConfetti = (pink = false) => {
    const colors = pink
      ? ['#ff69b4', '#ff1493', '#ffb6c1', '#ffd700']
      : ['#d4a843', '#f0d080', '#ffd700', '#ffe4b5', '#fff8dc'];

    const shoot = (x, angle) => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x, y: 0.7 },
        colors,
        angle,
        gravity: 0.8,
        scalar: 1.2,
        drift: 0.2,
      });
    };

    shoot(0.25, 60);
    setTimeout(() => shoot(0.75, 120), 200);
    setTimeout(() => shoot(0.5, 90), 400);
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 180,
        origin: { x: 0.5, y: 0.5 },
        colors,
        startVelocity: 20,
        scalar: 0.9,
      });
    }, 700);
  };

  const handleYes = (pink = false) => {
    setAnswered(true);
    fireConfetti(pink);
    onAccept(pink);
  };

  return (
    <section id="proposal" className={`section ${styles.proposalSection}`}>
      {/* Stars bg */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className={styles.star}
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ opacity: [0.1, 0.9, 0.1], scale: [0.5, 1.1, 0.5] }}
          transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 4 }}
        >
          {['✨', '⭐', '🌟', '💛', '🤍'][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          ✦ Cinq ans plus tard ✦
        </motion.p>

        <motion.h2
          className={styles.question}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.9 }}
        >
          {proposalText.question}
        </motion.h2>

        <motion.div
          className={styles.goldLine}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
        />

        <AnimatePresence mode="wait">
          {!answered ? (
            <motion.div
              key="buttons"
              className={styles.buttons}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1 }}
            >
              <motion.button
                className={`btn-primary ${styles.yesBtn1}`}
                onClick={() => handleYes(false)}
                whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(212,168,67,0.7)' }}
                whileTap={{ scale: 0.96 }}
              >
                {proposalText.button1}
              </motion.button>

              <motion.button
                className={`btn-primary ${styles.yesBtn2}`}
                onClick={() => handleYes(true)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
              >
                {proposalText.button2}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="accepted"
              className={styles.accepted}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <p className={styles.acceptedText}>Je savais que tu dirais oui 🥹</p>
              <p className={styles.acceptedSub}>Scroll vers le bas pour signer notre histoire...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Elusive NO button */}
      {!answered && (
        <motion.button
          ref={noBtnRef}
          className={styles.noBtn}
          style={
            noPos.x !== null
              ? { position: 'fixed', left: noPos.x, top: noPos.y, bottom: 'auto', right: 'auto' }
              : {}
          }
          animate={noPos.x !== null ? { x: 0, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          {proposalText.noButton}
        </motion.button>
      )}
    </section>
  );
}
