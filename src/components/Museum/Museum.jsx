import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { timelineEvents, friendStories, discoverStories, conversationSnaps, conversationMessages } from '../../data/content';
import { useFadingAudio } from '../../hooks/useFadingAudio';
import ContinueButton from '../ContinueButton/ContinueButton';
import styles from './Museum.module.css';

/* SVG icon components */
const SvgCamera = ({ size = 24, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const SvgChat = ({ size = 24, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'scaleX(-1)' }}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const SvgLocation = ({ size = 24, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SvgFriends = ({ size = 24, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const SvgChevronLeft = ({ size = 24, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const SvgStories = ({ size = 24, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const SvgSearch = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const SvgAddFriend = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

const SvgMore = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
  </svg>
);

const SvgPencil = ({ size = 22, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const SvgFlip = ({ size = 22, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);

const SvgFlash = ({ size = 22, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    <line x1="3" y1="3" x2="21" y2="21" strokeWidth="2" />
  </svg>
);

const SvgMoon = ({ size = 22, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const SvgChevronDown = ({ size = 18, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SvgCameraOutline = ({ size = 22, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const SvgChatOutline = ({ size = 22, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const SvgMic = ({ size = 20, color = '#8E8E93' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" fill={color} stroke="none" />
    <path d="M19 10v2a7 7 0 01-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const SvgSmiley = ({ size = 22, color = '#8E8E93' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);
/* ============================================================
   BOTTOM NAV BAR (shared)
   ============================================================ */
function BottomNav({ active, onNav }) {
  return (
    <div className={styles.bottomNav}>
      <button className={`${styles.navTab} ${active === 'chats' ? styles.navTabActive : ''}`} onClick={() => onNav('chats')}>
        <div className={styles.navIconWrap}>
          <SvgChat size={28} color={active === 'chats' ? '#fff' : '#8E8E93'} />
          <span className={styles.navBadgeRed}>31</span>
        </div>
      </button>
      <button className={`${styles.navTab} ${styles.navTabCenter} ${active === 'camera' ? styles.navTabActive : ''}`} onClick={() => onNav('camera')}>
        <SvgCamera size={36} color={active === 'camera' ? '#fff' : '#8E8E93'} />
      </button>
      <button className={`${styles.navTab} ${active === 'stories' ? styles.navTabActive : ''}`} onClick={() => onNav('stories')}>
        <div className={styles.navIconWrap}>
          <SvgFriends size={28} color={active === 'stories' ? '#fff' : '#8E8E93'} />
          <span className={styles.navDotRed} />
        </div>
      </button>
    </div>
  );
}

/* ============================================================
   HEADER BAR (shared for chats/stories)
   ============================================================ */
function HeaderBar({ title, onBack }) {
  return (
    <div className={styles.headerBar}>
      <div className={styles.headerLeft}>
        <div className={styles.avatarSmall} onClick={onBack}>
          <span>🐱</span>
        </div>
        <button className={styles.headerIconBtn}><SvgSearch size={22} color="#fff" /></button>
      </div>
      <h2 className={styles.headerTitle}>{title}</h2>
      <div className={styles.headerRight}>
        <div className={styles.addFriendBtn}>
          <SvgAddFriend size={18} color="#fff" />
          <span className={styles.addFriendBadge}>5</span>
        </div>
        <button className={styles.headerIconBtn}><SvgMore size={20} color="#fff" /></button>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN MUSEUM COMPONENT
   ============================================================ */
export default function Museum({ triggerKawaii, onContinue }) {
  const [view, setView] = useState('camera');
  const [snapIndex, setSnapIndex] = useState(0);
  const dragX = useMotionValue(0);

  const currentEvent = timelineEvents[snapIndex] || timelineEvents[0];

  const handleDragEnd = (_event, info) => {
    const threshold = 80;
    if (info.offset.x < -threshold && view === 'camera') {
      setView('stories');
    } else if (info.offset.x > threshold && view === 'camera') {
      setView('chats');
    }
    dragX.set(0);
  };

  const goToSnap = (index) => {
    setSnapIndex(index);
    setView('camera');
  };

  const handleNav = (target) => {
    if (target === 'camera') setView('camera');
    else if (target === 'chats') setView('chats');
    else if (target === 'stories') setView('stories');
  };

  const [openedSnaps, setOpenedSnaps] = useState(() => {
    try {
      const saved = localStorage.getItem('museumOpenedSnaps');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const [seenStories, setSeenStories] = useState(() => {
    try {
      const saved = localStorage.getItem('museumSeenStories');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  useEffect(() => {
    localStorage.setItem('museumOpenedSnaps', JSON.stringify([...openedSnaps]));
  }, [openedSnaps]);

  useEffect(() => {
    localStorage.setItem('museumSeenStories', JSON.stringify([...seenStories]));
  }, [seenStories]);

  const handleOpenSnap = (id) => {
    setOpenedSnaps(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleMarkSeenStory = (storyId) => {
    setSeenStories(prev => {
      const next = new Set(prev);
      next.add(storyId);
      return next;
    });
  };

  const isAllOpened = openedSnaps.size >= 9;

  return (
    <section id="museum" className={styles.snapSection}>
      <AnimatePresence>
        {view === 'camera' && (
          <CameraView
            key="camera"
            event={currentEvent}
            onDragEnd={handleDragEnd}
            onNextSnap={() => setSnapIndex(Math.floor(Math.random() * timelineEvents.length))}
            onPrevSnap={() => { }} // Disabled as requested

            triggerKawaii={triggerKawaii}
            onNav={handleNav}
          />
        )}
        {view === 'chats' && (
          <ChatsView key="chats" isAllOpened={isAllOpened} onSelect={() => setView('conversation')} onBack={() => setView('camera')} onNav={handleNav} />
        )}
        {view === 'conversation' && (
          <ConversationView key="conversation" events={timelineEvents} openedSnaps={openedSnaps} onOpenSnap={handleOpenSnap} onBack={() => setView('chats')} />
        )}
        {view === 'stories' && (
          <StoriesView
            key="stories"
            events={timelineEvents}
            seenStories={seenStories}
            onMarkSeen={handleMarkSeenStory}
            onSelect={goToSnap}
            onBack={() => setView('camera')}
            onContinue={onContinue}
            onNav={handleNav}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ============================================================
   CAMERA VIEW
   ============================================================ */
function CameraView({ event, onDragEnd, onNextSnap, onPrevSnap, triggerKawaii, onNav }) {
  return (
    <motion.div
      className={styles.cameraView}
      style={{ position: 'absolute', width: '100%', height: '100%', touchAction: 'pan-x' }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Background photo */}
      <div className={styles.snapBg}>
        {event.photo ? (
          <img src={`/photos/${event.photo}`} alt={event.title} className={styles.snapPhoto} />
        ) : (
          <div className={styles.snapBgFallback} />
        )}
      </div>

      {/* Top bar */}
      <div className={styles.cameraTopBar}>
        <div className={styles.cameraTopLeft}>
          <div className={styles.avatarSmallYellow}><span>🐱</span></div>
        </div>
        <div className={styles.cameraTopRight}>
          <button className={styles.cameraIconBtn}><SvgSearch size={22} color="#fff" /></button>
          <div className={styles.addFriendBtnSmall}>
            <SvgAddFriend size={18} color="#fff" />
            <span className={styles.addFriendBadgeSmall}>5</span>
          </div>
          <button className={styles.cameraIconBtn}><SvgFlip size={22} color="#fff" /></button>
        </div>
      </div>

      {/* Right side icons */}
      <div className={styles.cameraSideIcons}>
        <button className={styles.sideIconBtn}><SvgFlip size={20} color="#fff" /></button>
        <button className={styles.sideIconBtn}><SvgFlash size={20} color="#fff" /></button>
        <button className={styles.sideIconBtn}><span style={{ fontSize: '16px' }}>🎵</span></button>
        <button className={styles.sideIconBtn}><span className={styles.hdLabel}>HD</span></button>
        <button className={styles.sideIconBtn}><SvgMoon size={20} color="#fff" /></button>
        <button className={styles.sideIconBtn}><SvgCameraOutline size={20} color="#fff" /></button>
        <button className={styles.sideIconBtn}><SvgChevronDown size={16} color="#fff" /></button>
      </div>

      {/* Sticker */}
      <motion.div
        className={styles.snapSticker}
        whileTap={{ scale: 1.4 }}
        onClick={() => triggerKawaii(event.sticker, event.insideJoke, window.innerWidth * 0.8, window.innerHeight * 0.3)}
      >
        {event.sticker}
      </motion.div>

      {/* Tap zones (Disabled photo changing as requested) */}
      <div className={styles.tapLeft} />
      <div className={styles.tapRight} />

      {/* Zoom selector */}
      <div className={styles.zoomPill}>
        <span className={styles.zoomItem}>.5</span>
        <span className={`${styles.zoomItem} ${styles.zoomActive}`}>1x</span>
        <span className={styles.zoomItem}>2</span>
      </div>

      {/* Shutter row */}
      <div className={styles.shutterRow}>
        <button className={styles.galleryBtn}>
          {event.photo ? (
            <img src={`/photos/${event.photo}`} className={styles.galleryThumb} alt="" />
          ) : (
            <span>🖼️</span>
          )}
        </button>
        <motion.button className={styles.shutterBtn} whileTap={{ scale: 0.92 }} onClick={onNextSnap}>
          <div className={styles.shutterInner} />
        </motion.button>
        <div className={styles.shutterRightGroup}>
          <div className={styles.lensBtn}><span>😊</span></div>
          {timelineEvents.slice(0, 2).map((e, i) => (
            <div key={i} className={styles.faceThumbnail}>
              {e.photo && <img src={`/photos/${e.photo}`} alt="" className={styles.faceThumbnailImg} />}
            </div>
          ))}
        </div>
      </div>

      {/* Lens tabs */}
      <div className={styles.lensTabs}>
        <span className={styles.lensTab}>Favourites</span>
        <span className={`${styles.lensTab} ${styles.lensTabActive}`}>For you</span>
        <span className={styles.lensTab}>Easter</span>
        <span className={styles.lensTab}>Aesthetic</span>
      </div>

      {/* Bottom nav */}
      <BottomNav active="camera" onNav={onNav} />
    </motion.div>
  );
}

/* ============================================================
   CHATS VIEW
   ============================================================ */
function ChatsView({ isAllOpened, onSelect, onBack, onNav }) {
  const handleDragEnd = (_event, info) => {
    if (info.offset.x < -80) onBack(); // Swipe left back to camera
  };

  return (
    <motion.div
      className={styles.chatsView}
      style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 10, touchAction: 'pan-y' }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      dragDirectionLock
      onDragEnd={handleDragEnd}
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <HeaderBar title="Chat" onBack={onBack} />

      {/* Filter tabs */}
      <div className={styles.filterTabs}>
        <div className={`${styles.filterTab} ${styles.filterTabActive}`}>
          Unread<span className={styles.filterBadge}>9+</span>
        </div>
      </div>

      {/* Chat list */}
      <div className={styles.chatsList} style={{ touchAction: 'pan-y' }}>
        <motion.div
          className={styles.chatItem}
          whileTap={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
          onClick={() => onSelect()}
        >
          <div className={styles.chatAvatar}>
            <span className={styles.chatAvatarEmoji}>🦄</span>
          </div>
          <div className={styles.chatInfo}>
            <div className={styles.chatNameRow}>
              <p className={styles.chatName}>rubenaliasbestiecentaure</p>
              <span className={styles.chatPinIcon}>📌</span>
            </div>
            <p className={styles.chatSubtitle} style={{ color: isAllOpened ? '#8E8E93' : '#FF3B30' }}>
              {isAllOpened ? (
                <span className={styles.chatIconOpened} style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid #FF3B30', borderRadius: '3px', flexShrink: 0, marginRight: '4px' }} />
              ) : (
                <span className={styles.redSquare} />
              )}
              {isAllOpened ? 'Opened' : '9+ new Snaps'} · 1m
            </p>
          </div>
          <div className={styles.chatAction}>
            <SvgCameraOutline size={22} color="rgba(255,255,255,0.5)" />
          </div>
        </motion.div>
      </div>

      {/* FAB */}
      <button className={styles.fab}>
        <SvgPencil size={22} color="#000" />
      </button>

      <BottomNav active="chats" onNav={onNav} />
    </motion.div>
  );
}

/* ============================================================
   STORIES VIEW
   ============================================================ */
function StoriesView({ events, seenStories, onMarkSeen, onBack, onContinue, onNav }) {
  const [activeStory, setActiveStory] = useState(null); // { type: 'friends' | 'discover', gIndex: 0, pIndex: 0 }

  const friendGroups = friendStories.map(s => s.photos);
  const discoverGroups = discoverStories.map(s => s.photos);


  const storyFeatureNames = ["Memories", "Voyages", "Moments", "Amour", "Archives"];

  const storyAudios = [
    "/music/Bruno_Mars_-_Risk_It_All.mp3",
    "/music/Calvin_Harris_Sam_Smith_-_Promises_Official_Lyric_Video.mp3",
    "/music/ABBA - Mamma Mia (Lyrics).mp3",
    "/music/Charlie Puth - Attention (Lyrics).mp3",
    "/music/Rauw Alejandro - Todo de Ti (Letra_Lyrics).mp3"
  ];

  const discoverAudios = [
    "/music/BLACKPINK - ‘뛰어(JUMP)’ (Official Audio).mp3",        // 0 ✨
    "/music/Bob Sinclar Ft. Steve Edwards - World Hold On (Fisher Rework) (Official Video).mp3", // 1 🌈
    "/music/Cardi B - WAP feat. Megan Thee Stallion [Official Audio].mp3", // 2 🔥
    "/music/Mondotek_-_Alive_Ph_Electro_Remix.mp3",                // 3 🪐
    "/music/Gunna_-_P_power_feat._Drake_Official_Audio.mp3",       // 4 💎
    "/music/Huntrix - Golden (Lyrics) KPop Demon Hunters.mp3",     // 5 🌸
    "/music/KATSEYE (캣츠아이) Gabriela (Audio).mp3",              // 6 🦋
    "/music/Titi_Me_Pregunto_-_Bad_Bunny_AudioEstudio_2022.mp3",   // 7 🧿
    "/music/Elton John - Im Still Standing (Lyrics).mp3",          // 8
    "/music/Yeah_Yeah_Yeahs_-_Heads_Will_Roll_A-Trak_remix.mp3"   // 9
  ];

  const currentAudioSrc = activeStory !== null
    ? (activeStory.type === 'friends' ? storyAudios[activeStory.gIndex % storyAudios.length] : discoverAudios[activeStory.gIndex % discoverAudios.length])
    : null;

  useFadingAudio(currentAudioSrc, activeStory !== null, 800);

  const handleDragEnd = (_event, info) => {
    if (info.offset.x > 80 && activeStory === null) onBack(); // Swipe right back to camera
    // Also handle swiping out of fullscreen story
    if (info.offset.x > 50 && activeStory !== null) {
      if (activeStory.pIndex > 0) setActiveStory({ ...activeStory, pIndex: activeStory.pIndex - 1 });
      else setActiveStory(null);
    } else if (info.offset.x < -50 && activeStory !== null) {
      handleNextPhoto();
    }
  };

  const handleNextPhoto = () => {
    const group = activeStory.type === 'friends' ? friendGroups[activeStory.gIndex] : discoverGroups[activeStory.gIndex];
    if (activeStory.pIndex < group.length - 1) {
      setActiveStory({ ...activeStory, pIndex: activeStory.pIndex + 1 });
    } else {
      onMarkSeen(`${activeStory.type}-${activeStory.gIndex}`);
      setActiveStory(null);
    }
  };

  const handleStoryClick = (e) => {
    // Determine left or right tap
    const clickX = e.clientX;
    const width = window.innerWidth;
    if (clickX > width / 2) {
      handleNextPhoto();
    } else {
      if (activeStory.pIndex > 0) {
        setActiveStory({ ...activeStory, pIndex: activeStory.pIndex - 1 });
      } else {
        setActiveStory(null);
      }
    }
  };

  if (activeStory !== null) {
    const group = activeStory.type === 'friends' ? friendGroups[activeStory.gIndex] : discoverGroups[activeStory.gIndex];
    const ev = group[activeStory.pIndex];
    return (
      <motion.div
        className={styles.storyFullscreen}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        onClick={handleStoryClick}
      >
        <div className={styles.storyProgressContainer}>
          {group.map((_, idx) => (
            <div key={idx} className={styles.storyProgressBar}>
              <div className={styles.storyProgressFill} style={{ width: idx <= activeStory.pIndex ? '100%' : '0%' }} />
            </div>
          ))}
        </div>

        {ev.photo && <img src={`/photos/${ev.photo}`} className={styles.snapPhoto} alt={ev.title} />}
        <div className={styles.storyOverlay} />

        <div className={styles.snapRibbon}>
          <p className={styles.snapRibbonText}>{ev.description}</p>
        </div>

        <button className={styles.storyCloseBtn} onClick={(e) => { e.stopPropagation(); setActiveStory(null); }}>✕</button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.storiesView}
      style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 10, touchAction: 'pan-y' }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      dragDirectionLock
      onDragEnd={handleDragEnd}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <HeaderBar title="Stories" onBack={onBack} />

      <div className={styles.storiesScroll}>
        {/* Friends section */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Friends</span>
          <span className={styles.sectionArrow}>›</span>
        </div>

        <div className={styles.storyBubbles} style={{ touchAction: 'pan-x' }}>
          {friendGroups.map((group, i) => {
            const ev = group[0];
            const isSeen = seenStories.has(`friends-${i}`);
            return (
              <div key={`friendGrp-${i}`} className={styles.storyBubbleItem} onClick={() => setActiveStory({ type: 'friends', gIndex: i, pIndex: 0 })}>
                <div className={isSeen ? styles.storyRingSeen : styles.storyRing}>
                  <div className={styles.storyRingInner}>
                    {ev.photo ? (
                      <img src={`/photos/${ev.photo}`} alt="" className={styles.storyBubbleImg} />
                    ) : (
                      <span>{ev.sticker}</span>
                    )}
                  </div>
                </div>
                <span className={styles.storyBubbleName}>{storyFeatureNames[i] || "Story"}</span>
              </div>
            );
          })}
        </div>

        {/* Discover section */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Discover</span>
        </div>

        <div className={styles.discoverGrid}>
          {discoverGroups.map((group, i) => {
            const ev = group[0];
            const isSeen = seenStories.has(`discover-${i}`);
            return (
              <motion.div
                key={`discoverGrp-${i}`}
                className={styles.discoverTile}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveStory({ type: 'discover', gIndex: i, pIndex: 0 })}
              >
                {ev.photo ? (
                  <img src={`/photos/${ev.photo}`} alt="" className={styles.discoverImg} />
                ) : (
                  <div className={styles.discoverFallback}>{ev.sticker}</div>
                )}
                <div className={styles.discoverOverlay} style={{ background: isSeen ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.2)' }} />
                <div className={styles.discoverInfo} style={{ display: 'flex', justifyContent: 'center', width: '100%', top: '50%', transform: 'translateY(-50%)' }}>
                  <span className={styles.discoverSticker} style={{ fontSize: '3rem', margin: 0 }}>{ev.sticker}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <ContinueButton onClick={onContinue} hint="Le Jukebox de Sabrina t'attend..." theme="museum" />
        </div>
      </div>

      <BottomNav active="stories" onNav={onNav} />
    </motion.div>
  );
}

/* ============================================================
   CONVERSATION VIEW (rubenaliasbestiecentaure)
   ============================================================ */
function ConversationView({ events, openedSnaps, onOpenSnap, onBack }) {
  const [activeSnap, setActiveSnap] = useState(null);

  const handleDragEnd = (_event, info) => {
    if (info.offset.x > 80 && activeSnap === null) onBack(); // Swipe right back to chats
  };

  // Generate a conversation using the first 9 timelineEvents as snaps
  const conversationData = [];
  const funnyTexts = conversationMessages;

  for (let i = 0; i < conversationSnaps.length; i++) {
    const ev = conversationSnaps[i];
    if (!ev) break;
    // Add a text message
    conversationData.push({
      type: 'text',
      id: `text-${i}`,
      sender: 'rubenaliasbestiecentaure',
      text: funnyTexts[i % funnyTexts.length]
    });
    // Add a snap message
    conversationData.push({
      type: 'snap',
      id: `snap-${i}`,
      sender: 'rubenaliasbestiecentaure',
      event: ev,
      index: i
    });
  }
  // Append any extra text messages beyond the number of snaps
  for (let i = conversationSnaps.length; i < funnyTexts.length; i++) {
    conversationData.push({
      type: 'text',
      id: `text-${i}`,
      sender: 'rubenaliasbestiecentaure',
      text: funnyTexts[i]
    });
  }

  // Active snap full screen overlay
  if (activeSnap !== null) {
    const ev = activeSnap;
    return (
      <motion.div
        className={styles.storyFullscreen}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        {ev.photo && <img src={`/photos/${ev.photo}`} className={styles.snapPhoto} alt={ev.title} />}
        <div className={styles.storyOverlay} />
        <div className={styles.snapRibbon}>
          <p className={styles.snapRibbonText}>{ev.description}</p>
        </div>
        <button className={styles.storyCloseBtn} onClick={() => {
          onOpenSnap(ev.id || `snap-${activeSnap.index}`);
          setActiveSnap(null);
        }}>✕</button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.convView}
      style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 20, touchAction: 'pan-y' }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      dragDirectionLock
      onDragEnd={handleDragEnd}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Convention Header */}
      <div className={styles.convHeader}>
        <button className={styles.convBackBtn} onClick={onBack}>
          <SvgChevronLeft size={28} color="#fff" />
        </button>
        <div className={styles.convHeaderAvatar}>
          <span className={styles.chatAvatarEmoji} style={{ fontSize: '1.2rem' }}>🦄</span>
        </div>
        <div className={styles.convHeaderInfo}>
          <h2 className={styles.convHeaderTitle}>rubenaliasbestiecentaure</h2>
          <p className={styles.convHeaderSubtitle}>Saved by you</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className={styles.convScroll} style={{ touchAction: 'pan-y' }}>
        <div className={styles.convMessages}>
          {conversationData.map((msg) => (
            <div key={msg.id} className={styles.chatMessageRow}>
              <div className={styles.chatBubbleContainer}>
                <span className={styles.chatSenderName} style={{ color: msg.sender === 'Me' ? '#FF3B30' : '#BF5AF2' }}>
                  {msg.sender}
                </span>

                {msg.type === 'text' && (
                  <div className={styles.chatBubbleDark}>
                    <p className={styles.chatText}>{msg.text}</p>
                  </div>
                )}

                {msg.type === 'snap' && (() => {
                  const isOpened = openedSnaps.has(msg.event.id);
                  return isOpened ? (
                    <div className={styles.savedSnapWrapper} onClick={() => setActiveSnap(msg.event)}>
                      <div className={styles.savedSnapImgContainer}>
                        <img src={`/photos/${msg.event.photo}`} className={styles.savedSnapImg} alt="Saved snap" />
                        {msg.event.description && (
                          <div className={styles.miniSnapRibbon}>
                            <p className={styles.miniSnapRibbonText}>{msg.event.description}</p>
                          </div>
                        )}
                      </div>
                      <div className={styles.savedSnapLabel}>Saved in Chat</div>
                    </div>
                  ) : (
                    <div className={styles.snapMessageCard} onClick={() => setActiveSnap(msg.event)}>
                      <div className={styles.snapRedSquare} />
                      <div className={styles.snapCardInfo}>
                        <span className={styles.snapCardTitle} style={{ color: '#FF3B30' }}>
                          New Snap
                        </span>
                        <span className={styles.snapCardSub}>Tap to view</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}
          {/* Empty space at bottom to scroll past input */}
          <div style={{ height: '20px' }} />
        </div>
      </div>

      {/* Bottom Input Area */}
      <div className={styles.convBottomInput}>
        <button className={styles.convCameraBtn}>
          <SvgCameraOutline size={22} color="#fff" />
        </button>
        <div className={styles.convInputPill}>
          <span className={styles.convPlaceholder}>Send chat</span>
          <button className={styles.convInputIconBtn}>
            <SvgMic size={20} color="#8E8E93" />
          </button>
        </div>
        <button className={styles.convIconBtn}>
          <SvgSmiley size={24} color="#fff" />
        </button>
      </div>
    </motion.div>
  );
}
