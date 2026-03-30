"""
Script d'intégration des médias — L'Odyssée de Gazou
Copie les photos/vidéos des dossiers Gazou, Gazou2, Gazou3
vers public/photos et public/videos, puis génère content.js
Les fichiers HEIC sont copiés dans public/heic/ pour conversion manuelle.
"""

import shutil
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────
BASE        = Path(r"C:\Users\ruben\Desktop\Gazou")
SOURCES     = [BASE / "Gazou", BASE / "Gazou2", BASE / "Gazou3"]
DST_PHOTOS  = BASE / "public" / "photos"
DST_VIDEOS  = BASE / "public" / "videos"
DST_HEIC    = BASE / "public" / "heic"
CONTENT_JS  = BASE / "src" / "data" / "content.js"

PHOTO_EXTS = {".jpg", ".jpeg", ".png", ".webp"}
VIDEO_EXTS = {".mp4", ".mov"}
HEIC_EXTS  = {".heic", ".heif"}

# ── Collecte des fichiers ──────────────────────────────────────────────────────
photos = []
videos = []
heics  = []

for src in SOURCES:
    if not src.exists():
        print(f"⚠️  Dossier introuvable : {src}")
        continue
    for f in sorted(src.iterdir()):
        ext = f.suffix.lower()
        if ext in PHOTO_EXTS:
            photos.append(f)
        elif ext in VIDEO_EXTS:
            videos.append(f)
        elif ext in HEIC_EXTS:
            heics.append(f)

print(f"\n📸  Photos trouvées  : {len(photos)}")
print(f"🎬  Vidéos trouvées  : {len(videos)}")
print(f"📱  HEIC trouvées    : {len(heics)} (à convertir)")

# ── Copie vers public/ ────────────────────────────────────────────────────────
DST_PHOTOS.mkdir(parents=True, exist_ok=True)
DST_VIDEOS.mkdir(parents=True, exist_ok=True)
DST_HEIC.mkdir(parents=True, exist_ok=True)

# Vide les dossiers destination d'abord pour éviter les doublons
for old in DST_PHOTOS.iterdir(): old.unlink()
for old in DST_VIDEOS.iterdir(): old.unlink()
for old in DST_HEIC.iterdir():   old.unlink()

copied_photos = []
for i, f in enumerate(photos, 1):
    dst = DST_PHOTOS / f"p{i:02d}{f.suffix.lower()}"
    shutil.copy2(f, dst)
    copied_photos.append(dst.name)
    print(f"  ✅ {dst.name}  ←  {f.parent.name}/{f.name}")

copied_videos = []
for i, f in enumerate(videos, 1):
    dst = DST_VIDEOS / f"v{i:03d}{f.suffix.lower()}"
    shutil.copy2(f, dst)
    copied_videos.append(dst.name)
    print(f"  🎬 {dst.name}  ←  {f.parent.name}/{f.name}")

for i, f in enumerate(heics, 1):
    dst = DST_HEIC / f"heic_{i:02d}{f.suffix.lower()}"
    shutil.copy2(f, dst)
    print(f"  📱 {dst.name}  ←  {f.parent.name}/{f.name}")

print(f"\n📗  HEIC → convertis avec https://heic.app ou iCloud, puis mets les JPG dans public/photos/")


# ── Répartition intelligente ──────────────────────────────────────────────────
# Musée : 6 photos principales + 6 funny (si dispo)
museum_photos  = copied_photos[:6]
funny_photos   = copied_photos[6:12]
extra_photos   = copied_photos[12:]   # galeries jukebox / thumbnails

while len(museum_photos) < 6:
    museum_photos.append(None)
while len(funny_photos) < 6:
    funny_photos.append(None)

# Films : 3 galères + 2 émotions + 3 gazou (8 videos)
film_slots = {
    "galere1":  copied_videos[0]  if len(copied_videos) > 0  else None,
    "galere2":  copied_videos[1]  if len(copied_videos) > 1  else None,
    "galere3":  copied_videos[2]  if len(copied_videos) > 2  else None,
    "emotion1": copied_videos[3]  if len(copied_videos) > 3  else None,
    "emotion2": copied_videos[4]  if len(copied_videos) > 4  else None,
    "gazou1":   copied_videos[5]  if len(copied_videos) > 5  else None,
    "gazou2":   copied_videos[6]  if len(copied_videos) > 6  else None,
    "gazou3":   copied_videos[7]  if len(copied_videos) > 7  else None,
}

# Thumbnails des films (photos restantes)
thumbs = extra_photos + [None]*10
film_thumbs = {
    "galere1":  thumbs[0],
    "galere2":  thumbs[1],
    "galere3":  thumbs[2],
    "emotion1": thumbs[3],
    "emotion2": thumbs[4],
    "gazou1":   thumbs[5],
    "gazou2":   thumbs[6],
    "gazou3":   thumbs[7],
}

def js_val(v):
    return f'"{v}"' if v else "null"

