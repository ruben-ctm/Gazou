import { motion } from 'framer-motion';
import styles from './KawaiiPopup.module.css';

export default function KawaiiPopup({ event }) {
  if (!event) return null;

  const { emoji, text, x, y } = event;
  const clampedX = Math.min(Math.max(x - 100, 10), window.innerWidth - 220);
  const clampedY = Math.min(Math.max(y - 80, 10), window.innerHeight - 120);

  return (
    <motion.div
      className={styles.wrapper}
      style={{ left: clampedX, top: clampedY }}
      initial={{ scale: 0, opacity: 0, rotate: -15 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      exit={{ scale: 0, opacity: 0, rotate: 15 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
    >
      <span className={styles.emoji}>{emoji}</span>
      <p className={styles.text}>{text}</p>
    </motion.div>
  );
}
