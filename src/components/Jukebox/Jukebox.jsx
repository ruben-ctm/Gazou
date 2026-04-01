import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { blindTestRounds } from '../../data/content';
import { useFadingAudio } from '../../hooks/useFadingAudio';
import ContinueButton from '../ContinueButton/ContinueButton';
import styles from './Jukebox.module.css';

const ALBUM_COVERS = [
  '/photos_album/bc.png',
  '/photos_album/mc.png',
  '/photos_album/p.png',
  '/photos_album/ist.png',
];

const THEMES = [
  { primary: '#ff8c69', secondary: '#ffd4b2', bg1: '#fff0e8', bg2: '#ffe0cc', vinyl: '#4a2010', vinylMid: '#6a3520' },
  { primary: '#9b7fd4', secondary: '#d4b8f0', bg1: '#f3eeff', bg2: '#e8ddf8', vinyl: '#1e1040', vinylMid: '#3a2060' },
  { primary: '#4facfe', secondary: '#a8edea', bg1: '#eaf6ff', bg2: '#d8f0f8', vinyl: '#0a2040', vinylMid: '#1a3560' },
  { primary: '#f7971e', secondary: '#ffd200', bg1: '#fff8e0', bg2: '#fff0c0', vinyl: '#3a2800', vinylMid: '#5a4010' },
];

