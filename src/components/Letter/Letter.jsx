import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { letterText } from '../../data/content';
import ContinueButton from '../ContinueButton/ContinueButton';
import styles from './Letter.module.css';

const WORDS = letterText.split(/(\s+)/);

function TypewriterWord({ word, index, scrollProgress }) {
  const start = index / WORDS.length;
  const end = start + 0.02;
  const opacity = useTransform(scrollProgress, [start, end], [0, 1]);
  const y = useTransform(scrollProgress, [start, end], [8, 0]);
  const isSpace = /^\s+$/.test(word);
  if (isSpace) return <span style={{ whiteSpace: 'pre' }}>{word}</span>;
  return (
    <motion.span style={{ opacity, y, display: 'inline-block' }}>
      {word}
    </motion.span>
  );
}

export default function Letter({ onContinue }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Remap scroll so letter starts gently and ends near the bottom
  const letterProgress = useTransform(scrollYProgress, [0.05, 0.85], [0, 1]);

  return (
    <section
      id="letter"
      ref={sectionRef}
      className={`section ${styles.letterSection}`}
      style={{ minHeight: '500vh' }}
    >
      <div className={styles.letterWrap}>
        {/* Decorative envelope top */}
        <motion.div
          className={styles.envelopeTop}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.waxSeal}>
            <span className={styles.sealInitials}>R</span>
          </div>
        </motion.div>

        {/* Letter heading */}
        <motion.div
          className={styles.letterHead}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h2 className="section-title">La Lettre Finale</h2>
          <p className="section-subtitle">À lire lentement, comme on vivrait les choses...</p>
          <div className="gold-divider" />
        </motion.div>

        {/* The letter paper */}
        <motion.div
          className={styles.paper}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          {/* Paper lines decoration */}
          {[...Array(20)].map((_, i) => (
            <div key={i} className={styles.paperLine} style={{ top: `${3 + i * 4.2}rem` }} />
          ))}

          <div className={styles.letterContent}>
            <p className={styles.letterBody}>
              {WORDS.map((word, i) => (
                <TypewriterWord
                  key={i}
                  word={word}
                  index={i}
                  scrollProgress={letterProgress}
                />
              ))}
            </p>
          </div>
        </motion.div>

        {/* Signature decoration */}
        <motion.div
          className={styles.signatureArea}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <p className={styles.signatureText}>— Ruben, avec tout son amour 💛</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
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
