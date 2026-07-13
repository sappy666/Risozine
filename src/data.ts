import { RisoInk, PaperColor, FoldingStep, ZinePage, ActiveFont } from './types';

export const RISO_INKS: RisoInk[] = [
  { id: 'rosa', name: 'Rosa Flúor', hex: '#ff3388', textColor: '#ffffff' },
  { id: 'azul', name: 'Azul Federal', hex: '#0055ff', textColor: '#ffffff' },
  { id: 'verde', name: 'Verde Pino', hex: '#007a5e', textColor: '#ffffff' },
  { id: 'amarillo', name: 'Amarillo Girasol', hex: '#ffcc00', textColor: '#1a1a1a' },
  { id: 'carbon', name: 'Carbón', hex: '#1a1a1a', textColor: '#ffffff' },
];

export const PAPER_COLORS: PaperColor[] = [
  { id: 'crema', name: 'Crema Imprenta', hex: '#fdfbf7', bgClass: 'bg-[#fdfbf7]' },
  { id: 'rosa_fuji', name: 'Rosa Fuji', hex: '#ffeef2', bgClass: 'bg-[#ffeef2]' },
  { id: 'amarillo_canario', name: 'Amarillo Canario', hex: '#fff9c4', bgClass: 'bg-[#fff9c4]' },
  { id: 'azul_hielo', name: 'Azul Hielo', hex: '#e1f5fe', bgClass: 'bg-[#e1f5fe]' },
  { id: 'verde_menta', name: 'Verde Menta', hex: '#e8f5e9', bgClass: 'bg-[#e8f5e9]' },
  { id: 'kraft', name: 'Kraft Reciclado', hex: '#dcc6a8', bgClass: 'bg-[#dcc6a8]' },
];

export interface StickerDefinition {
  id: string;
  name: string;
  viewBox: string;
  paths: string[];
  category: 'matisse' | 'retro' | 'letters_textures';
}