# ── Génération de content.js ──────────────────────────────────────────────────
timeline_labels = [
    ("Juin 2022",        "Le Début de Tout ✨",          "Le jour où tout a commencé. Ruben a regardé Gazou pour la première fois et a su que quelque chose d'extraordinaire venait de naître."),
    ("Été 2022",         "Le Premier Été 🌞",             "Des journées dorées, des fous rires, des aventures improvisées. Le temps s'arrêtait quand on était ensemble."),
    ("Hiver 2022",       "Premier Hiver ❄️",              "Le froid dehors, la chaleur dedans. On a inventé nos propres rituels, nos propres traditions. Le monde pouvait bien attendre."),
    ("2023",             "L'Année de la Complicité 💫",   "On s'est découverts encore plus. Les silences devenaient confortables, les regards suffisants."),
    ("2024",             "Les Aventures Continuent 🗺️",  "Chaque saison apportait son lot de surprises, de défis et de bonheur. On grandissait ensemble."),
    ("2025 — Aujourd'hui", "Ici & Maintenant 💗",         "Cinq ans plus tard, je te regarde et je me dis que je suis l'homme le plus chanceux du monde. Cette page n'est que le début."),
]
stickers  = ["🐱", "🌸", "⭐", "🌺", "🎀", "💖"]
inside_jokes = [
    "Tu te rappelles de cette soirée ? 😂",
    "Non mais sérieusement, pourquoi t'as fait ça ? 💀",
    "Cet hiver-là restera gravé dans ma mémoire pour toujours.",
    "2023... quelle année quand même !",
    "Je suis tellement content qu'on ait vécu ça ensemble.",
    "Et dire qu'on a encore tout l'avenir devant nous ❤️",
]

timeline_js = ""
for i in range(6):
    date, title, desc = timeline_labels[i]
    photo      = js_val(museum_photos[i])
    funny      = js_val(funny_photos[i])
    timeline_js += f"""  {{
    id: {i+1},
    date: "{date}",
    title: "{title}",
    description: "{desc}",
    photo: {photo},
    funnyPhoto: {funny},
    funnyCaption: "📸 La face cachée de ce souvenir...",
    sticker: "{stickers[i]}",
    insideJoke: "{inside_jokes[i]}",
  }},\n"""

