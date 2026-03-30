import { motion } from 'framer-motion';
import styles from './ContinueButton.module.css';

/**
 * Bouton "Continuer →" affiché en bas de chaque section.
 * @param {function} onClick - callback quand on clique
 * @param {string}   hint    - petite ligne de texte sous le bouton (optionnel)
 * @param {string}   label   - texte du bouton (défaut : "Continuer")
 */
export default function ContinueButton({ onClick, hint, label = 'Continuer', theme = 'default' }) {
  const themeClass = styles[`theme_${theme}`] || styles.theme_default;

  return (
    <motion.div
      className={styles.continueWrap}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <button className={`${styles.continueBtn} ${themeClass}`} onClick={onClick}>
        {label}
        <span className={styles.arrow}>→</span>
      </button>
      {hint && <p className={styles.continueHint}>{hint}</p>}
    </motion.div>
  );
}
