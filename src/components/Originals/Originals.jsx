import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { moviesData } from '../../data/content';
import ContinueButton from '../ContinueButton/ContinueButton';
import styles from './Originals.module.css';

function StoryPlayer({ activeFilmId, allFilms, onClose, onUpdateLastWatched }) {
  const startIndex = allFilms.findIndex(f => f.id === activeFilmId);
  const [currentIndex, setCurrentIndex] = useState(startIndex !== -1 ? startIndex : 0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const currentFilm = allFilms[currentIndex];

  const handleNext = (e) => {
    e?.stopPropagation();
    if (currentIndex < allFilms.length - 1) {
      setCurrentIndex(currentIndex + 1);
      onUpdateLastWatched(allFilms[currentIndex + 1].id);
    } else {
      onClose();
    }
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      onUpdateLastWatched(allFilms[currentIndex - 1].id);
    }
  };

  const togglePlay = (e) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      className={styles.storyOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.storyHeader}>
        <div className={styles.storyProgressInfo}>
           <span className={styles.storyProgressCount}>{currentIndex + 1} / {allFilms.length}</span>
           <span className={styles.storyTitle}>{currentFilm.title}</span>
        </div>
        <button className={styles.storyClose} onClick={(e) => { e.stopPropagation(); onClose(); }}>×</button>
      </div>

      <div className={styles.storyVideoContainer}>
        <video 
           key={currentFilm.videoSrc}
           ref={videoRef}
           src={`/videos/${currentFilm.videoSrc}`}
           className={styles.storyVideo}
           autoPlay
           playsInline
           onEnded={handleNext}
           onPlay={() => setIsPlaying(true)}
           onPause={() => setIsPlaying(false)}
        />
        {!isPlaying && <div className={styles.pausedIndicator}>⏸</div>}
      </div>

      <div className={styles.tapZones}>
         <div className={styles.tapLeft} onClick={handlePrev} />
         <div className={styles.tapCenter} onClick={togglePlay} />
         <div className={styles.tapRight} onClick={handleNext} />
      </div>
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
  const [activeFilmId, setActiveFilmId] = useState(null);
  const [lastWatchedVideoId, setLastWatchedVideoId] = useState(null);
  
  const allFilms = moviesData.categories.flatMap(cat => cat.films);

  const handlePlayMain = () => {
    // Reprend la dernière vidéo regardée, ou la première
    if (lastWatchedVideoId) {
      setActiveFilmId(lastWatchedVideoId);
    } else if (allFilms.length > 0) {
      setActiveFilmId(allFilms[0].id);
      setLastWatchedVideoId(allFilms[0].id);
    }
  };

  const openFilm = (film) => {
    setActiveFilmId(film.id);
    setLastWatchedVideoId(film.id);
  };

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
              onClick={handlePlayMain}
            >
              ▶ {lastWatchedVideoId ? "Reprendre" : "Regarder"}
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
                <FilmCard key={film.id} film={film} onOpen={openFilm} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeFilmId && (
          <StoryPlayer 
            activeFilmId={activeFilmId} 
            allFilms={allFilms} 
            onClose={() => setActiveFilmId(null)} 
            onUpdateLastWatched={setLastWatchedVideoId}
          />
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
