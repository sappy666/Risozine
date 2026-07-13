export type ActiveFont = 'serif' | 'mono' | 'sans' | 'brutalist' | 'typewriter' | 'artistic' | 'editorial';

export interface DrawingStroke {
  id: string;
  points: { x: number; y: number }[]; // coordinates (0 to 100) relative to page
  color: string;
  brushWidth: number;
}

export interface RisoInk {
  id: string;
  name: string;
  hex: string;
  textColor: string; // Used for text label readability in the UI
}

export interface PaperColor {
  id: string;
  name: string;
  hex: string;
  bgClass: string;
}

export type ZineElementType = 'text' | 'sticker' | 'image';

export interface ZineElement {
  id: string;
  type: ZineElementType;
  x: number;          // Percentage (0-100) from left
  y: number;          // Percentage (0-100) from top
  width?: number;     // Percentage width
  height?: number;    // Percentage height
  scale: number;      // Multiplier
  rotation: number;   // Degrees
  zIndex: number;     // Layer index
  color: string;      // Riso ink color hex
  font?: ActiveFont;  // Used for text elements
  content?: string;   // Used for text elements (the text content)
  stickerId?: string; // Used for sticker elements (identifies the SVG path/shape)
  imageSrc?: string;  // Used for image elements (data URL or processed image URL)
  flipX?: boolean;    // Horizontal mirroring
  flipY?: boolean;    // Vertical mirroring
}

export interface ZinePage {
  pageNumber: number; // 1 to 8, or other limits
  elements: ZineElement[];
  drawings?: DrawingStroke[];
}

export interface FoldingStep {
  step: number;
  title: string;
  description: string;
  svgIcon: string; // Identifying vector shape for the fold guide drawer
}