export default function Jukebox({ triggerKawaii, onContinue }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle | playing | answered | success | complete
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isVinylSpinning, setIsVinylSpinning] = useState(false);
  const [nonsenseMode, setNonsenseMode] = useState(false);
  const [typedKeys, setTypedKeys] = useState('');
  const [score, setScore] = useState(0);
  const audioRef = useRef(null);
  const round = blindTestRounds[currentRound];
  const theme = THEMES[currentRound] || THEMES[0];
  const albumCover = ALBUM_COVERS[currentRound] || ALBUM_COVERS[0];

  // Easter egg: type "Nonsense"
  useEffect(() => {
    const handleKey = (e) => {
      const newStr = (typedKeys + e.key).slice(-8).toLowerCase();
      setTypedKeys(newStr);
      if (newStr === 'nonsense') {
        setNonsenseMode((prev) => {
          if (!prev) triggerKawaii('🎵', 'Tu as trouvé le secret ! 🎉', window.innerWidth / 2, 200);
          return !prev;
        });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [typedKeys, triggerKawaii]);

  useFadingAudio(round?.audioSrc, phase === 'playing' || phase === 'answered', 800);

  const handlePlay = () => {
    setPhase('playing');
    setIsVinylSpinning(true);
  };

  const handleAnswer = (index) => {
    if (phase !== 'playing') return;
    setSelectedAnswer(index);
    const correct = index === round.correctIndex;
    setIsCorrect(correct);
    setPhase('answered');

    if (correct) {
      setScore((s) => s + 1);
      triggerKawaii('⭐', round.successMessage, window.innerWidth / 2, window.innerHeight / 3);
    }

    setTimeout(() => {
      if (currentRound < blindTestRounds.length - 1) {
        setCurrentRound((r) => r + 1);
        setPhase('idle');
        setSelectedAnswer(null);
        setIsCorrect(null);
        setIsVinylSpinning(false);
      } else {
        setPhase('complete');
        setIsVinylSpinning(false);
      }
    }, 2500);
  };

  const handleReset = () => {
    setCurrentRound(0);
    setPhase('idle');
    setSelectedAnswer(null);
    setIsCorrect(null);
    setIsVinylSpinning(false);
    setScore(0);
  };

  const themeVars = useMemo(() => ({
    '--jb-primary': theme.primary,
    '--jb-secondary': theme.secondary,
    '--jb-bg1': theme.bg1,
    '--jb-bg2': theme.bg2,
    '--jb-vinyl': theme.vinyl,
    '--jb-vinyl-mid': theme.vinylMid,
  }), [theme]);

  return (
    <section
      id="jukebox"
      data-section-scroll="true"
      className={`section ${styles.jukeboxSection} ${nonsenseMode ? styles.nonsenseMode : ''}`}
      style={themeVars}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="section-title">Le Jukebox</h2>
        <p className="section-subtitle">Réponds juste et découvre nos chansons</p>
        <div className="gold-divider" />
      </motion.div>

      <div className={styles.jukeboxBody}>
        {/* Vinyl player */}
        <div className={styles.playerSide}>
          <div className={styles.playerCase}>
            {/* Top speaker grille */}
            <div className={styles.speakerGrille}>
              {[...Array(12)].map((_, i) => <div key={i} className={styles.speakerDot} />)}
            </div>

            {/* Vinyl */}
            <div className={styles.vinylWrap}>
              <motion.div
                className={styles.vinyl}
                animate={{ rotate: isVinylSpinning ? 360 : 0 }}
                transition={{ duration: 2, repeat: isVinylSpinning ? Infinity : 0, ease: 'linear' }}
              >
                {/* Groove rings */}
                <div className={styles.grooveRing1} />
                <div className={styles.grooveRing2} />
                <div className={styles.grooveRing3} />

                <div className={styles.vinylLabel}>
                  <img
                    src={albumCover}
                    alt="Album cover"
                    className={styles.albumCover}
                    draggable={false}
                  />
                  <div className={styles.labelOverlay}>
                    <span className={styles.vinylSong}>
                      {phase !== 'idle' ? round?.song : '???'}
                    </span>
                  </div>
                  <div className={styles.labelHole} />
                </div>
              </motion.div>

              {/* Tonearm */}
              <motion.div
                className={styles.tonearm}
                animate={{ rotate: isVinylSpinning ? 0 : 25 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                <div className={styles.tonearmHead} />
              </motion.div>
            </div>

            {/* Play button */}
            <motion.button
              className={styles.playBtn}
              onClick={handlePlay}
              disabled={phase !== 'idle'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {phase === 'idle' ? '▶ Écouter' : '🎵 En cours...'}
            </motion.button>

            {/* LED display */}
            <div className={styles.ledDisplay}>
              <span className={nonsenseMode ? styles.ledActive : ''}>
                {nonsenseMode ? '✨ NONSENSE MODE ✨' : `PISTE ${currentRound + 1} / ${blindTestRounds.length}`}
              </span>
            </div>

            {/* Decorative knobs */}
            <div className={styles.knobRow}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className={styles.knob}>
                  <div className={styles.knobIndicator} />
                </div>
              ))}
            </div>
          </div>

          {/* Sparkles décoration */}
          {nonsenseMode && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className={styles.sparkle}
                  style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                  transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                >✨</motion.div>
              ))}
            </>
          )}
        </div>

        {/* Game side */}
        <div className={styles.gameSide}>
          <AnimatePresence mode="wait">
            {phase === 'complete' ? (
              <motion.div
                key="complete"
                className={styles.complete}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className={styles.completeIcon}>🎉</p>
                <h3 className={styles.completeTitle}>Bravo Gazou !</h3>
                <p className={styles.completeScore}>{score} / {blindTestRounds.length} bonnes réponses</p>
                <p className={styles.completeSub}>Tu connais nos souvenirs par cœur 💛</p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button className="btn-primary" onClick={handleReset}>Rejouer</button>
                  <ContinueButton onClick={onContinue} label="La suite" theme="jukebox" />
                </div>
              </motion.div>
            ) : phase === 'idle' ? (
              <motion.div
                key="idle"
                className={styles.gamePrompt}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className={styles.promptEmoji}>🎵</p>
                <p className={styles.promptText}>
                  Appuie sur <strong>Écouter</strong> pour lancer la musique, puis devine quel souvenir correspond.
                </p>
                <p className={styles.promptHint}>
                  Tip secret : tape <em>"Nonsense"</em> sur ton clavier... 🤫
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={`round-${currentRound}`}
                className={styles.questionBlock}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                <p className={styles.roundLabel}>Chanson {currentRound + 1}</p>
                <p className={styles.question}>{round.question}</p>
                <div className={styles.choices}>
                  {round.choices.map((choice, i) => (
                    <motion.button
                      key={i}
                      className={`${styles.choiceBtn} ${
                        selectedAnswer !== null
                          ? i === round.correctIndex
                            ? styles.correct
                            : i === selectedAnswer
                            ? styles.wrong
                            : styles.dimmed
                          : ''
                      }`}
                      onClick={() => handleAnswer(i)}
                      disabled={phase === 'answered'}
                      whileHover={phase === 'playing' ? { scale: 1.02, x: 4 } : {}}
                      whileTap={phase === 'playing' ? { scale: 0.98 } : {}}
                    >
                      <span className={styles.choiceLetter}>{String.fromCharCode(65 + i)}</span>
                      {choice}
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence>
                  {phase === 'answered' && (
                    <motion.p
                      className={`${styles.feedback} ${isCorrect ? styles.feedbackOk : styles.feedbackWrong}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {isCorrect ? round.successMessage : '😅 Pas tout à fait... mais tu fais tes meilleurs!'}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <audio ref={audioRef} style={{ display: 'none' }} />
    </section>
  );
}
