import React, { useState, useEffect } from 'react';
import { ZinePage, ZineElement, PaperColor, RisoInk, ActiveFont } from './types';
import { RISO_INKS, PAPER_COLORS, STICKERS, getPresetZine, PREMADE_PHRASES, PAPER_SIZES } from './data';
import { PageEditor } from './components/PageEditor';
import { PageStrip } from './components/PageStrip';
import { ImpositionView } from './components/ImpositionView';
import { FoldingGuide } from './components/FoldingGuide';
import { 
  Sparkles, 
  Type, 
  Image as ImageIcon, 
  HelpCircle, 
  Trash2, 
  Printer, 
  Layers, 
  RotateCw, 
  Sliders, 
  RefreshCw, 
  Download, 
  X,
  FileText,
  ChevronRight,
  Maximize2,
  Scissors,
  Grid,
  PenTool,
  Eraser,
  Palette,
  FileDown
} from 'lucide-react';

export default function App() {
  // --- STATE ---
  const [pages, setPages] = useState<ZinePage[]>(() => {
    // Initialize 8-page preset zine by default
    const base = getPresetZine();
    return base.map(p => ({ ...p, drawings: [] }));
  });
  const [activePageNumber, setActivePageNumber] = useState<number>(1);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  const [paperColor, setPaperColor] = useState<PaperColor>(PAPER_COLORS[0]); // Crema Imprenta
  const [activeInk, setActiveInk] = useState<RisoInk>(RISO_INKS[0]); // Rosa Flúor
  const [activeFont, setActiveFont] = useState<ActiveFont>('serif');
  const [activeStickerCategory, setActiveStickerCategory] = useState<'matisse' | 'retro' | 'letters_textures'>('matisse'); // sticker pagination sheet
  
  const [viewMode, setViewMode] = useState<'editor' | 'imposition'>('editor');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  // Expanded configurations
  const [paperSize, setPaperSize] = useState(PAPER_SIZES[0]); // A4 Default
  const [pageCount, setPageCount] = useState<number>(8); // 8 pages default
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Drawing state
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  const [drawingColor, setDrawingColor] = useState<string>(RISO_INKS[0].hex);
  const [drawingBrushWidth, setDrawingBrushWidth] = useState<number>(4);

  // Individual page export state
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // --- ADDED STATES FOR HISTORY & TEXTURE ---
  const [pagesHistory, setPagesHistory] = useState<ZinePage[][]>([]);
  const [activeTexture, setActiveTexture] = useState<string>('riso'); // 'none' | 'riso' | 'halftone' | 'fiber'

  // Save current pages state to history before performing updates
  const saveHistory = (currentPages = pages) => {
    // Deep clone to avoid mutating history
    const clone = JSON.parse(JSON.stringify(currentPages));
    setPagesHistory(prev => {
      const updated = [...prev, clone];
      if (updated.length > 30) {
        return updated.slice(updated.length - 30);
      }
      return updated;
    });
  };

  const handleUndo = () => {
    if (pagesHistory.length === 0) return;
    const previous = pagesHistory[pagesHistory.length - 1];
    setPages(previous);
    setPagesHistory(prev => prev.slice(0, prev.length - 1));
    setSelectedElementId(null);
  };

  // --- LOADER EFFECT ---
  useEffect(() => {
    document.title = "risozine";
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // --- DERIVED STATE ---
  const activePage = pages.find(p => p.pageNumber === activePageNumber) || pages[0] || { pageNumber: 1, elements: [], drawings: [] };
  const selectedElement = activePage.elements.find(el => el.id === selectedElementId) || null;

  // --- ACTIONS ---

  // Select page
  const handlePageSelect = (pageNumber: number) => {
    setActivePageNumber(pageNumber);
    setSelectedElementId(null);
  };

  const getFontPreviewClass = (font: string) => {
    switch (font) {
      case 'serif': return 'font-riso-serif font-bold';
      case 'mono': return 'font-riso-mono';
      case 'sans': return 'font-riso-sans font-black';
      case 'brutalist': return 'font-riso-brutalist uppercase tracking-tighter text-[7.5px] font-black';
      case 'typewriter': return 'font-riso-typewriter text-[8px]';
      case 'artistic': return 'font-riso-artistic font-black italic';
      case 'editorial': return 'font-riso-editorial italic';
      default: return 'font-riso-sans';
    }
  };

  // Select an element on the canvas
  const handleSelectElement = (id: string | null) => {
    if (isDrawingMode) return; // Prevent selection in drawing mode
    setSelectedElementId(id);
  };

  // Update properties of a specific element
  const handleUpdateElement = (id: string, updates: Partial<ZineElement>) => {
    setPages(prevPages => 
      prevPages.map(page => {
        if (page.pageNumber === activePageNumber) {
          return {
            ...page,
            elements: page.elements.map(el => 
              el.id === id ? { ...el, ...updates } : el
            )
          };
        }
        return page;
      })
    );
  };

  // Delete an element
  const handleDeleteElement = (id: string) => {
    saveHistory();
    setPages(prevPages => 
      prevPages.map(page => {
        if (page.pageNumber === activePageNumber) {
          return {
            ...page,
            elements: page.elements.filter(el => el.id !== id)
          };
        }
        return page;
      })
    );
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  // Add a Text stamp
  const addTextElement = () => {
    saveHistory();
    const textId = `text_${Date.now()}`;
    const newText: ZineElement = {
      id: textId,
      type: 'text',
      x: 50,
      y: 50,
      scale: 1.0,
      rotation: 0,
      zIndex: activePage.elements.length + 5,
      color: activeInk.hex,
      font: activeFont,
      content: 'NUEVO TEXTO\nEDITABLE'
    };

    setPages(prevPages => 
      prevPages.map(page => {
        if (page.pageNumber === activePageNumber) {
          return { ...page, elements: [...page.elements, newText] };
        }
        return page;
      })
    );
    setSelectedElementId(textId);
    setIsDrawingMode(false); // Disable drawing when active typing
  };

  // Add Premade Phrase quick stamp
  const handleAddPhrase = (text: string, font: ActiveFont) => {
    saveHistory();
    const textId = `text_${Date.now()}`;
    const newText: ZineElement = {
      id: textId,
      type: 'text',
      x: 50,
      y: 50,
      scale: 1.1,
      rotation: Math.floor(Math.random() * 12) - 6, // slight random tilt
      zIndex: activePage.elements.length + 5,
      color: activeInk.hex,
      font: font,
      content: text
    };

    setPages(prevPages => 
      prevPages.map(page => {
        if (page.pageNumber === activePageNumber) {
          return { ...page, elements: [...page.elements, newText] };
        }
        return page;
      })
    );
    setSelectedElementId(textId);
    setIsDrawingMode(false);
  };

  // Add a Sticker stamp
  const addStickerElement = (stickerId: string) => {
    saveHistory();
    const newSticker: ZineElement = {
      id: `sticker_${Date.now()}`,
      type: 'sticker',
      stickerId,
      x: 50,
      y: 50,
      scale: 1.0,
      rotation: 0,
      zIndex: activePage.elements.length + 5,
      color: activeInk.hex
    };

    setPages(prevPages => 
      prevPages.map(page => {
        if (page.pageNumber === activePageNumber) {
          return { ...page, elements: [...page.elements, newSticker] };
        }
        return page;
      })
    );
    setSelectedElementId(newSticker.id);
    setIsDrawingMode(false);
  };

  // Draw Integration Callback
  const handleUpdateDrawings = (updatedDrawings: any[]) => {
    setPages(prevPages => 
      prevPages.map(page => {
        if (page.pageNumber === activePageNumber) {
          return {
            ...page,
            drawings: updatedDrawings
          };
        }
        return page;
      })
    );
  };

  const handleClearDrawings = () => {
    if (window.confirm('¿Quieres borrar todos los trazos de crayón de esta página?')) {
      handleUpdateDrawings([]);
    }
  };

  // Helper for image loading and base64 conversion
  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        saveHistory();
        const imageId = `image_${Date.now()}`;
        const newImage: ZineElement = {
          id: imageId,
          type: 'image',
          imageSrc: e.target.result,
          x: 50,
          y: 50,
          scale: 1.0,
          rotation: 0,
          zIndex: activePage.elements.length + 5,
          color: activeInk.hex // default ink tint color
        };

        setPages(prevPages => 
          prevPages.map(page => {
            if (page.pageNumber === activePageNumber) {
              return { ...page, elements: [...page.elements, newImage] };
            }
            return page;
          })
        );
        setSelectedElementId(imageId);
        setIsDrawingMode(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // File drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        processImageFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  };

  // Config: Page Count Change
  const handlePageCountChange = (count: number) => {
    setPageCount(count);
    setPages(prev => {
      if (prev.length === count) return prev;
      if (prev.length < count) {
        const expanded = [...prev];
        for (let i = prev.length; i < count; i++) {
          expanded.push({ pageNumber: i + 1, elements: [], drawings: [] });
        }
        return expanded;
      } else {
        return prev.slice(0, count);
      }
    });
    if (activePageNumber > count) {
      setActivePageNumber(1);
    }
  };

  // Creative "Sorpréndeme" Collage Randomizer
  const handleSurpriseMe = () => {
    saveHistory();

    // Select a random ink
    const randomInk = RISO_INKS[Math.floor(Math.random() * RISO_INKS.length)];
    setActiveInk(randomInk);

    // Pick a random category for a thematic collage feel
    const categories: ('matisse' | 'retro' | 'letters_textures')[] = ['matisse', 'retro', 'letters_textures'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const categoryStickers = STICKERS.filter(s => s.category === randomCategory);

    // Pick 2-3 random stickers
    const shuffledStickers = [...categoryStickers].sort(() => 0.5 - Math.random());
    const selectedStickers = shuffledStickers.slice(0, Math.min(3, shuffledStickers.length));

    // Positions for nice overlay look
    const presetPositions = [
      { x: 35, y: 35 },
      { x: 65, y: 65 },
      { x: 50, y: 50 }
    ];

    const newElements: ZineElement[] = [];

    // Add selected stickers with slight random variations
    selectedStickers.forEach((sticker, index) => {
      const pos = presetPositions[index] || { x: 30 + Math.random() * 40, y: 30 + Math.random() * 40 };
      newElements.push({
        id: `sticker_${Date.now()}_${index}`,
        type: 'sticker',
        stickerId: sticker.id,
        x: Math.round(pos.x + (Math.random() * 10 - 5)),
        y: Math.round(pos.y + (Math.random() * 10 - 5)),
        scale: parseFloat((0.8 + Math.random() * 0.6).toFixed(2)),
        rotation: Math.floor(Math.random() * 90) - 45,
        zIndex: index + 5,
        color: randomInk.hex,
        flipX: Math.random() > 0.5,
        flipY: Math.random() > 0.5
      });
    });

    // Add a randomized text phrase
    const phrase = PREMADE_PHRASES[Math.floor(Math.random() * PREMADE_PHRASES.length)];
    newElements.push({
      id: `text_${Date.now()}_phrase`,
      type: 'text',
      x: 50,
      y: 40,
      scale: parseFloat((1.0 + Math.random() * 0.4).toFixed(2)),
      rotation: Math.floor(Math.random() * 30) - 15,
      zIndex: 15,
      color: RISO_INKS[Math.floor(Math.random() * RISO_INKS.length)].hex,
      font: phrase.font,
      content: phrase.text
    });

    // Apply to current active page elements
    setPages(prevPages => 
      prevPages.map(page => {
        if (page.pageNumber === activePageNumber) {
          return {
            ...page,
            elements: [...page.elements, ...newElements]
          };
        }
        return page;
      })
    );
  };

  // Load Presets (Inspiration)
  const handleLoadPresets = () => {
    if (window.confirm('¿Quieres cargar el diseño preestablecido? Se sobrescribirá tu fanzine actual.')) {
      saveHistory();
      const preset = getPresetZine().map(p => ({ ...p, drawings: [] }));
      setPages(preset);
      setPageCount(8);
      setActivePageNumber(1);
      setSelectedElementId(null);
    }
  };

  // Clear Zine (Vaciar fanzine)
  const handleClearZine = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar todas las páginas de tu fanzine?')) {
      saveHistory();
      setPages(Array.from({ length: pageCount }, (_, i) => ({
        pageNumber: i + 1,
        elements: [],
        drawings: []
      })));
      setSelectedElementId(null);
    }
  };

  // Switch View Mode
  const toggleViewMode = () => {
    setSelectedElementId(null);
    setViewMode(viewMode === 'editor' ? 'imposition' : 'editor');
  };

  // EXPORT INDIVIDUAL PAGE
  const handleExportPng = async () => {
    const canvasElement = document.getElementById('active-page-canvas');
    if (!canvasElement) {
      alert('No se pudo encontrar el lienzo para exportar.');
      return;
    }
    setIsExporting(true);
    
    // Temporarily deselect to ensure clean high-resolution export without controls
    const previouslySelectedId = selectedElementId;
    setSelectedElementId(null);

    try {
      // Allow React state update to apply and clear outline visuals on screen
      await new Promise((resolve) => setTimeout(resolve, 60));

      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(canvasElement, {
        scale: 3, // High resolution (3x)
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `risozine-pagina-${activePageNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error al exportar PNG:', err);
      alert('Error al exportar PNG. Intenta de nuevo.');
    } finally {
      setIsExporting(false);
      // Restore previous selection state
      setSelectedElementId(previouslySelectedId);
    }
  };

  const handleExportPdf = async () => {
    const canvasElement = document.getElementById('active-page-canvas');
    if (!canvasElement) {
      alert('No se pudo encontrar el lienzo para exportar.');
      return;
    }
    setIsExporting(true);

    // Temporarily deselect to ensure clean high-resolution export without controls
    const previouslySelectedId = selectedElementId;
    setSelectedElementId(null);

    try {
      // Allow React state update to apply and clear outline visuals on screen
      await new Promise((resolve) => setTimeout(resolve, 60));

      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(canvasElement, {
        scale: 3,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      const imgData = canvas.toDataURL('image/png');
      
      const width = canvas.width;
      const height = canvas.height;
      const orientation = width > height ? 'l' : 'p';

      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'px',
        format: [width, height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`risozine-pagina-${activePageNumber}.pdf`);
    } catch (err) {
      console.error('Error al exportar PDF:', err);
      alert('Error al exportar PDF. Intenta de nuevo.');
    } finally {
      setIsExporting(false);
      // Restore previous selection state
      setSelectedElementId(previouslySelectedId);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-neutral-900 flex flex-col selection:bg-[#ff3388]/30">
      
      {/* BACKGROUND TEXTURE OVERLAY */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.06] z-50 mix-blend-multiply animate-fade-in" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='bgNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23bgNoise)'/%3E%3C/svg%3E")` 
        }} 
      />

      {/* STYLE TAG FOR SATISFYING CUSTOM LOADING KEYFRAMES & CSS */}
      <style>{`
        @keyframes scissorSnip {
          0% { transform: rotate(-12deg); }
          100% { transform: rotate(18deg); }
        }
        @keyframes cutProgressMove {
          0% { left: 0%; }
          100% { left: 88%; }
        }
        @keyframes cutPaperReveal {
          0% { width: 0%; }
          100% { width: 88%; }
        }
        .animate-scissor-snip {
          animation: scissorSnip 0.25s infinite alternate ease-in-out;
        }
        .animate-cut-progress {
          animation: cutProgressMove 2.6s forwards ease-out;
        }
        .animate-paper-reveal {
          animation: cutPaperReveal 2.6s forwards ease-out;
        }
      `}</style>

      {/* 1. SCISSORS PAPERCUT LOADING SCREEN */}
      {loading && (
        <div className="fixed inset-0 bg-[#fdfbf7] z-999 flex flex-col items-center justify-center overflow-hidden pointer-events-auto">
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-multiply" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='loadNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23loadNoise)'/%3E%3C/svg%3E")` 
            }} 
          />
          
          <div className="max-w-md w-full px-6 text-center space-y-6 relative">
            <div className="w-16 h-16 bg-[#ff3388] text-white border-2 border-neutral-900 rounded-none shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] flex items-center justify-center mx-auto text-3xl font-black rotate-[-6deg]">
              R
            </div>

            {/* Scissors Cutting stage */}
            <div className="relative h-20 w-full border-2 border-neutral-900 rounded-none bg-neutral-100 flex items-center justify-start overflow-hidden px-1 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
              {/* Dotted guideline */}
              <div className="absolute top-1/2 left-0 right-0 h-0 border-t-2 border-dashed border-neutral-400" />
              
              {/* Opened/Cut Paper reveal backplate */}
              <div className="absolute top-0 bottom-0 left-0 bg-[#ffeef2] border-r-2 border-dashed border-[#ff3388]/40 animate-paper-reveal" />
              
              {/* Scissors */}
              <div className="absolute top-1/2 -translate-y-1/2 animate-cut-progress flex items-center justify-center">
                <div className="animate-scissor-snip origin-[16px_20px]">
                  <Scissors className="w-9 h-9 text-[#ff3388] fill-current" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="font-riso-sans font-black text-xl tracking-tight text-neutral-900 uppercase">
                Cortando Papel...
              </h2>
              <p className="font-riso-serif text-xs text-neutral-600 italic">
                Preparando tu taller de risografía y colage editorial
              </p>
            </div>

            <div className="font-riso-mono text-[9px] text-neutral-400 font-bold tracking-widest uppercase">
              RISOZINE STUDIO • v1.0 ESTABLE
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION (Hidden during print) */}
      <header className="bg-[#fdfbf7] text-neutral-900 py-4 px-6 border-b-2 border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4 no-print shrink-0 z-30">
        
        {/* Logo and brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff3388] border-2 border-neutral-900 flex items-center justify-center font-riso-sans font-black text-xl tracking-tighter rotate-[-6deg] select-none text-white shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
            R
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-riso-sans font-black tracking-tight text-xl text-neutral-900">
                RISOZINE
              </h1>
              <span className="font-riso-mono text-[9px] border border-neutral-900 text-neutral-700 px-1.5 py-0.5 tracking-widest uppercase bg-[#fff9c4]">
                ESTUDIO
              </span>
            </div>
            <p className="font-riso-serif text-xs text-neutral-700 italic">
              Herramienta táctil para hacer fanzines plegables
            </p>
          </div>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={toggleViewMode}
            className={`flex items-center gap-1.5 font-riso-sans font-bold text-xs border-2 px-4 py-2 cursor-pointer transition-all rounded-none ${
              viewMode === 'imposition'
                ? 'bg-[#0055ff] border-neutral-900 text-white shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:bg-[#0044dd]'
                : 'bg-[#ff3388] border-neutral-900 hover:bg-[#e02473] text-white shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]'
            }`}
          >
            {viewMode === 'editor' ? (
              <>
                <Printer className="w-4 h-4" />
                VER PLANCHA DE IMPRESIÓN
              </>
            ) : (
              <>
                <Sliders className="w-4 h-4" />
                VOLVER AL EDITOR
              </>
            )}
          </button>

          <button
            onClick={handleSurpriseMe}
            className="flex items-center gap-1.5 font-riso-mono text-xs font-bold border-2 border-neutral-900 bg-[#fff9c4] text-neutral-900 px-3 py-2 hover:bg-[#fff5a0] transition-colors cursor-pointer rounded-none shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
            title="Generar colage creativo al azar"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff3388] animate-pulse" />
            SORPRÉNDEME
          </button>

          <button
            onClick={handleClearZine}
            className="flex items-center gap-1.5 font-riso-mono text-xs font-bold border-2 border-neutral-900 bg-white text-neutral-700 hover:text-red-600 hover:bg-neutral-50 px-3 py-2 transition-colors cursor-pointer rounded-none shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
            title="Borrar todo el zine"
          >
            <Trash2 className="w-3.5 h-3.5" />
            VACIAR
          </button>

          <button
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center gap-1.5 font-riso-mono text-xs font-bold border-2 border-neutral-900 bg-[#e1f5fe] text-neutral-900 px-3 py-2 hover:bg-[#b3e5fc] transition-colors cursor-pointer rounded-none shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#0055ff]" />
            GUÍA
          </button>
        </div>
      </header>

      {/* VIEWPORT CONTROLLER */}
      <main className="flex-1 w-full flex flex-col overflow-hidden">
        
        {viewMode === 'imposition' ? (
          /* IMPOSITION SHEET VIEW (Plancha de impresión) */
          <div className="flex-1 overflow-y-auto bg-neutral-200/40 py-6">
            <ImpositionView
              pages={pages}
              paperColor={paperColor}
              onBackToEditor={() => setViewMode('editor')}
              aspectClass={paperSize.aspectClass}
            />
          </div>
        ) : (
          /* MAIN ACTIVE PAGE EDITOR WORKSPACE */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden no-print">
            
            {/* LEFT TOOLBOX BAR (Soportes, Tintas y Estampados) */}
            <section className="order-2 md:order-1 w-full md:w-64 lg:w-72 bg-white border-b-2 md:border-b-0 md:border-r-2 border-neutral-900 p-4 flex flex-col gap-5 overflow-y-auto shrink-0">
              
              {/* 1. CONFIGURACIÓN DEL FORMATO (Paper Size & Pages Count) */}
              <div className="bg-neutral-50 p-2.5 border border-neutral-200 space-y-3">
                <span className="font-riso-mono text-[9px] text-[#ff3388] font-black uppercase tracking-wider block">
                  Configuración del Pliego
                </span>
                
                {/* Pages selection */}
                <div className="space-y-1">
                  <label className="font-riso-sans font-bold text-[10px] text-neutral-700 block uppercase">
                    Páginas del Fanzine:
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {[1, 4, 8].map((count) => (
                      <button
                        key={count}
                        onClick={() => handlePageCountChange(count)}
                        className={`py-1.5 text-[10px] font-riso-mono border-2 font-bold cursor-pointer transition-all ${
                          pageCount === count
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                            : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {count} {count === 1 ? 'Pág.' : 'Págs.'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Paper Size selector */}
                <div className="space-y-1">
                  <label className="font-riso-sans font-bold text-[10px] text-neutral-700 block uppercase">
                    Medida de Papel:
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    {PAPER_SIZES.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setPaperSize(size)}
                        className={`py-1 px-1.5 text-[9px] font-riso-mono border text-left cursor-pointer truncate ${
                          paperSize.id === size.id
                            ? 'bg-[#ffeef2] border-[#ff3388] text-[#ff3388] font-black'
                            : 'bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50'
                        }`}
                        title={`${size.name} (${size.dimensionsLabel})`}
                      >
                        <span className="block font-bold">{size.name}</span>
                        <span className="text-[8px] text-neutral-400">{size.dimensionsLabel}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. SOPORTE DE PAPEL (Color base) */}
              <div className="space-y-2">
                <span className="font-riso-mono text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
                  1. Soporte de Papel (Tono)
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {PAPER_COLORS.map((p) => {
                    const isSelected = paperColor.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPaperColor(p)}
                        className={`p-1.5 border-2 text-[9px] font-riso-sans font-bold cursor-pointer text-left flex flex-col justify-between h-12 rounded-none transition-all ${
                          isSelected
                            ? 'border-neutral-950 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                        style={{ backgroundColor: p.hex }}
                      >
                        <span className="w-2.5 h-2.5 rounded-none border border-neutral-950/20" />
                        <span className="text-neutral-900 truncate tracking-tight">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TEXTURA DE FONDO DEL PAPEL */}
              <div className="space-y-2 pt-1 border-t border-neutral-100">
                <span className="font-riso-mono text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
                  1b. Textura del Papel
                </span>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { id: 'none', name: 'Plano', desc: 'Sin ruido' },
                    { id: 'riso', name: 'Riso', desc: 'Granulado' },
                    { id: 'halftone', name: 'Trama', desc: 'Halftone' },
                    { id: 'fiber', name: 'Fibra', desc: 'Orgánico' },
                  ].map((t) => {
                    const isSelected = activeTexture === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setActiveTexture(t.id)}
                        className={`p-1.5 border text-center flex flex-col justify-center items-center cursor-pointer rounded-none transition-all ${
                          isSelected
                            ? 'bg-neutral-900 text-white border-neutral-900 font-black'
                            : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                        }`}
                      >
                        <span className="text-[9.5px] font-riso-mono uppercase block font-black">{t.name}</span>
                        <span className="text-[7.5px] text-neutral-400 block tracking-tighter truncate w-full">{t.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. TINTA DE IMPRESIÓN RISO (Color activo) */}
              <div className="space-y-2">
                <span className="font-riso-mono text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
                  2. Tinta de Impresión Riso
                </span>
                <div className="flex flex-wrap gap-1">
                  {RISO_INKS.map((ink) => {
                    const isSelected = activeInk.id === ink.id;
                    return (
                      <button
                        key={ink.id}
                        onClick={() => {
                          setActiveInk(ink);
                          setDrawingColor(ink.hex); // Sync drawing ink color
                          if (selectedElementId) {
                            handleUpdateElement(selectedElementId, { color: ink.hex });
                          }
                        }}
                        className={`flex items-center gap-1.5 px-2 py-1 border-2 text-[10px] font-riso-mono font-bold cursor-pointer rounded-none transition-all ${
                          isSelected
                            ? 'border-neutral-950 bg-[#fffde0] shadow-[1px_1px_0px_0px_rgba(26,26,26,1)] -translate-y-0.5'
                            : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
                        }`}
                      >
                        <span 
                          className="w-3 h-3 border border-neutral-950 shrink-0" 
                          style={{ backgroundColor: ink.hex }} 
                        />
                        <span className="text-neutral-800">{ink.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. HERRAMIENTAS DE DIBUJO (CRAYÓN) */}
              <div className="bg-[#fff9c4]/40 p-2.5 border-2 border-dashed border-neutral-400/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-riso-mono text-[9px] text-neutral-600 font-bold uppercase flex items-center gap-1">
                    <PenTool className="w-3.5 h-3.5 text-[#ff3388]" />
                    Modo Dibujo (Crayón)
                  </span>
                  <span className="font-riso-mono text-[8px] bg-yellow-100 text-yellow-800 px-1 font-bold">NUEVO</span>
                </div>

                <button
                  onClick={() => {
                    setIsDrawingMode(!isDrawingMode);
                    setSelectedElementId(null);
                  }}
                  className={`w-full py-1.5 text-xs font-riso-sans font-black border-2 cursor-pointer rounded-none shadow-[1px_1px_0px_0px_rgba(26,26,26,1)] transition-all ${
                    isDrawingMode
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white hover:bg-neutral-50 border-neutral-900 text-neutral-800'
                  }`}
                >
                  {isDrawingMode ? 'DESACTIVAR PINCEL' : 'ACTIVAR PINTAR CRAYÓN'}
                </button>

                {isDrawingMode && (
                  <div className="space-y-2 pt-1 border-t border-neutral-300/60">
                    {/* Brush width slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] font-riso-mono text-neutral-500 font-bold">
                        <span>GROSOR DEL TRAZO</span>
                        <span>{drawingBrushWidth}px</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="14"
                        step="1"
                        value={drawingBrushWidth}
                        onChange={(e) => setDrawingBrushWidth(parseInt(e.target.value))}
                        className="w-full accent-neutral-800 cursor-pointer h-1"
                      />
                    </div>

                    {/* Clear drawings button */}
                    <button
                      onClick={handleClearDrawings}
                      className="w-full py-1 text-[9px] font-riso-mono font-bold text-red-600 hover:bg-red-50 border border-red-300 flex items-center justify-center gap-1 rounded-none cursor-pointer"
                    >
                      <Eraser className="w-3 h-3" />
                      BORRAR TRAZOS DE ESTA PÁG
                    </button>
                  </div>
                )}
              </div>

              {/* 5. FRASES PRE-HECHAS QUICK STAMP */}
              <div className="space-y-2 pt-1 border-t border-neutral-200">
                <span className="font-riso-mono text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
                  3. Frases Pre-hechas Editorial
                </span>
                <div className="grid grid-cols-2 gap-1 bg-neutral-50 p-1.5 border border-neutral-200 max-h-36 overflow-y-auto">
                  {PREMADE_PHRASES.map((phrase) => (
                    <button
                      key={phrase.id}
                      onClick={() => handleAddPhrase(phrase.text, phrase.font)}
                      className="py-1 px-1.5 border border-neutral-200 bg-white hover:border-neutral-900 hover:bg-neutral-50 text-[9px] font-bold text-neutral-700 cursor-pointer text-center truncate rounded-none transition-all"
                      title={`Estampar "${phrase.text}"`}
                    >
                      {phrase.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. ELEMENTOS A ESTAMPAR (Textos, Fotos y Catálogos) */}
              <div className="space-y-3 pt-1 border-t border-neutral-200">
                <span className="font-riso-mono text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
                  4. Elementos de Collage
                </span>

                {/* Font catalog */}
                <div className="bg-neutral-50 p-2 border border-neutral-200 space-y-1.5">
                  <span className="font-riso-mono text-[9px] text-neutral-500 uppercase tracking-wider block">
                    Tipografía de Letra
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    {(['serif', 'mono', 'sans', 'brutalist', 'typewriter', 'artistic', 'editorial'] as ActiveFont[]).map((font) => (
                      <button
                        key={font}
                        onClick={() => {
                          setActiveFont(font);
                          if (selectedElementId && selectedElement?.type === 'text') {
                            handleUpdateElement(selectedElementId, { font });
                          }
                        }}
                        className={`py-1 text-[10px] border cursor-pointer rounded-none truncate transition-all ${getFontPreviewClass(font)} ${
                          activeFont === font
                            ? 'bg-neutral-900 text-white border-neutral-900 font-black scale-105'
                            : 'bg-white hover:bg-neutral-100 border-neutral-300 text-neutral-700'
                        }`}
                        title={`Estilo ${font}`}
                      >
                        {font === 'serif' ? 'Serif' :
                         font === 'mono' ? 'Monospace' :
                         font === 'sans' ? 'Sans' :
                         font === 'brutalist' ? 'BRUTAL' :
                         font === 'typewriter' ? 'Type' :
                         font === 'artistic' ? 'Artista' :
                         'Editor'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Text Stamp */}
                <button
                  onClick={addTextElement}
                  className="w-full flex items-center justify-center gap-2 font-riso-sans font-bold text-xs border-2 border-neutral-950 py-2.5 bg-[#ff3388] hover:bg-[#e02473] text-white shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer rounded-none"
                >
                  <Type className="w-4 h-4" />
                  ESTAMPAR TEXTO LIBRE
                </button>

                {/* Image upload area */}
                <div className="space-y-1.5">
                  <div
                    className={`border-2 border-dashed rounded-none p-3 text-center transition-colors cursor-pointer flex flex-col items-center justify-center ${
                      isDraggingFile 
                        ? 'border-[#ff3388] bg-[#ffeef2]' 
                        : 'border-neutral-300 hover:border-neutral-500 bg-neutral-50/50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('image-upload-input')?.click()}
                  >
                    <ImageIcon className="w-4 h-4 text-neutral-400 mb-1" />
                    <span className="font-riso-sans font-bold text-[10px] text-neutral-800 uppercase">
                      SUBIR IMAGEN LOCAL
                    </span>
                    <input
                      id="image-upload-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* 7. COLLAGE STICKERS - PAGINATED IN 3 SHEETS */}
              <div className="space-y-2 pt-1 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="font-riso-mono text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
                    5. Stickers Recortados
                  </span>
                  <span className="font-riso-mono text-[8px] bg-[#ffeef2] text-[#ff3388] px-1 font-bold uppercase">
                    {activeStickerCategory === 'matisse' && 'HOJA 1/3: ORGÁNICO'}
                    {activeStickerCategory === 'retro' && 'HOJA 2/3: COLLAGE'}
                    {activeStickerCategory === 'letters_textures' && 'HOJA 3/3: LETRAS'}
                  </span>
                </div>

                {/* Aesthetic index paper tab pagination selectors */}
                <div className="flex gap-0.5 border-b border-neutral-900">
                  {[
                    { id: 'matisse', label: 'H1: Orgánico', desc: 'Matisse y Bauhaus' },
                    { id: 'retro', label: 'H2: Collage', desc: 'Elementos Retro' },
                    { id: 'letters_textures', label: 'H3: Letras', desc: 'Letras y Tramas' },
                  ].map((tab) => {
                    const isSelected = activeStickerCategory === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveStickerCategory(tab.id as any)}
                        className={`flex-1 py-1 text-[9px] font-riso-mono font-bold cursor-pointer text-center uppercase border-2 transition-all rounded-none ${
                          isSelected
                            ? 'border-neutral-900 bg-neutral-900 text-white -mb-[2px] z-10'
                            : 'border-neutral-300 bg-neutral-100 text-neutral-500 hover:text-neutral-800 border-b-neutral-900'
                        }`}
                        title={tab.desc}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-3 gap-1.5 bg-neutral-50 p-2 border-2 border-neutral-900 max-h-56 overflow-y-auto">
                  {STICKERS.filter(sticker => sticker.category === activeStickerCategory).map((sticker) => (
                    <button
                      key={sticker.id}
                      onClick={() => addStickerElement(sticker.id)}
                      className="aspect-square bg-white border border-neutral-200 hover:border-neutral-900 p-1 flex items-center justify-center cursor-pointer rounded-none transition-all hover:scale-105"
                      title={`Estampar ${sticker.name}`}
                    >
                      <div className="w-9 h-9">
                        <svg
                          viewBox={sticker.viewBox}
                          className="w-full h-full fill-current"
                          style={{ color: activeInk.hex }}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {sticker.paths.map((p, i) => (
                            <path key={i} d={p} />
                          ))}
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </section>

            {/* CENTER PANEL (Canvas Editor & bottom timeline) */}
            <section className="order-1 md:order-2 flex-1 bg-[#eae7e2] p-4 md:p-6 flex flex-col gap-5 justify-between overflow-y-auto">
              
              {/* Interactive Canvas - Aligned to top for visibility */}
              <div className="flex-1 flex items-start justify-center pt-2 md:pt-4">
                <PageEditor
                  pageNumber={activePage.pageNumber}
                  pageName={
                    activePage.pageNumber === 1 ? 'Portada' : 
                    activePage.pageNumber === pageCount ? 'Contra' : 
                    `Int. ${activePage.pageNumber - 1}`
                  }
                  elements={activePage.elements}
                  paperColor={paperColor}
                  selectedElementId={selectedElementId}
                  onSelectElement={handleSelectElement}
                  onUpdateElement={handleUpdateElement}
                  onDeleteElement={handleDeleteElement}
                  isDrawingMode={isDrawingMode}
                  drawingColor={drawingColor}
                  drawingBrushWidth={drawingBrushWidth}
                  drawings={activePage.drawings || []}
                  onUpdateDrawings={handleUpdateDrawings}
                  showGrid={showGrid}
                  aspectClass={paperSize.aspectClass}
                  activeTexture={activeTexture}
                  onInteractionStart={saveHistory}
                />
              </div>

              {/* Bottom Page Strip Miniature Row */}
              <PageStrip
                pages={pages}
                activePageNumber={activePageNumber}
                onPageSelect={handlePageSelect}
                paperColor={paperColor}
                aspectClass={paperSize.aspectClass}
              />

            </section>

            {/* RIGHT PANEL (Inspector Panel, Exporter & Grid Helpers) */}
            <section className="order-3 md:order-3 w-full md:w-64 lg:w-72 bg-white border-t-2 md:border-t-0 md:border-l-2 border-neutral-900 p-4 overflow-y-auto shrink-0">
              
              {selectedElement ? (
                /* Element controls */
                <div className="space-y-6">
                  
                  {/* Selected Element Header */}
                  <div className="pb-3 border-b border-neutral-200 flex justify-between items-center">
                    <div>
                      <h4 className="font-riso-sans font-black text-xs text-neutral-900 uppercase tracking-tight">
                        Inspector de Elemento
                      </h4>
                      <p className="font-riso-mono text-[9px] text-neutral-500 uppercase mt-0.5">
                        {selectedElement.type === 'text' ? 'Texto Editable' : 
                         selectedElement.type === 'sticker' ? 'Sticker Silueta' : 
                         'Placa de Foto / Riso'}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedElementId(null)}
                      className="w-5 h-5 border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 cursor-pointer text-xs font-bold"
                      title="Deseleccionar"
                    >
                      ✕
                    </button>
                  </div>

                  {/* 1. Content Area for text */}
                  {selectedElement.type === 'text' && (
                    <div className="space-y-2">
                      <span className="font-riso-mono text-[10px] text-neutral-500 font-bold uppercase block">
                        Contenido del Texto
                      </span>
                      <textarea
                        value={selectedElement.content || ''}
                        onChange={(e) => handleUpdateElement(selectedElement.id, { content: e.target.value })}
                        className="w-full p-2 text-xs border-2 border-neutral-900 font-riso-serif focus:outline-none focus:border-[#ff3388] rounded-none bg-[#faf8f5]"
                        rows={4}
                        placeholder="Escribe el texto de tu zine..."
                      />
                    </div>
                  )}

                  {/* 2. Color overlays */}
                  <div className="space-y-2">
                    <span className="font-riso-mono text-[10px] text-neutral-500 font-bold uppercase block">
                      Tinta del Elemento
                    </span>
                    <div className="grid grid-cols-5 gap-1">
                      {RISO_INKS.map((ink) => {
                        const isElementColor = selectedElement.color === ink.hex;
                        return (
                          <button
                            key={ink.id}
                            onClick={() => handleUpdateElement(selectedElement.id, { color: ink.hex })}
                            className={`aspect-square border-2 flex items-center justify-center cursor-pointer transition-all ${
                              isElementColor 
                                ? 'border-neutral-950 scale-105 shadow-xs' 
                                : 'border-neutral-200 hover:border-neutral-400'
                            }`}
                            style={{ backgroundColor: ink.hex }}
                            title={ink.name}
                          >
                            {isElementColor && (
                              <span className="w-1 h-1 bg-white rounded-full" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Scale Range Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-riso-mono text-neutral-500 font-bold">
                      <span className="uppercase">Escala (Tamaño)</span>
                      <span>{Math.round(selectedElement.scale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="3.5"
                      step="0.05"
                      value={selectedElement.scale}
                      onChange={(e) => handleUpdateElement(selectedElement.id, { scale: parseFloat(e.target.value) })}
                      className="w-full accent-[#ff3388] cursor-pointer"
                    />
                  </div>

                  {/* 4. Rotation Range Dial */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-riso-mono text-neutral-500 font-bold">
                      <span className="uppercase">Ángulo (Rotación)</span>
                      <span>{selectedElement.rotation}º</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="359"
                      step="1"
                      value={selectedElement.rotation}
                      onChange={(e) => handleUpdateElement(selectedElement.id, { rotation: parseInt(e.target.value) })}
                      className="w-full accent-[#ff3388] cursor-pointer"
                    />
                  </div>

                  {/* 5. Z-Index layer controllers */}
                  <div className="space-y-2">
                    <span className="font-riso-mono text-[10px] text-neutral-500 font-bold uppercase block">
                      Orden de Capas (Z-Index)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleUpdateElement(selectedElement.id, { zIndex: selectedElement.zIndex + 5 })}
                        className="py-1 text-[9px] font-riso-mono border border-neutral-900 bg-white hover:bg-neutral-50 cursor-pointer font-bold text-center rounded-none shadow-[1px_1px_0px_0px_rgba(26,26,26,1)] active:translate-x-0.5 active:translate-y-0.5"
                      >
                        ▲ SUBIR CAPA
                      </button>
                      <button
                        onClick={() => handleUpdateElement(selectedElement.id, { zIndex: Math.max(1, selectedElement.zIndex - 5) })}
                        className="py-1 text-[9px] font-riso-mono border border-neutral-900 bg-white hover:bg-neutral-50 cursor-pointer font-bold text-center rounded-none shadow-[1px_1px_0px_0px_rgba(26,26,26,1)] active:translate-x-0.5 active:translate-y-0.5"
                      >
                        ▼ BAJAR CAPA
                      </button>
                    </div>
                  </div>

                  {/* Creative Transformations: Mirroring & Duplication */}
                  <div className="space-y-2">
                    <span className="font-riso-mono text-[10px] text-neutral-500 font-bold uppercase block">
                      Transformaciones Creativas
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => {
                          saveHistory();
                          handleUpdateElement(selectedElement.id, { flipX: !selectedElement.flipX });
                        }}
                        className={`py-1 text-[9px] font-riso-mono border border-neutral-900 cursor-pointer font-bold text-center rounded-none shadow-[1px_1px_0px_0px_rgba(26,26,26,1)] active:translate-x-0.5 active:translate-y-0.5 ${
                          selectedElement.flipX ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-800 hover:bg-neutral-50'
                        }`}
                        title="Espejar horizontalmente"
                      >
                        ↔ VOLTEAR H
                      </button>
                      <button
                        onClick={() => {
                          saveHistory();
                          handleUpdateElement(selectedElement.id, { flipY: !selectedElement.flipY });
                        }}
                        className={`py-1 text-[9px] font-riso-mono border border-neutral-900 cursor-pointer font-bold text-center rounded-none shadow-[1px_1px_0px_0px_rgba(26,26,26,1)] active:translate-x-0.5 active:translate-y-0.5 ${
                          selectedElement.flipY ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-800 hover:bg-neutral-50'
                        }`}
                        title="Espejar verticalmente"
                      >
                        ↕ VOLTEAR V
                      </button>
                      <button
                        onClick={() => {
                          saveHistory();
                          const dupId = `dup_${Date.now()}`;
                          const dupElement: ZineElement = {
                            ...selectedElement,
                            id: dupId,
                            x: Math.min(95, selectedElement.x + 5),
                            y: Math.min(95, selectedElement.y + 5),
                            zIndex: selectedElement.zIndex + 1
                          };
                          setPages(prevPages => 
                            prevPages.map(p => {
                              if (p.pageNumber === activePageNumber) {
                                return {
                                  ...p,
                                  elements: [...p.elements, dupElement]
                                };
                              }
                              return p;
                            })
                          );
                          setSelectedElementId(dupId);
                        }}
                        className="py-1 text-[9px] font-riso-mono border border-neutral-900 bg-[#e8f5e9] hover:bg-[#c8e6c9] text-green-800 cursor-pointer font-bold text-center rounded-none shadow-[1px_1px_0px_0px_rgba(26,26,26,1)] active:translate-x-0.5 active:translate-y-0.5"
                        title="Duplicar este objeto"
                      >
                        ❐ DUPLICAR
                      </button>
                    </div>
                  </div>

                  {/* 6. Delete element */}
                  <button
                    onClick={() => handleDeleteElement(selectedElement.id)}
                    className="w-full flex items-center justify-center gap-1.5 font-riso-sans font-bold text-xs border border-red-600 bg-red-50 hover:bg-red-100 text-red-600 py-2 cursor-pointer rounded-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    ELIMINAR OBJETO
                  </button>

                </div>
              ) : (
                /* General canvas options: export, grid alignment & zine stats */
                <div className="h-full flex flex-col justify-between py-1">
                  <div className="space-y-5">
                    
                    {/* Visual Guideline View Trigger (Reglas / Grillas) */}
                    <div className="bg-neutral-50 p-3 border border-neutral-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-riso-sans font-bold text-xs text-neutral-800 uppercase">
                          Guías y Alineación
                        </span>
                        <span className="font-riso-mono text-[8px] bg-green-100 text-green-800 px-1.5 font-black uppercase">
                          Corte
                        </span>
                      </div>
                      
                      <button
                        onClick={() => setShowGrid(!showGrid)}
                        className={`w-full py-1.5 text-xs font-riso-mono border-2 font-bold cursor-pointer rounded-none transition-all flex items-center justify-center gap-1.5 shadow-[1px_1px_0px_0px_rgba(26,26,26,1)] ${
                          showGrid
                            ? 'bg-green-800 text-white border-green-900'
                            : 'bg-white border-neutral-900 hover:bg-neutral-50 text-neutral-800'
                        }`}
                      >
                        <Grid className="w-3.5 h-3.5" />
                        {showGrid ? '✓ REGLAS ACTIVADAS' : 'VER GRILLA / REGLAS'}
                      </button>
                    </div>

                    {/* SAVE & EXPORT INDIVIDUAL PAGES */}
                    <div className="bg-neutral-50 p-3 border border-neutral-200 space-y-3">
                      <span className="font-riso-sans font-bold text-xs text-neutral-800 uppercase tracking-wide block">
                        Guardar Página {activePageNumber}
                      </span>
                      
                      <p className="font-riso-serif text-[11px] text-neutral-600 leading-normal">
                        Guarda únicamente la página activa en alta resolución (3x) para catalogación o imprentas digitales.
                      </p>

                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={handleExportPng}
                          disabled={isExporting}
                          className="py-1.5 px-2 border-2 border-neutral-900 bg-white hover:bg-neutral-50 text-[10px] font-riso-mono font-bold cursor-pointer rounded-none text-center shadow-[1px_1px_0px_0px_rgba(26,26,26,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-1"
                        >
                          <Download className="w-3 h-3 text-[#ff3388]" />
                          PNG HIGH
                        </button>
                        <button
                          onClick={handleExportPdf}
                          disabled={isExporting}
                          className="py-1.5 px-2 border-2 border-neutral-900 bg-white hover:bg-neutral-50 text-[10px] font-riso-mono font-bold cursor-pointer rounded-none text-center shadow-[1px_1px_0px_0px_rgba(26,26,26,1)] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-1"
                        >
                          <FileDown className="w-3 h-3 text-[#0055ff]" />
                          PDF IND.
                        </button>
                      </div>
                      
                      {isExporting && (
                        <div className="text-[9px] font-riso-mono text-center text-[#ff3388] font-bold animate-pulse uppercase">
                          Procesando renderizado...
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="space-y-2">
                      <span className="font-riso-mono text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">
                        ESTADÍSTICAS DEL FANZINE
                      </span>
                      <div className="space-y-1 bg-neutral-50 p-2.5 border border-neutral-200 text-[11px] font-riso-mono text-neutral-700">
                        <div className="flex justify-between">
                          <span>Papel:</span>
                          <span className="font-bold text-neutral-900">{paperColor.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Formato:</span>
                          <span className="font-bold text-neutral-900">{paperSize.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pliego:</span>
                          <span className="font-bold text-neutral-900">{pageCount} Págs</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Elementos:</span>
                          <span className="font-bold text-[#ff3388]">
                            {pages.reduce((acc, curr) => acc + (curr.elements?.length || 0), 0)} objs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Folding instruction button */}
                  <div 
                    onClick={() => setIsGuideOpen(true)}
                    className="border-2 border-dashed border-[#ff3388] p-3 bg-[#ffeef2] hover:bg-[#ffdce5] transition-colors cursor-pointer text-center space-y-0.5 mt-6"
                  >
                    <span className="font-riso-mono text-[9px] font-black text-[#ff3388] uppercase tracking-wider block">
                      ¿CÓMO ARMAR EL LIBRO?
                    </span>
                    <p className="font-riso-serif text-[11px] text-neutral-800 italic">
                      Ver tutorial con esquemas de plegado
                    </p>
                  </div>
                </div>
              )}

            </section>

          </div>
        )}

      </main>

      {/* EDUCATIONAL FOLD GUIDE DRAWER */}
      <FoldingGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

    </div>
  );
}
