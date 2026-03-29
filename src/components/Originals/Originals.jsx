import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { moviesData } from '../../data/content';
import ContinueButton from '../ContinueButton/ContinueButton';
import styles from './Originals.module.css';

function FilmModal({ film, onClose }) {
  return (
    <motion.div
      className={styles.modalOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modalContent}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Film frame decoration */}
        <div className={styles.filmFrame}>
          <div className={styles.filmPerf}>
            {[...Array(8)].map((_, i) => <div key={i} className={styles.filmHole} />)}
          </div>

          <div className={styles.filmScreen}>
            {film.videoSrc ? (
              <video
                src={`/videos/${film.videoSrc}`}
                controls
                autoPlay
                className={styles.video}
              />
            ) : (
              <div className={styles.videoPlaceholder}>
                <div className={styles.projectorIcon}>🎬</div>
                <p className={styles.vpTitle}>{film.title}</p>
                <p className={styles.vpSub}>Dépose ta vidéo dans :</p>
                <code className={styles.vpPath}>public/videos/{film.id}.mp4</code>
              </div>
            )}
          </div>

          <div className={styles.filmPerf}>
            {[...Array(8)].map((_, i) => <div key={i} className={styles.filmHole} />)}
          </div>
        </div>

        {/* Film info */}
        <div className={styles.filmInfo}>
          <motion.p
            className={styles.filmDirectorTag}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            ✦ Un film de Ruben ✦
          </motion.p>
          <h3 className={styles.filmModalTitle}>{film.title}</h3>
          <p className={styles.filmModalDesc}>{film.description}</p>
          <button className="btn-primary" onClick={onClose}>Fermer</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FilmCard({ film, onOpen }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={styles.filmCard}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onOpen(film)}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{ duration: 0.2 }}
    >
      {/* Thumbnail */}
      <div className={styles.thumbnail}>
        {film.thumbnail ? (
          <img src={`/photos/${film.thumbnail}`} alt={film.title} className={styles.thumbImg} />
        ) : (
          <div className={styles.thumbPlaceholder}>
            <span>🎬</span>
            <p>Photo à ajouter</p>
          </div>
        )}

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className={styles.thumbOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles.playCircle}>▶</div>
              <p className={styles.thumbTitle}>{film.title}</p>
              <p className={styles.thumbDuration}>{film.duration}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Duration badge */}
        <div className={styles.durationBadge}>{film.duration}</div>
      </div>

      <div className={styles.filmCardInfo}>
        <p className={styles.filmCardTitle}>{film.title}</p>
        <p className={styles.filmCardSub}>{film.subtitle}</p>
      </div>
    </motion.div>
  );
}

export default function Originals({ onContinue }) {
  const [activeFilm, setActiveFilm] = useState(null);

  return (
    <section id="originals" className={`section ${styles.originalsSection}`}>
      {/* Netflix-style top bar */}
      <div className={styles.topBar}>
        <div className={styles.logoArea}>
          <span className={styles.logoR}>R</span>
          <div className={styles.logoText}>
            <span className={styles.logoMain}>RUBEN</span>
            <span className={styles.logoSub}>ORIGINALS</span>
          </div>
        </div>
        <div className={styles.topBarRight}>
          <span className={styles.topBarTag}>🎬 Production Exclusive</span>
        </div>
      </div>

      {/* Hero banner */}
      <motion.div
        className={styles.heroBanner}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className={styles.heroContent}>
          <p className={styles.heroTag}>✦ RUBEN ORIGINALS PRÉSENTE ✦</p>
          <h2 className={styles.heroTitle}>L'Odyssée de Gazou</h2>
          <p className={styles.heroDesc}>
            Une collection de films rares. Des moments vrais. Une histoire d'amour filmée dans la vie réelle.
          </p>
          <div className={styles.heroBtns}>
            <button
              className="btn-primary"
              onClick={() => setActiveFilm(moviesData.categories[0].films[0])}
            >
              ▶ Regarder
            </button>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <div className={styles.categories}>
        {moviesData.categories.map((cat, ci) => (
          <motion.div
            key={cat.title}
            className={styles.category}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ci * 0.1 }}
          >
            <h3 className={styles.catTitle}>{cat.emoji} {cat.title}</h3>
            <div className={styles.filmRow}>
              {cat.films.map((film) => (
                <FilmCard key={film.id} film={film} onOpen={setActiveFilm} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeFilm && (
          <FilmModal film={activeFilm} onClose={() => setActiveFilm(null)} />
        )}
      </AnimatePresence>

      <div style={{ padding: '2rem 3rem 3rem', display: 'flex', justifyContent: 'center' }}>
        <ContinueButton
          onClick={onContinue}
          hint="Une lettre t'attend..."
        />
      </div>
    </section>
  );
}