export const STICKERS: StickerDefinition[] = [
  // --- SHEET 1: MATISSE & BAUHAUS (Organic / Geometric Art) ---
  {
    id: 'organic_blob',
    name: 'Mancha Matisse',
    viewBox: '0 0 100 100',
    category: 'matisse',
    paths: [
      'M 20,40 C 25,25 45,20 60,15 C 75,10 90,20 85,40 C 80,60 90,75 70,85 C 50,95 30,80 20,70 C 10,60 15,55 20,40 Z'
    ]
  },
  {
    id: 'torn_strip',
    name: 'Tira Matisse',
    viewBox: '0 0 100 100',
    category: 'matisse',
    paths: [
      'M 15,12 C 25,10 38,15 50,11 C 65,7 78,14 85,11 L 82,88 C 75,91 60,86 48,89 C 32,92 20,87 14,88 Z'
    ]
  },
  {
    id: 'imperfect_circle',
    name: 'Círculo Matisse',
    viewBox: '0 0 100 100',
    category: 'matisse',
    paths: [
      'M 50,12 C 70,11 88,25 87,48 C 86,70 70,88 48,87 C 26,86 11,70 12,48 C 13,25 28,13 50,12 Z'
    ]
  },
  {
    id: 'brutalist_block',
    name: 'Bloque Bauhaus',
    viewBox: '0 0 100 100',
    category: 'matisse',
    paths: [
      'M 10,15 L 85,10 L 90,45 L 75,48 L 85,85 L 15,90 L 20,50 L 10,46 Z'
    ]
  },
  {
    id: 'retro_starburst',
    name: 'Estrella Matisse',
    viewBox: '0 0 100 100',
    category: 'matisse',
    paths: [
      'M 50,15 Q 52,38 75,40 Q 52,42 50,65 Q 48,42 25,40 Q 48,38 50,15 Z M 50,28 C 45,35 35,45 50,52 C 65,45 55,35 50,28 Z'
    ]
  },
  {
    id: 'abstract_wave',
    name: 'Onda Matisse',
    viewBox: '0 0 100 100',
    category: 'matisse',
    paths: [
      'M 10,45 Q 25,15 45,45 T 80,45 Q 65,75 45,45 T 10,45 Z'
    ]
  },
  {
    id: 'flower_silhouette',
    name: 'Alga Matisse',
    viewBox: '0 0 100 100',
    category: 'matisse',
    paths: [
      'M 50,15 C 55,25 70,20 65,35 C 60,45 80,45 75,60 C 70,75 55,65 50,85 C 45,65 30,75 25,60 C 20,45 40,45 35,35 C 30,20 45,25 50,15 Z'
    ]
  },
  {
    id: 'half_moon',
    name: 'Media Luna Matisse',
    viewBox: '0 0 100 100',
    category: 'matisse',
    paths: [
      'M 32,18 C 55,18 78,35 78,60 C 78,72 72,82 65,88 C 82,75 80,42 66,28 C 53,15 38,14 32,18 Z'
    ]
  },
  {
    id: 'rough_arrow',
    name: 'Flecha Bauhaus',
    viewBox: '0 0 100 100',
    category: 'matisse',
    paths: [
      'M 15,40 L 55,40 L 45,20 L 85,50 L 45,80 L 55,60 L 15,60 Z'
    ]
  },
  {
    id: 'flower_cutout',
    name: 'Flor Matisse',
    viewBox: '0 0 100 100',
    category: 'matisse',
    paths: [
      'M 50,20 C 40,10 25,20 30,35 C 15,35 15,55 30,55 C 20,70 35,80 50,70 C 65,80 80,70 70,55 C 85,55 85,35 70,35 C 75,20 60,10 50,20 Z'
    ]
  },
  {
    id: 'carrot_cutout',
    name: 'Fruta Matisse',
    viewBox: '0 0 100 100',
    category: 'matisse',
    paths: [
      'M 50,25 C 68,25 78,40 75,65 C 72,85 58,92 50,92 C 42,92 28,85 25,65 C 22,40 32,25 50,25 Z M 50,10 L 50,25 M 42,15 C 45,20 48,22 50,25 C 52,22 55,20 58,15 Z'
    ]
  },
  {
    id: 'tomato_cutout',
    name: 'Fruta Bauhaus',
    viewBox: '0 0 100 100',
    category: 'matisse',
    paths: [
      'M 50,25 C 65,23 82,30 82,55 C 82,78 65,88 50,88 C 35,88 18,78 18,55 C 18,30 35,23 50,25 Z M 50,25 L 47,8 L 53,8 Z M 50,25 L 35,14 M 50,25 L 65,14'
    ]
  },
  {
    id: 'flower_pink_cutout',
    name: 'Monstera Matisse',
    viewBox: '0 0 100 100',
    category: 'matisse',
    paths: [
      'M 50,10 C 65,10 82,25 78,50 C 74,75 62,88 50,88 C 38,88 26,75 22,50 C 18,25 35,10 50,10 Z M 35,35 Q 45,38 50,38 Q 55,38 65,35 M 30,50 Q 45,52 50,52 Q 55,52 70,50 M 35,68 Q 45,69 50,69 Q 55,69 65,68'
    ]
  },
  {
    id: 'orange_cutout',
    name: 'Hojas Matisse',
    viewBox: '0 0 100 100',
    category: 'matisse',
    paths: [
      'M 50,85 C 50,55 50,25 50,15 M 50,30 C 65,22 75,28 72,40 C 69,52 53,42 50,40 M 50,45 C 35,37 25,43 28,55 C 31,67 47,57 50,55 M 50,58 C 65,50 75,56 72,68 C 69,80 53,70 50,68 M 50,72 C 35,64 25,70 28,82 C 31,94 47,84 50,82'
    ]
  },

  // --- SHEET 2: RETRO COLLAGE (Vintage Scissors, Hourglass, Cameras, Frames, etc) ---
  {
    id: 'scissors_cutout',
    name: 'Tijeras Collage',
    viewBox: '0 0 100 100',
    category: 'retro',
    paths: [
      'M 38,78 C 28,78 22,68 22,58 C 22,48 32,43 42,53 L 50,45 L 58,53 C 68,43 78,48 78,58 C 78,68 72,78 62,78 C 52,78 50,68 50,68 L 45,48 L 50,12 L 55,48 Z'
    ]
  },
  {
    id: 'retro_sunburst',
    name: 'Brillo Matisse',
    viewBox: '0 0 100 100',
    category: 'retro',
    paths: [
      'M 50,38 L 50,8 M 50,62 L 50,92 M 38,50 L 8,50 M 62,50 L 92,50 M 41,41 L 21,21 M 59,59 L 79,79 M 41,59 L 21,79 M 59,41 L 79,21 Z M 50,40 C 55,40 60,45 60,50 C 60,55 55,60 50,60 C 45,60 40,55 40,50 C 40,45 45,40 50,40 Z'
    ]
  },
  {
    id: 'retro_tape',
    name: 'Cinta Collage',
    viewBox: '0 0 100 100',
    category: 'retro',
    paths: [
      'M 10,35 L 15,30 L 20,35 L 85,38 L 90,32 L 85,55 L 80,60 L 15,55 Z'
    ]
  },
  {
    id: 'retro_hourglass',
    name: 'Reloj de Arena',
    viewBox: '0 0 100 100',
    category: 'retro',
    paths: [
      'M 25,15 L 75,15 L 75,25 L 55,50 L 75,75 L 75,85 L 25,85 L 25,75 L 45,50 L 25,25 Z M 32,22 L 68,22 L 50,45 Z M 50,55 L 32,78 L 68,78 Z'
    ]
  },
  {
    id: 'vintage_key',
    name: 'Llave Antigua',
    viewBox: '0 0 100 100',
    category: 'retro',
    paths: [
      'M 50,10 C 38,10 30,18 30,30 C 30,40 36,48 45,50 L 45,80 L 35,80 L 35,88 L 45,88 L 45,95 L 55,95 L 55,50 C 64,48 70,40 70,30 C 70,18 62,10 50,10 Z M 50,20 C 55,20 60,25 60,30 C 60,35 55,40 50,40 C 45,40 40,35 40,30 C 40,25 45,20 50,20 Z'
    ]
  },
  {
    id: 'retro_frame',
    name: 'Marco Vintage',
    viewBox: '0 0 100 100',
    category: 'retro',
    paths: [
      'M 10,10 L 90,10 L 90,90 L 10,90 Z M 20,20 L 20,80 L 80,80 L 80,20 Z M 15,15 L 25,15 L 25,25 L 15,25 Z M 75,15 L 85,15 L 85,25 L 75,25 Z M 15,75 L 25,75 L 25,85 L 15,85 Z M 75,75 L 85,75 L 85,85 L 75,85 Z'
    ]
  },
  {
    id: 'collage_eye',
    name: 'Ojo Collage',
    viewBox: '0 0 100 100',
    category: 'retro',
    paths: [
      'M 10,50 C 25,25 75,25 90,50 C 75,75 25,75 10,50 Z M 50,30 C 39,30 30,39 30,50 C 30,61 39,70 50,70 C 61,70 70,61 70,50 C 70,39 61,30 50,30 Z M 50,42 C 45,42 42,45 42,50 C 42,55 45,58 50,58 C 55,58 58,55 58,50 C 58,45 55,42 50,42 Z'
    ]
  },

  // --- SHEET 3: LETRAS & TEXTURAS (Cutout alphabet + Hatching textures) ---
  {
    id: 'letter_a',
    name: 'Letra A',
    viewBox: '0 0 100 100',
    category: 'letters_textures',
    paths: [
      'M 15,15 L 85,15 L 85,85 L 15,85 Z M 50,25 L 30,75 L 42,75 L 46,62 L 54,62 L 58,75 L 70,75 Z M 50,40 L 48,52 L 52,52 Z'
    ]
  },
  {
    id: 'letter_b',
    name: 'Letra B',
    viewBox: '0 0 100 100',
    category: 'letters_textures',
    paths: [
      'M 15,15 L 85,15 L 85,85 L 15,85 Z M 30,25 L 55,25 C 62,25 68,29 68,36 C 68,41 64,45 58,47 C 65,49 70,53 70,60 C 70,68 63,72 54,72 L 30,72 Z M 42,35 L 42,44 L 52,44 C 55,44 57,42 57,39 C 57,36 55,35 52,35 Z M 42,53 L 42,62 L 54,62 C 57,62 59,60 59,57 C 59,54 57,53 54,53 Z'
    ]
  },
  {
    id: 'letter_e',
    name: 'Letra E',
    viewBox: '0 0 100 100',
    category: 'letters_textures',
    paths: [
      'M 15,15 L 85,15 L 85,85 L 15,85 Z M 30,25 L 70,25 L 70,35 L 45,35 L 45,45 L 65,45 L 65,55 L 45,55 L 45,65 L 70,65 L 70,75 L 30,75 Z'
    ]
  },
  {
    id: 'letter_o',
    name: 'Letra O',
    viewBox: '0 0 100 100',
    category: 'letters_textures',
    paths: [
      'M 15,15 L 85,15 L 85,85 L 15,85 Z M 50,25 C 62,25 70,35 70,50 C 70,65 62,75 50,75 C 38,75 30,65 30,50 C 30,35 38,25 50,25 Z M 50,37 C 45,37 42,42 42,50 C 42,58 45,63 50,63 C 55,63 58,58 58,50 C 58,42 55,37 50,37 Z'
    ]
  },
  {
    id: 'letter_r',
    name: 'Letra R',
    viewBox: '0 0 100 100',
    category: 'letters_textures',
    paths: [
      'M 15,15 L 85,15 L 85,85 L 15,85 Z M 30,25 L 55,25 C 63,25 68,30 68,38 C 68,45 62,49 55,50 L 70,75 L 56,75 L 43,53 L 42,53 L 42,75 L 30,75 Z M 42,35 L 42,44 L 52,44 C 55,44 57,42 57,39 C 57,36 55,35 52,35 Z'
    ]
  },
  {
    id: 'letter_s',
    name: 'Letra S',
    viewBox: '0 0 100 100',
    category: 'letters_textures',
    paths: [
      'M 15,15 L 85,15 L 85,85 L 15,85 Z M 55,25 C 65,25 68,32 68,35 L 56,37 C 56,35 54,33 50,33 C 46,33 44,35 44,38 C 44,41 48,43 54,45 C 62,48 68,52 68,60 C 68,68 60,72 50,72 C 38,72 34,65 34,60 L 46,58 C 46,61 49,64 52,64 C 56,64 58,61 58,58 C 58,55 54,53 48,51 C 40,48 34,44 34,37 C 34,29 42,25 55,25 Z'
    ]
  },
  {
    id: 'letter_z',
    name: 'Letra Z',
    viewBox: '0 0 100 100',
    category: 'letters_textures',
    paths: [
      'M 15,15 L 85,15 L 85,85 L 15,85 Z M 30,25 L 70,25 L 70,35 L 42,65 L 70,65 L 70,75 L 30,75 L 30,65 L 58,35 L 30,35 Z'
    ]
  },
  {
    id: 'rayado_circle',
    name: 'Scribble Círculo',
    viewBox: '0 0 100 100',
    category: 'letters_textures',
    paths: [
      'M 50,10 C 65,12 85,20 85,45 C 85,70 60,88 45,85 C 30,82 12,65 15,45 C 18,25 35,8 50,10 Z M 48,15 C 38,18 22,30 25,50 C 28,70 55,80 65,75 C 75,70 78,55 78,45 C 78,35 68,22 48,15 Z'
    ]
  },
  {
    id: 'rayado_spiral',
    name: 'Scribble Espiral',
    viewBox: '0 0 100 100',
    category: 'letters_textures',
    paths: [
      'M 50,50 C 45,45 45,35 55,35 C 65,35 70,50 55,60 C 40,70 25,50 35,30 C 45,10 75,10 85,40 C 95,70 65,95 35,85 C 5,75 5,35 25,15'
    ]
  },
  {
    id: 'rayado_hatch',
    name: 'Textura Trama',
    viewBox: '0 0 100 100',
    category: 'letters_textures',
    paths: [
      'M 10,15 L 90,15 M 10,35 L 90,35 M 10,55 L 90,55 M 10,75 L 90,75 M 10,95 L 90,95 M 15,10 L 15,90 M 35,10 L 35,90 M 55,10 L 55,90 M 75,10 L 75,90 M 95,10 L 95,90'
    ]
  },
  {
    id: 'rayado_waves',
    name: 'Scribble Ondas',
    viewBox: '0 0 100 100',
    category: 'letters_textures',
    paths: [
      'M 5,20 Q 25,5 45,20 T 85,20 M 5,40 Q 25,25 45,40 T 85,40 M 5,60 Q 25,45 45,60 T 85,60 M 5,80 Q 25,65 45,80 T 85,80'
    ]
  }
];

