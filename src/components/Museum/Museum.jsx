import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { timelineEvents } from '../../data/content';
import ContinueButton from '../ContinueButton/ContinueButton';
import styles from './Museum.module.css';

function PhotoCard({ event, onFlip, triggerKawaii }) {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const handleFlip = () => {
    setFlipped(!flipped);
    if (!flipped) {
      onFlip?.();
    }
  };

  const handleStickerClick = (e) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    triggerKawaii(event.sticker, event.insideJoke, rect.x + rect.width / 2, rect.y);
  };

  return (
    <motion.div
      ref={ref}
      className={styles.cardWrapper}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Sticker kawaii */}
      <motion.button
        className={styles.stickerBtn}
        onClick={handleStickerClick}
        whileHover={{ scale: 1.3, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        title="Clique sur moi !"
      >
        {event.sticker}
      </motion.button>

      {/* Flip card */}
      <div
        className={`${styles.flipCard} ${flipped ? styles.flipped : ''}`}
        onClick={handleFlip}
      >
        <div className={styles.flipInner}>
          {/* Front */}
          <div className={styles.flipFront}>
            {event.photo ? (
              <img
                src={`/photos/${event.photo}`}
                alt={event.title}
                className={styles.photo}
              />
            ) : (
              <div className={styles.photoPlaceholder}>
                <span className={styles.placeholderIcon}>📸</span>
                <p>Ta photo ici</p>
                <p className={styles.placeholderSub}>{`photos/${event.id}.jpg`}</p>
              </div>
            )}
            <div className={styles.hoverHint}>
              <span>Retourne-moi 🙈</span>
            </div>
          </div>

          {/* Back */}
          <div className={styles.flipBack}>
            {event.funnyPhoto ? (
              <img
                src={`/photos/${event.funnyPhoto}`}
                alt="Version dossier"
                className={styles.photo}
              />
            ) : (
              <div className={`${styles.photoPlaceholder} ${styles.funnyPlaceholder}`}>
                <span className={styles.placeholderIcon}>🤣</span>
                <p>La face cachée !</p>
              </div>
            )}
            <div className={styles.funnyCaption}>{event.funnyCaption}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TimelineItem({ event, index, triggerKawaii }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const isLeft = index % 2 === 0;

  const handleFlip = () => {
    triggerKawaii('🌸', 'Haha, je t\'avais pas dit ça ! 😂', window.innerWidth / 2, window.innerHeight / 2);
  };

  return (
    <motion.div
      ref={ref}
      className={`${styles.timelineItem} ${isLeft ? styles.left : styles.right}`}
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Date bubble */}
      <div className={styles.dateBubble}>{event.date}</div>

      {/* Connector dot */}
      <div className={styles.connector}>
        <div className={styles.dot} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <PhotoCard event={event} onFlip={handleFlip} triggerKawaii={triggerKawaii} />
        <div className={styles.textBlock}>
          <h3 className={styles.eventTitle}>{event.title}</h3>
          <p className={styles.eventDesc}>{event.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Museum({ triggerKawaii, onContinue }) {
  return (
    <section id="museum" className={`section ${styles.museumSection}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="section-title">Le Musée des 5 Ans</h2>
        <p className="section-subtitle">Juin 2022 — Aujourd'hui · Une collection de moments précieux</p>
        <div className="gold-divider" />
      </motion.div>

      <div className={styles.timeline}>
        <div className={styles.timelineLine} />
        {timelineEvents.map((event, index) => (
          <TimelineItem
            key={event.id}
            event={event}
            index={index}
            triggerKawaii={triggerKawaii}
          />
        ))}
      </div>

      <ContinueButton
        onClick={onContinue}
        hint="Le Jukebox de Sabrina t'attend..."
      />
    </section>
  );
}

