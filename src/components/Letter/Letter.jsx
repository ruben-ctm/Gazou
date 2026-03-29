import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { letterText } from '../../data/content';
import ContinueButton from '../ContinueButton/ContinueButton';
import styles from './Letter.module.css';

// Split text into paragraphs, then into words per paragraph
const PARAGRAPHS = letterText.split('\n').filter(line => line.trim() !== '');

// Flat list of all words with their paragraph index
const ALL_WORDS = PARAGRAPHS.flatMap((para, pIdx) =>
  para.split(' ').map((word, wIdx) => ({ word, pIdx, wIdx, key: `${pIdx}-${wIdx}` }))
);

const WORDS_PER_SECOND = 12; // speed of the typewriter

export default function Letter({ onContinue }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [visibleCount, setVisibleCount] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isInView) return;
    if (intervalRef.current) return; // already started

    let count = 0;
    intervalRef.current = setInterval(() => {
      count += 1;
      setVisibleCount(count);
      if (count >= ALL_WORDS.length) {
        clearInterval(intervalRef.current);
      }
    }, 1000 / WORDS_PER_SECOND);

    return () => clearInterval(intervalRef.current);
  }, [isInView]);

  return (
    <section id="letter" ref={sectionRef} className={`section ${styles.letterSection}`}>
      <div className={styles.letterWrap}>

        {/* Wax seal */}
        <motion.div
          className={styles.envelopeTop}
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.waxSeal}>
            <span className={styles.sealInitials}>R</span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          className={styles.letterHead}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <h2 className="section-title">La Lettre Finale</h2>
          <p className="section-subtitle">À lire lentement, comme on vivrait les choses...</p>
          <div className="gold-divider" />
        </motion.div>

        {/* Paper */}
        <motion.div
          className={styles.paper}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.6 }}
        >
          {/* Ruled lines */}
          {[...Array(30)].map((_, i) => (
            <div key={i} className={styles.paperLine} style={{ top: `${3 + i * 3.6}rem` }} />
          ))}

          <div className={styles.letterContent}>
            {PARAGRAPHS.map((para, pIdx) => {
              const wordsInPara = para.split(' ');
              // Count how many words of this para are visible
              const wordsBeforeThisPara = ALL_WORDS.filter(w => w.pIdx < pIdx).length;

              return (
                <p key={pIdx} className={styles.letterParagraph}>
                  {wordsInPara.map((word, wIdx) => {
                    const globalIdx = wordsBeforeThisPara + wIdx;
                    const visible = globalIdx < visibleCount;
                    return (
                      <motion.span
                        key={wIdx}
                        className={styles.word}
                        initial={{ opacity: 0, y: 6 }}
                        animate={visible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {word}{' '}
                      </motion.span>
                    );
                  })}
                </p>
              );
            })}
          </div>
        </motion.div>

        {/* Signature — appears after all words */}
        <motion.div
          className={styles.signatureArea}
          initial={{ opacity: 0 }}
          animate={visibleCount >= ALL_WORDS.length ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
        >
          <p className={styles.signatureText}>— Ruben, avec tout son amour 💛</p>
        </motion.div>

        {/* Continue button — appears after signature */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={visibleCount >= ALL_WORDS.length ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <ContinueButton
            onClick={onContinue}
            label="Continuer vers le grand final"
            hint="✨ Le meilleur est pour la fin..."
          />
        </motion.div>

      </div>
    </section>
  );
}