export const FOLDING_STEPS: FoldingStep[] = [
  {
    step: 1,
    title: '1. Marcar Pliegues Base',
    description: 'Dobla la hoja por la mitad a lo largo (horizontal) y luego a lo ancho (vertical) para marcar bien los pliegues en cruz. Desdobla la hoja.',
    svgIcon: 'M 10,50 L 90,50 M 50,10 L 50,90'
  },
  {
    step: 2,
    title: '2. Cortar el Eje Central',
    description: 'Dobla los extremos cortos hacia el centro (en acordeón de 8 partes). Desdobla y haz un tajo con tijeras a lo largo de la línea central vertical entre las páginas interiores (indicado en rojo en la plancha).',
    svgIcon: 'M 10,50 L 90,50 M 50,30 L 50,70' // Representing the slit
  },
  {
    step: 3,
    title: '3. Abrir en Rombo',
    description: 'Sujeta los dos extremos exteriores de la hoja larga doblada a lo largo y empuja hacia el centro, haciendo que la abertura central se abra y se expanda como un rombo.',
    svgIcon: 'M 50,10 L 90,50 L 50,90 L 10,50 Z'
  },
  {
    step: 4,
    title: '4. Plegar Cuadernillo',
    description: 'Junta todas las caras para formar un pequeño libro de 8 páginas. La Portada (Pág. 1) quedará al frente y la Contraportada (Pág. 8) detrás.',
    svgIcon: 'M 20,20 L 50,10 L 80,20 L 80,80 L 50,90 L 20,80 Z M 50,10 L 50,90'
  }
];

