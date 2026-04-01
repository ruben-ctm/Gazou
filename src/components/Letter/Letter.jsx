import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { letterText } from '../../data/content';
import { useFadingAudio } from '../../hooks/useFadingAudio';
import ContinueButton from '../ContinueButton/ContinueButton';
import styles from './Letter.module.css';

const PARAGRAPHS = letterText.split('\n').filter(line => line.trim() !== '');
const PARAGRAPHS_PER_PAGE = 4;

// Divise les paragraphes en pages
const PAGES = [];
for (let i = 0; i < PARAGRAPHS.length; i += PARAGRAPHS_PER_PAGE) {
  PAGES.push(PARAGRAPHS.slice(i, i + PARAGRAPHS_PER_PAGE));
}

const WORDS_PER_SECOND = 12;

export default function Letter({ onContinue }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef(null);

  useFadingAudio('/music/Spandau_Ballet_-_True_HD_Remastered.mp3', isInView, 1200);

  const pageParagraphs = PAGES[currentPage];
  const pageWords = pageParagraphs.flatMap((para, pIdx) =>
    para.split(' ').map((word, wIdx) => ({ word, pIdx, wIdx, key: `${pIdx}-${wIdx}` }))
  );

  // Démarre le typewriter quand la page est visible
  useEffect(() => {
    if (!isInView) return;
    setVisibleCount(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    let count = 0;
    intervalRef.current = setInterval(() => {
      count += 1;
      setVisibleCount(count);
      if (count >= pageWords.length) clearInterval(intervalRef.current);
    }, 1000 / WORDS_PER_SECOND);
    return () => clearInterval(intervalRef.current);
  }, [isInView, currentPage]);

  const goToNextPage = () => {
    setDirection(1);
    setCurrentPage(p => p + 1);
  };

  const isLastPage = currentPage === PAGES.length - 1;
  const pageFinished = visibleCount >= pageWords.length;

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <section id="letter" ref={sectionRef} className={`section ${styles.letterSection}`}>
      <div className={styles.letterWrap}>
        {/* Wax seal */}
        <motion.div className={styles.envelopeTop} initial={{ opacity: 0, y: -20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <div className={styles.waxSeal}><span className={styles.sealInitials}>R</span></div>
        </motion.div>

        {/* Heading */}
        <motion.div className={styles.letterHead} initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.4 }}>
          <h2 className="section-title">La Lettre Finale</h2>
          <p className="section-subtitle">À lire lentement, comme on vivrait les choses...</p>
          <div className="gold-divider" />
        </motion.div>

        {/* Paper with animated page */}
        <motion.div className={styles.paper} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay: 0.6 }} style={{ overflow: 'hidden' }}>
          {[...Array(30)].map((_, i) => <div key={i} className={styles.paperLine} style={{ top: `${3 + i * 3.6}rem` }} />)}

          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentPage}
              className={styles.letterContent}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {pageParagraphs.map((para, pIdx) => {
                const wordsBeforeThisPara = pageWords.filter(w => w.pIdx < pIdx).length;
                return (
                  <p key={pIdx} className={styles.letterParagraph}>
                    {para.split(' ').map((word, wIdx) => {
                      const globalIdx = wordsBeforeThisPara + wIdx;
                      const visible = globalIdx < visibleCount;
                      return (
                        <motion.span key={wIdx} className={styles.word} initial={{ opacity: 0, y: 6 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.3 }}>
                          {word}{' '}
                        </motion.span>
                      );
                    })}
                  </p>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Indicateur de page */}
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(100,60,30,0.4)', fontFamily: 'Inter, sans-serif' }}>
            {currentPage + 1} / {PAGES.length}
          </div>
        </motion.div>

        {/* Bouton page suivante */}
        <AnimatePresence>
          {pageFinished && !isLastPage && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={goToNextPage}
              style={{
                background: 'none',
                border: '1px solid var(--gold)',
                borderRadius: '8px',
                padding: '0.6rem 1.5rem',
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1rem',
                color: 'var(--gold)',
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              Page suivante →
            </motion.button>
          )}
        </AnimatePresence>

        {/* Signature — dernière page uniquement */}
        {isLastPage && (
          <motion.div className={styles.signatureArea} initial={{ opacity: 0 }} animate={pageFinished ? { opacity: 1 } : {}} transition={{ duration: 1 }}>
            <p className={styles.signatureText}>— Ruben, avec tout son amour 💛</p>
          </motion.div>
        )}

        {/* Continue button */}
        {isLastPage && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={pageFinished ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.6 }}>
            <ContinueButton onClick={onContinue} label="Continuer vers le grand final" hint="✨ Le meilleur est pour la fin..." />
          </motion.div>
        )}
      </div>
    </section>
  );
}
