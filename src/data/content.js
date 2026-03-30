// ============================================================
//  ✏️  FICHIER DE CONFIGURATION — MODIFIE ICI TES CONTENUS
//  ⚡  Généré automatiquement par integrate_media.py
// ============================================================

export const SECRET_CODE = "te quiero";

// -----------------------------------------------------------
// SECTION 2 — MUSÉE DES 5 ANS
// -----------------------------------------------------------
export const timelineEvents = [
  {
    id: 1,
    date: "Juin 2022",
    title: "Le Début de Tout ✨",
    description: "Le jour où tout a commencé. Ruben a regardé Gazou pour la première fois et a su que quelque chose d'extraordinaire venait de naître.",
    photo: "p01.jpg",
    funnyPhoto: "p07.jpg",
    funnyCaption: "📸 La face cachée de ce souvenir...",
    sticker: "🐱",
    insideJoke: "Tu te rappelles de cette soirée ? 😂",
  },
  {
    id: 2,
    date: "Été 2022",
    title: "Le Premier Été 🌞",
    description: "Des journées dorées, des fous rires, des aventures improvisées. Le temps s'arrêtait quand on était ensemble.",
    photo: "p02.jpg",
    funnyPhoto: "p08.jpg",
    funnyCaption: "📸 La face cachée de ce souvenir...",
    sticker: "🌸",
    insideJoke: "Non mais sérieusement, pourquoi t'as fait ça ? 💀",
  },
  {
    id: 3,
    date: "Hiver 2022",
    title: "Premier Hiver ❄️",
    description: "Le froid dehors, la chaleur dedans. On a inventé nos propres rituels, nos propres traditions. Le monde pouvait bien attendre.",
    photo: "p03.jpg",
    funnyPhoto: "p09.jpg",
    funnyCaption: "📸 La face cachée de ce souvenir...",
    sticker: "⭐",
    insideJoke: "Cet hiver-là restera gravé dans ma mémoire pour toujours.",
  },
  {
    id: 4,
    date: "2023",
    title: "L'Année de la Complicité 💫",
    description: "On s'est découverts encore plus. Les silences devenaient confortables, les regards suffisants.",
    photo: "p04.png",
    funnyPhoto: "p10.jpg",
    funnyCaption: "📸 La face cachée de ce souvenir...",
    sticker: "🌺",
    insideJoke: "2023... quelle année quand même !",
  },
  {
    id: 5,
    date: "2024",
    title: "Les Aventures Continuent 🗺️",
    description: "Chaque saison apportait son lot de surprises, de défis et de bonheur. On grandissait ensemble.",
    photo: "p05.jpg",
    funnyPhoto: "p11.jpg",
    funnyCaption: "📸 La face cachée de ce souvenir...",
    sticker: "🎀",
    insideJoke: "Je suis tellement content qu'on ait vécu ça ensemble.",
  },
  {
    id: 6,
    date: "2025 — Aujourd'hui",
    title: "Ici & Maintenant 💗",
    description: "Cinq ans plus tard, je te regarde et je me dis que je suis l'homme le plus chanceux du monde. Cette page n'est que le début.",
    photo: "p06.jpg",
    funnyPhoto: "p12.jpg",
    funnyCaption: "📸 La face cachée de ce souvenir...",
    sticker: "💖",
    insideJoke: "Et dire qu'on a encore tout l'avenir devant nous ❤️",
  },
];

// -----------------------------------------------------------
// SECTION 3 — JUKEBOX (Blind Test)
// -----------------------------------------------------------
export const blindTestRounds = [
  {
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
  },
  {
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
  },
  {
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
  },
];

