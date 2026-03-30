import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './index.css';

import Entrance from './components/Entrance/Entrance';
import Museum from './components/Museum/Museum';
import Jukebox from './components/Jukebox/Jukebox';
import Originals from './components/Originals/Originals';
import Letter from './components/Letter/Letter';
import Proposal from './components/Proposal/Proposal';
import Certificate from './components/Certificate/Certificate';
import KawaiiPopup from './components/KawaiiPopup/KawaiiPopup';
import FloatingParticles from './components/FloatingParticles';

// Sections indexées après l'entrée : 0=Museum, 1=Jukebox, 2=Originals, 3=Letter, 4=Proposal, 5=Certificate
const SECTIONS = ['museum', 'jukebox', 'originals', 'letter', 'proposal', 'certificate'];

function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [currentSection, setCurrentSection] = useState(0); // index dans SECTIONS
  const [proposalAccepted, setProposalAccepted] = useState(false);
  const [pinkTheme, setPinkTheme] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [kawaiiEvent, setKawaiiEvent] = useState(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    const saved = localStorage.getItem('gazouProgress');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state.unlocked) setUnlocked(true);
        if (state.currentSection) setCurrentSection(state.currentSection);
        if (state.proposalAccepted) setProposalAccepted(true);
        if (state.pinkTheme) setPinkTheme(true);
      } catch (e) {
        console.error("Erreur de sauvegarde:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('gazouProgress', JSON.stringify({
        unlocked,
        currentSection,
        proposalAccepted,
        pinkTheme
      }));
    }
  }, [unlocked, currentSection, proposalAccepted, pinkTheme, isLoaded]);

  useEffect(() => {
    document.body.classList.toggle('theme-pink', pinkTheme);
  }, [pinkTheme]);

  const triggerKawaii = (emoji, text, x, y) => {
    setKawaiiEvent({ emoji, text, x, y, id: Date.now() });
    setTimeout(() => setKawaiiEvent(null), 4000);
  };

  // Déverrouille la section suivante et scrolle vers elle
  const goToNext = (nextIndex) => {
    setCurrentSection(nextIndex);
    // Laisse le temps au composant de se rendre, puis scrolle
    setTimeout(() => {
      const id = SECTIONS[nextIndex];
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  if (!isLoaded) return null;

  return (
    <>
      <FloatingParticles unlocked={unlocked} />

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <Entrance
            key="entrance"
            onUnlock={() => {
              setUnlocked(true);
              triggerKawaii('🐱', 'Bienvenue, Gazou ! Je t\'attendais... 💛', window.innerWidth / 2, window.innerHeight / 2);
            }}
          />
        ) : (
          <main key="main">
            {/* Section 0 — Musée */}
            <motion.div variants={sectionVariants} initial="hidden" animate="visible">
              <Museum
                triggerKawaii={triggerKawaii}
                onContinue={() => goToNext(1)}
              />
            </motion.div>

            {/* Section 1 — Jukebox */}
            {currentSection >= 1 && (
              <motion.div variants={sectionVariants} initial="hidden" animate="visible">
                <Jukebox
                  triggerKawaii={triggerKawaii}
                  onContinue={() => goToNext(2)}
                />
              </motion.div>
            )}

            {/* Section 2 — Ruben Originals */}
            {currentSection >= 2 && (
              <motion.div variants={sectionVariants} initial="hidden" animate="visible">
                <Originals onContinue={() => goToNext(3)} />
              </motion.div>
            )}

            {/* Section 3 — Lettre */}
            {currentSection >= 3 && (
              <motion.div variants={sectionVariants} initial="hidden" animate="visible">
                <Letter onContinue={() => goToNext(4)} />
              </motion.div>
            )}

            {/* Section 4 — Demande */}
            {currentSection >= 4 && (
              <motion.div variants={sectionVariants} initial="hidden" animate="visible">
                <Proposal
                  onAccept={(pink) => {
                    setProposalAccepted(true);
                    if (pink) setPinkTheme(true);
                    triggerKawaii('💍', 'Je savais que tu dirais oui 🥹', window.innerWidth / 2, window.innerHeight / 3);
                    setTimeout(() => goToNext(5), 1200);
                  }}
                />
              </motion.div>
            )}

            {/* Section 5 — Certificat */}
            {currentSection >= 5 && proposalAccepted && (
              <motion.div variants={sectionVariants} initial="hidden" animate="visible">
                <Certificate />
              </motion.div>
            )}
          </main>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {kawaiiEvent && <KawaiiPopup key={kawaiiEvent.id} event={kawaiiEvent} />}
      </AnimatePresence>
    </>
  );
}

export default App;