export const getPresetZine = (): ZinePage[] => {
  const pages: ZinePage[] = Array.from({ length: 8 }, (_, i) => ({
    pageNumber: i + 1,
    elements: []
  }));

  // Page 1: Cover (Portada)
  pages[0].elements = [
    {
      id: 'p1_bg_yellow',
      type: 'sticker',
      stickerId: 'brutalist_block',
      x: 10,
      y: 12,
      scale: 1.5,
      rotation: -6,
      zIndex: 1,
      color: '#ffcc00', // Amarillo Girasol
    },
    {
      id: 'p1_bg_pink',
      type: 'sticker',
      stickerId: 'organic_blob',
      x: 35,
      y: 32,
      scale: 1.3,
      rotation: 25,
      zIndex: 2,
      color: '#ff3388', // Rosa Flúor
    },
    {
      id: 'p1_title',
      type: 'text',
      content: 'RISO\nZINE',
      x: 15,
      y: 28,
      scale: 1.6,
      rotation: -4,
      zIndex: 3,
      color: '#1a1a1a', // Carbón
      font: 'serif'
    },
    {
      id: 'p1_subtitle',
      type: 'text',
      content: 'HERRAMIENTA ANALÓGICA\nPARA HACER FANZINES',
      x: 15,
      y: 65,
      scale: 0.9,
      rotation: 2,
      zIndex: 4,
      color: '#0055ff', // Azul Federal
      font: 'mono'
    },
    {
      id: 'p1_retro_star',
      type: 'sticker',
      stickerId: 'retro_starburst',
      x: 65,
      y: 15,
      scale: 1.1,
      rotation: 12,
      zIndex: 5,
      color: '#ff3388',
    },
    {
      id: 'p1_page_indicator',
      type: 'text',
      content: '— Nº 01 —',
      x: 35,
      y: 85,
      scale: 0.8,
      rotation: 0,
      zIndex: 6,
      color: '#007a5e', // Verde Pino
      font: 'mono'
    }
  ];

  // Page 2: Interior Page
  pages[1].elements = [
    {
      id: 'p2_strip',
      type: 'sticker',
      stickerId: 'torn_strip',
      x: 5,
      y: 10,
      scale: 1.4,
      rotation: -90,
      zIndex: 1,
      color: '#007a5e', // Verde Pino
    },
    {
      id: 'p2_title',
      type: 'text',
      content: 'LA ESTÉTICA\nRISO',
      x: 15,
      y: 20,
      scale: 1.3,
      rotation: 5,
      zIndex: 2,
      color: '#ff3388', // Rosa Flúor
      font: 'sans'
    },
    {
      id: 'p2_text',
      type: 'text',
      content: 'El encanto de la risografía\nreside en la imperfección:\nsus descalces de color,\ntexturas granuladas y\nel calor del fanzine.',
      x: 15,
      y: 42,
      scale: 0.85,
      rotation: 0,
      zIndex: 3,
      color: '#1a1a1a', // Carbón
      font: 'serif'
    },
    {
      id: 'p2_half_moon',
      type: 'sticker',
      stickerId: 'half_moon',
      x: 55,
      y: 65,
      scale: 1.2,
      rotation: -30,
      zIndex: 4,
      color: '#ffcc00', // Amarillo Girasol
    }
  ];

  // Page 3: Basic start
  pages[2].elements = [
    {
      id: 'p3_title',
      type: 'text',
      content: 'CÓMO FUNCIONA',
      x: 15,
      y: 15,
      scale: 1.1,
      rotation: -2,
      zIndex: 1,
      color: '#0055ff',
      font: 'sans'
    },
    {
      id: 'p3_text',
      type: 'text',
      content: 'Diseña cada una de las\n8 páginas en el editor.\n\nSube imágenes, estampa\nstickers de papel silueta\ny escribe textos libres.',
      x: 15,
      y: 30,
      scale: 0.85,
      rotation: 0,
      zIndex: 2,
      color: '#1a1a1a',
      font: 'serif'
    },
    {
      id: 'p3_star',
      type: 'sticker',
      stickerId: 'retro_starburst',
      x: 60,
      y: 60,
      scale: 1.0,
      rotation: 45,
      zIndex: 3,
      color: '#ffcc00',
    }
  ];

  return pages;
};