// -----------------------------------------------------------
// SECTION 4 — RUBEN ORIGINALS
// -----------------------------------------------------------
export const moviesData = {
  categories: [
    {
      title: "Nos Meilleures Galères",
      emoji: "😅",
      films: [
        {
          id: "galere1",
          title: "Mission (Im)possible",
          subtitle: "Un film de Ruben • 2022",
          description: "L\'épopée de ce jour mémorable où tout est parti de travers. Un chef-d\'œuvre du chaos organisé.",
          thumbnail: "p13.jpg",
          videoSrc: "v001.mp4",
          duration: "∞",
        },
        {
          id: "galere2",
          title: "GPS : Ennemi Public N°1",
          subtitle: "Un film de Ruben • 2023",
          description: "Quand se perdre devient une aventure. Un road-trip à la navigation créative.",
          thumbnail: "p14.jpg",
          videoSrc: "v002.mp4",
          duration: "Trop long",
        },
        {
          id: "galere3",
          title: "La Recette du Désastre",
          subtitle: "Un film de Ruben • 2024",
          description: "Cuisine + Nous = Pompiers ? Un documentaire culinaire haletant.",
          thumbnail: "p15.jpg",
          videoSrc: "v003.mp4",
          duration: "42 min",
        },
      ],
    },
    {
      title: "Séquences Émotion",
      emoji: "🥹",
      films: [
        {
          id: "emotion1",
          title: "Les Yeux qui Parlent",
          subtitle: "Un film de Ruben • 2022",
          description: "Un regard qui vaut mille mots. Court-métrage intime et inoubliable.",
          thumbnail: "p16.jpg",
          videoSrc: "v004.mp4",
          duration: "Éternel",
        },
        {
          id: "emotion2",
          title: "La Nuit des Confidences",
          subtitle: "Un film de Ruben • 2023",
          description: "Ces conversations du soir qui construisent une histoire d\'amour.",
          thumbnail: "p17.jpg",
          videoSrc: "v005.mp4",
          duration: "Jusqu\'à l\'aube",
        },
      ],
    },
    {
      title: "Gazou en Roue Libre",
      emoji: "🌪️",
      films: [
        {
          id: "gazou1",
          title: "Un Génie à l\'œuvre",
          subtitle: "Documentaire • 2022-2026",
          description: "Portrait sans filtre de la personne la plus imprévisible et attachante que je connaisse.",
          thumbnail: "p18.jpg",
          videoSrc: "v006.mp4",
          duration: "5 ans",
        },
        {
          id: "gazou2",
          title: "Gazou vs. La Technologie",
          subtitle: "Comédie • Série",
          description: "Un combat épique. La technologie n\'a aucune chance... ou si ?",
          thumbnail: "p19.jpg",
          videoSrc: "v007.mp4",
          duration: "En cours",
        },
        {
          id: "gazou3",
          title: "Le Monde Selon Gazou",
          subtitle: "Philosophie • 2023",
          description: "Une vision unique du monde, avec une logique qui n\'appartient qu\'à elle.",
          thumbnail: "p20.jpg",
          videoSrc: "v008.mp4",
          duration: "Infini",
        },
      ],
    },
  ],
};

// -----------------------------------------------------------
// SECTION 5 — LETTRE FINALE
// -----------------------------------------------------------
export const letterText = `Ma Gazou,

Si tu as scrollé jusqu'ici, c'est que tu es restée avec moi à travers cinq années de souvenirs, de rires, de larmes, et de moments qui m'appartiennent autant qu'à toi.

Il y a des mots que l'on n'arrive pas à dire à voix haute. Pas parce qu'on a peur, mais parce que leur poids est si grand qu'ils demandent quelque chose de plus solennel.

Alors je les ai mis ici.

Je t'ai regardée traverser des tempêtes avec une grâce que tu ne soupçonnes même pas. Je t'ai vue rire aux éclats pour des raisons que personne d'autre ne comprend. Je t'ai vue être fragile, forte, drôle, sérieuse, lunaire et terre-à-terre en même temps.

Et à chaque fois, j'ai pensé la même chose.

Que je veux que ça continue.

Pas parce que c'est confortable. Mais parce que tu es la personne avec qui je veux construire quelque chose de grand, de beau, et d'un peu fou.

Tu mérites une histoire à la hauteur de ce que tu es.

Et je veux être celui qui l'écrit avec toi.

Avec tout mon amour,
Ruben 💛`;

// -----------------------------------------------------------
// SECTION 6 — DEMANDE EN MARIAGE
// -----------------------------------------------------------
export const proposalText = {
  question: "Garance,\non écrit le prochain chapitre ensemble ?",
  button1: "OUI (Évidemment) 💛",
  button2: "OUI (Mais en rose) 🌸",
  noButton: "Non",
};
