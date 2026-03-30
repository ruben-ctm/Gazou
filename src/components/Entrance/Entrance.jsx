import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SECRET_CODE } from '../../data/content';
import styles from './Entrance.module.css';

export default function Entrance({ onUnlock }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [opening, setOpening] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [scanStatus, setScanStatus] = useState('idle'); // idle | scanning | error | success
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!showAudioModal) return;

    const handleDeviceChange = () => {
      // S'il y a un changement (elle branche un truc), on revérifie
      if (scanStatus === 'error' || scanStatus === 'idle') {
        checkHeadphones();
      }
    };

    if (navigator.mediaDevices && navigator.mediaDevices.ondevicechange !== undefined) {
      navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    }

    return () => {
      if (navigator.mediaDevices && navigator.mediaDevices.ondevicechange !== undefined) {
        navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
      }
    };
  }, [showAudioModal, scanStatus]);

  const checkHeadphones = async () => {
    setScanStatus('scanning');

    try {
      // Demande l'accès pour forcer la lecture des labels si possible (uniquement si rejeté avant)
      // Mais on ne force pas le prompt micro qui pourrait lui faire peur. On lit juste ce qui est dispo.
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioOutputs = devices.filter(d => d.kind === 'audiooutput');
      
      const hasHeadphones = audioOutputs.some(d => 
        /headphone|headset|airpod|bluetooth|casque|écouteur|earbud|bose|sony|jabra|buds|usb/i.test(d.label)
      );

      // Timeout artificiel pour le suspense
      setTimeout(() => {
        if (hasHeadphones) {
          setScanStatus('success');
          setTimeout(() => {
            setShowAudioModal(false);
            setOpening(true);
            setTimeout(onUnlock, 2200);
          }, 800);
        } else {
          setScanStatus('error');
          setAttempts(prev => prev + 1);
        }
      }, 1500);

    } catch (err) {
      setTimeout(() => {
        setScanStatus('error');
        setAttempts(prev => prev + 1);
      }, 1500);
    }
  };

  const handleOverride = () => {
    setScanStatus('success');
    setShowAudioModal(false);
    setOpening(true);
    setTimeout(onUnlock, 2200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.toLowerCase() === SECRET_CODE.toLowerCase()) {
      setShowAudioModal(true);
      setScanStatus('idle');
      setAttempts(0);
    } else {
      setError(true);
      setTimeout(() => { setError(false); setCode(''); }, 1000);
    }
  };


  return (
    <motion.div
      className={styles.entranceWrap}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background velvet texture */}
      <div className={styles.velvetBg} />

      {/* Decorative stars */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={styles.star}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
        >✨</motion.div>
      ))}

      {/* Left curtain */}
      <motion.div
        className={`${styles.curtain} ${styles.curtainLeft}`}
        animate={opening ? { x: '-100%' } : { x: 0 }}
        transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      >
        <div className={styles.curtainFold} />
        <div className={styles.curtainFold} />
        <div className={styles.curtainFold} />
      </motion.div>

      {/* Right curtain */}
      <motion.div
        className={`${styles.curtain} ${styles.curtainRight}`}
        animate={opening ? { x: '100%' } : { x: 0 }}
        transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      >
        <div className={styles.curtainFold} />
        <div className={styles.curtainFold} />
        <div className={styles.curtainFold} />
      </motion.div>

      {/* Gold top bar */}
      <div className={styles.goldBar} />

      {/* Center content */}
      <div className={styles.centerContent}>
        {/* Plaque dorée */}
        <motion.div
          className={styles.plaque}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className={styles.plaqueInner}>
            <p className={styles.plaqueSmall}>Accès réservé à</p>
            <h1 className={styles.plaqueName}>Gazou</h1>
            <div className={styles.plaqueDivider} />
            <p className={styles.plaqueTagline}>Une histoire, rien que pour toi</p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className={styles.form}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <p className={styles.hint}>Entre le code secret 🔒</p>
          <input
            ref={inputRef}
            type="password"
            className={`secret-input ${error ? 'error' : ''}`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Code secret..."
            autoComplete="off"
            disabled={opening}
          />
          <motion.button
            type="submit"
            className={`btn-primary ${styles.enterBtn}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            disabled={opening || showAudioModal || !code}
          >
            {opening ? '✨ Ouverture...' : 'Entrer'}
          </motion.button>

          <AnimatePresence>
            {error && (
              <motion.p
                className={styles.errorMsg}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                Ce n'est pas le bon code, Gazou... 🙈
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>
      </div>

      {/* Audio Modal */}
      <AnimatePresence>
        {showAudioModal && (
          <motion.div
            className={styles.audioModalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.audioModal}
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className={styles.audioIcon}>
                {scanStatus === 'scanning' ? '⏳' : scanStatus === 'error' ? '❌' : scanStatus === 'success' ? '✅' : '🎧'}
              </div>
              <h2 className={styles.audioTitle}>
                {scanStatus === 'scanning' ? 'Scan en cours...' : scanStatus === 'error' ? 'Vérification échouée' : scanStatus === 'success' ? 'Parfait !' : 'Expérience Immersive'}
              </h2>
              <p className={styles.audioText}>
                {scanStatus === 'scanning' ? (
                  "Recherche de vos écouteurs..."
                ) : scanStatus === 'error' ? (
                  "Aucun casque ou écouteur détecté. Assurez-vous qu'ils soient bien connectés à l'appareil."
                ) : scanStatus === 'success' ? (
                  "Écouteurs connectés. Préparez-vous..."
                ) : (
                  "Pour vivre pleinement <em>L'Odyssée de Gazou</em>, veuillez brancher vos écouteurs. Le son révélera tous nos souvenirs."
                )}
              </p>

              {scanStatus !== 'scanning' && scanStatus !== 'success' && (
                <button 
                  className={styles.audioBtn} 
                  onClick={checkHeadphones}
                  disabled={scanStatus === 'scanning'}
                >
                  {scanStatus === 'error' ? 'Réessayer' : 'Mes écouteurs sont mis !'}
                </button>
              )}

              {attempts >= 3 && scanStatus === 'error' && (
                <p 
                  style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '1rem', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={handleOverride}
                >
                  Bypass (Mes écouteurs sont mis mais non détectés)
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flash on unlock */}
      <AnimatePresence>
        {opening && (
          <motion.div
            className={styles.flash}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