export interface PremadePhrase {
  id: string;
  text: string;
  font: ActiveFont;
}

export const PREMADE_PHRASES: PremadePhrase[] = [
  { id: 'fanzine', text: 'FANZINE O MUERTE', font: 'brutalist' },
  { id: 'imperfecto', text: 'EL ERROR ES ARTE', font: 'editorial' },
  { id: 'copia', text: 'COPIA / REPETIR', font: 'mono' },
  { id: 'love', text: 'RISO LOVE ♥', font: 'artistic' },
  { id: 'analog', text: 'ANALOG VIBES ONLY', font: 'typewriter' },
  { id: 'revolution', text: 'ZINE REVOLUTION', font: 'brutalist' },
  { id: 'selfpub', text: 'AUTO-PUBLICAR', font: 'sans' },
  { id: 'hecho', text: 'HECHO A MANO', font: 'editorial' },
];

export interface PaperSizeDefinition {
  id: string;
  name: string;
  aspectRatio: number;
  aspectClass: string;
  dimensionsLabel: string;
}

export const PAPER_SIZES: PaperSizeDefinition[] = [
  { id: 'A4', name: 'A4 (Estándar)', aspectRatio: 1 / 1.414, aspectClass: 'aspect-[1/1.414]', dimensionsLabel: '210 x 297 mm' },
  { id: 'Carta', name: 'Letter (Carta)', aspectRatio: 8.5 / 11, aspectClass: 'aspect-[8.5/11]', dimensionsLabel: '8.5 x 11 in' },
  { id: 'Oficio', name: 'Oficio (Legal)', aspectRatio: 8.5 / 13, aspectClass: 'aspect-[8.5/13]', dimensionsLabel: '8.5 x 13 in' },
  { id: 'Cuadrado', name: '1:1 (Cuadrado)', aspectRatio: 1, aspectClass: 'aspect-square', dimensionsLabel: '200 x 200 mm' },
];