content = f'''// ============================================================
//  ✏️  FICHIER DE CONFIGURATION — MODIFIE ICI TES CONTENUS
//  ⚡  Généré automatiquement par integrate_media.py
// ============================================================

export const SECRET_CODE = "te quiero";

// -----------------------------------------------------------
// SECTION 2 — MUSÉE DES 5 ANS
// -----------------------------------------------------------
export const timelineEvents = [
{timeline_js}];

// -----------------------------------------------------------
// SECTION 3 — JUKEBOX (Blind Test)
// -----------------------------------------------------------
export const blindTestRounds = [
  {{
    id: 1,
    song: "Espresso",
    audioSrc: null,
    question: "Quelle chanson colle le mieux à ce souvenir ?",
    choices: [
      "Notre premier voyage ensemble",
      "Ce soir où on a dansé sous la pluie",
      "Le jour où tu m'as fait éclater de rire",
    ],
    correctIndex: 0,
    successMessage: "💛 Exactement ! Ce souvenir, c'est notre Espresso à nous.",
  }},
  {{
    id: 2,
    song: "Please Please Please",
    audioSrc: null,
    question: "À quelle occasion cette chanson t'a fait penser à moi ?",
    choices: [
      "Quand tu m'as supplié de pas regarder ce film sans toi",
      "Notre premier été ensemble",
      "Le jour où tout a failli mal tourner mais ça s'est bien passé 😅",
    ],
    correctIndex: 2,
    successMessage: "🌹 Tu t'en souviens ! J'avais tellement peur ce jour-là.",
  }},
  {{
    id: 3,
    song: "Nonsense",
    audioSrc: null,
    question: "Cette chanson décrit quelle facette de nous ?",
    choices: [
      "Nos conversations à 3h du matin",
      "La façon dont tu regardes les séries en oubliant que j'existe",
      "Nos disputes pour choisir un restaurant",
    ],
    correctIndex: 0,
    successMessage: "🎵 Oui ! Nos 3h du mat, ça n'a aucun sens... et c'est parfait.",
  }},
];

// -----------------------------------------------------------
// SECTION 4 — RUBEN ORIGINALS
// -----------------------------------------------------------
export const moviesData = {{
  categories: [
    {{
      title: "Nos Meilleures Galères",
      emoji: "😅",
      films: [
        {{
          id: "galere1",
          title: "Mission (Im)possible",
          subtitle: "Un film de Ruben • 2022",
          description: "L\\'épopée de ce jour mémorable où tout est parti de travers. Un chef-d\\'œuvre du chaos organisé.",
          thumbnail: {js_val(film_thumbs["galere1"])},
          videoSrc: {js_val(film_slots["galere1"])},
          duration: "∞",
        }},
        {{
          id: "galere2",
          title: "GPS : Ennemi Public N°1",
          subtitle: "Un film de Ruben • 2023",
          description: "Quand se perdre devient une aventure. Un road-trip à la navigation créative.",
          thumbnail: {js_val(film_thumbs["galere2"])},
          videoSrc: {js_val(film_slots["galere2"])},
          duration: "Trop long",
        }},
        {{
          id: "galere3",
          title: "La Recette du Désastre",
          subtitle: "Un film de Ruben • 2024",
          description: "Cuisine + Nous = Pompiers ? Un documentaire culinaire haletant.",
          thumbnail: {js_val(film_thumbs["galere3"])},
          videoSrc: {js_val(film_slots["galere3"])},
          duration: "42 min",
        }},
      ],
    }},
    {{
      title: "Séquences Émotion",
      emoji: "🥹",
      films: [
        {{
          id: "emotion1",
          title: "Les Yeux qui Parlent",
          subtitle: "Un film de Ruben • 2022",
          description: "Un regard qui vaut mille mots. Court-métrage intime et inoubliable.",
          thumbnail: {js_val(film_thumbs["emotion1"])},
          videoSrc: {js_val(film_slots["emotion1"])},
          duration: "Éternel",
        }},
        {{
          id: "emotion2",
          title: "La Nuit des Confidences",
          subtitle: "Un film de Ruben • 2023",
          description: "Ces conversations du soir qui construisent une histoire d\\'amour.",
          thumbnail: {js_val(film_thumbs["emotion2"])},
          videoSrc: {js_val(film_slots["emotion2"])},
          duration: "Jusqu\\'à l\\'aube",
        }},
      ],
    }},
    {{
      title: "Gazou en Roue Libre",
      emoji: "🌪️",
      films: [
        {{
          id: "gazou1",
          title: "Un Génie à l\\'œuvre",
          subtitle: "Documentaire • 2022-2026",
          description: "Portrait sans filtre de la personne la plus imprévisible et attachante que je connaisse.",
          thumbnail: {js_val(film_thumbs["gazou1"])},
          videoSrc: {js_val(film_slots["gazou1"])},
          duration: "5 ans",
        }},
        {{
          id: "gazou2",
          title: "Gazou vs. La Technologie",
          subtitle: "Comédie • Série",
          description: "Un combat épique. La technologie n\\'a aucune chance... ou si ?",
          thumbnail: {js_val(film_thumbs["gazou2"])},
          videoSrc: {js_val(film_slots["gazou2"])},
          duration: "En cours",
        }},
        {{
          id: "gazou3",
          title: "Le Monde Selon Gazou",
          subtitle: "Philosophie • 2023",
          description: "Une vision unique du monde, avec une logique qui n\\'appartient qu\\'à elle.",
          thumbnail: {js_val(film_thumbs["gazou3"])},
          videoSrc: {js_val(film_slots["gazou3"])},
          duration: "Infini",
        }},
      ],
    }},
  ],
}};

// -----------------------------------------------------------
// SECTION 5 — LETTRE FINALE
// -----------------------------------------------------------
export const letterText = `Ma Gazou,

Si tu as scrollé jusqu\'ici, c\'est que tu es restée avec moi à travers cinq années de souvenirs, de rires, de larmes, et de moments qui m\'appartiennent autant qu\'à toi.

Il y a des mots que l\'on n\'arrive pas à dire à voix haute. Pas parce qu\'on a peur, mais parce que leur poids est si grand qu\'ils demandent quelque chose de plus solennel.

Alors je les ai mis ici.

Je t\'ai regardée traverser des tempêtes avec une grâce que tu ne soupçonnes même pas. Je t\'ai vue rire aux éclats pour des raisons que personne d\'autre ne comprend. Je t\'ai vue être fragile, forte, drôle, sérieuse, lunaire et terre-à-terre en même temps.

Et à chaque fois, j\'ai pensé la même chose.

Que je veux que ça continue.

Pas parce que c\'est confortable. Mais parce que tu es la personne avec qui je veux construire quelque chose de grand, de beau, et d\'un peu fou.

Tu mérites une histoire à la hauteur de ce que tu es.

Et je veux être celui qui l\'écrit avec toi.

Avec tout mon amour,
Ruben 💛`;

// -----------------------------------------------------------
// SECTION 6 — DEMANDE EN MARIAGE
// -----------------------------------------------------------
export const proposalText = {{
  question: "Garance,\\non écrit le prochain chapitre ensemble ?",
  button1: "OUI (Évidemment) 💛",
  button2: "OUI (Mais en rose) 🌸",
  noButton: "Non",
}};
'''

CONTENT_JS.write_text(content, encoding="utf-8")
print(f"\n✅  content.js mis à jour avec :")
print(f"    📸  {sum(1 for p in museum_photos if p)} photos musée")
print(f"    😂  {sum(1 for p in funny_photos if p)} photos funny")
print(f"    🎬  {sum(1 for v in film_slots.values() if v)} vidéos films")
print(f"\n🎉  Terminé ! Lance npm run dev pour voir le résultat.")
print(f"\n📋  Récapitulatif des films assignés :")
for slot, vid in film_slots.items():
    print(f"    {slot:10s} → {vid or 'null'}")
