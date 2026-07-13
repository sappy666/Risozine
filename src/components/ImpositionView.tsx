import React, { useState } from 'react';
import { ZinePage, PaperColor } from '../types';
import { StickerSvg } from './StickerSvg';
import { Printer, ArrowLeft, Scissors, HelpCircle, Copy, Layers } from 'lucide-react';

interface ImpositionViewProps {
  pages: ZinePage[];
  paperColor: PaperColor;
  onBackToEditor: () => void;
  aspectClass?: string;
}

export const ImpositionView: React.FC<ImpositionViewProps> = ({
  pages,
  paperColor,
  onBackToEditor,
  aspectClass = 'aspect-[1/1.414]',
}) => {
  // Toggle for 4-page layout: Outside sheet (Págs 4 y 1) vs Inside sheet (Págs 2 y 3)
  const [bifoldSheet, setBifoldSheet] = useState<'outside' | 'inside'>('outside');

  // Helper to find page data by page number
  const getPageByNum = (num: number): ZinePage => {
    return pages.find(p => p.pageNumber === num) || { pageNumber: num, elements: [], drawings: [] };
  };

  const getPageLabel = (num: number): string => {
    if (num === 1) return 'Pág. 1: Portada';
    if (num === pages.length && pages.length > 1) return `Pág. ${num}: Contraportada`;
    return `Pág. ${num}: Int. ${num - 1}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const pageCount = pages.length;

  // Imposition mapping
  // 8 pages layout (4x2):
  const topRowNums = [8, 1, 2, 7];
  const bottomRowNums = [3, 4, 5, 6];

  // 4 pages layout (2x1):
  // Outside: Left page = 4 (Contra), Right page = 1 (Portada)
  // Inside: Left page = 2, Right page = 3
  const bifoldPages = bifoldSheet === 'outside' ? [4, 1] : [2, 3];

  const getFontFamilyClass = (font?: string) => {
    switch (font) {
      case 'serif': return 'font-riso-serif font-semibold';
      case 'mono': return 'font-riso-mono';
      case 'brutalist': return 'font-riso-brutalist uppercase tracking-tighter font-black';
      case 'typewriter': return 'font-riso-typewriter leading-relaxed';
      case 'artistic': return 'font-riso-artistic font-extrabold italic';
      case 'editorial': return 'font-riso-editorial italic font-medium';
      default: return 'font-riso-sans font-black';
    }
  };

  // Shared single page rendering logic
  const renderPageCellContent = (page: ZinePage, isRotated180 = false, scaleFactorMultiplier = 0.58) => {
    return (
      <>
        {/* Vector drawings crayon strokes */}
        {page.drawings && page.drawings.length > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
            <defs>
              <filter id="crayon-rough-filter-imp" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="4" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
            {page.drawings.map((stroke) => (
              <path
                key={stroke.id}
                d={stroke.points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
                stroke={stroke.color}
                strokeWidth={stroke.brushWidth}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#crayon-rough-filter-imp)"
                className="opacity-85"
              />
            ))}
          </svg>
        )}

        {/* Page Elements */}
        {page.elements.map((el) => {
          const scaleFactor = scaleFactorMultiplier * el.scale;
          return (
            <div
              key={el.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${el.x}%`,
                top: `${el.y}%`,
                transform: `translate(-50%, -50%) rotate(${el.rotation}deg) scale(${scaleFactor})`,
                zIndex: el.zIndex,
              }}
            >
              {el.type === 'text' && (
                <div
                  className={`whitespace-pre-wrap leading-none text-center ${getFontFamilyClass(el.font)}`}
                  style={{ 
                    color: el.color,
                    fontSize: '24px',
                    lineHeight: '1.1'
                  }}
                >
                  {el.content}
                </div>
              )}

              {el.type === 'sticker' && el.stickerId && (
                <div className="w-24 h-24 flex items-center justify-center">
                  <StickerSvg stickerId={el.stickerId} color={el.color} />
                </div>
              )}

              {el.type === 'image' && el.imageSrc && (
                <div 
                  className="w-24 h-24 border border-neutral-950 overflow-hidden relative shadow-xs"
                  style={{ backgroundColor: el.color }}
                >
                  <img
                    src={el.imageSrc}
                    className="w-full h-full object-cover mix-blend-multiply filter grayscale contrast-200 brightness-110"
                    alt="Riso Plate"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-5xl mx-auto p-4 md:p-6">
      
      {/* Header controls (Hidden during print) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border-2 border-neutral-900 p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] no-print">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-riso-sans font-black text-lg text-neutral-900 tracking-tight uppercase">
              PLANCHA DE IMPOSICIÓN ({pageCount} PÁGS)
            </span>
            <span className="font-riso-mono text-[10px] bg-[#e8f5e9] text-green-700 border border-green-400 px-2 py-0.5 font-bold uppercase">
              Impresión Lista
            </span>
          </div>
          <p className="font-riso-serif text-sm text-neutral-600">
            {pageCount === 8 && 'Páginas distribuidas de forma técnica en 4x2 listas para doblar y hacer el mini-fanzine.'}
            {pageCount === 4 && 'Páginas distribuidas en formato díptico (mitad de hoja) listas para plegar.'}
            {pageCount === 1 && 'Lienzo póster a página completa listo para imprimir directamente.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onBackToEditor}
            className="flex items-center gap-2 font-riso-mono text-xs font-bold border-2 border-neutral-900 px-4 py-2.5 bg-white hover:bg-neutral-50 transition-colors cursor-pointer rounded-none shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <ArrowLeft className="w-4 h-4" />
            VOLVER AL EDITOR
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 font-riso-sans font-black text-xs border-2 border-neutral-900 px-5 py-2.5 bg-[#ff3388] text-white hover:bg-[#e02473] transition-colors cursor-pointer rounded-none shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Printer className="w-4 h-4" />
            IMPRIMIR PLIEGO (PDF)
          </button>
        </div>
      </div>

      {/* Dynamic 4-page Spread toggle */}
      {pageCount === 4 && (
        <div className="flex justify-center gap-2 no-print bg-neutral-100 p-2 border border-neutral-300">
          <button
            onClick={() => setBifoldSheet('outside')}
            className={`px-4 py-2 text-xs font-riso-sans font-bold border-2 transition-all cursor-pointer ${
              bifoldSheet === 'outside'
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            CARA EXTERIOR (Págs 4 y 1 - Portada)
          </button>
          <button
            onClick={() => setBifoldSheet('inside')}
            className={`px-4 py-2 text-xs font-riso-sans font-bold border-2 transition-all cursor-pointer ${
              bifoldSheet === 'inside'
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            CARA INTERIOR (Págs 2 y 3)
          </button>
        </div>
      )}

      {/* Info Notice about technical imposition layout (Hidden during print) */}
      <div className="bg-[#f0f8ff] border-2 border-neutral-900 p-4 flex gap-3 no-print items-start">
        <HelpCircle className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-riso-sans font-bold text-neutral-900 text-xs uppercase tracking-wide">
            {pageCount === 8 ? 'Instrucciones para plegado 8 Páginas' : pageCount === 4 ? 'Instrucciones para plegado Díptico 4 Páginas' : 'Instrucciones Póster'}
          </h5>
          <p className="font-riso-serif text-xs text-neutral-700 leading-relaxed">
            {pageCount === 8 && 'Imprime esta plancha horizontal. Corta la línea roja vertical del centro y dobla como un cuadernillo de 8 caras. ¡Tu portada quedará delante!'}
            {pageCount === 4 && 'Imprime ambas caras (Exterior e Interior) en el mismo papel. Dobla por la mitad vertical para obtener un folleto/díptico de 4 caras perfectas.'}
            {pageCount === 1 && 'Imprime este póster a página completa de manera directa. Ideal para afiches de collage o tapas de fanzines independientes.'}
          </p>
        </div>
      </div>

      {/* The Printable Landscape Sheet */}
      <div className="w-full flex items-center justify-center p-2 border-2 border-neutral-300 bg-neutral-100/50 relative overflow-x-auto py-8 no-print">
        <div 
          className="print-page relative shrink-0 w-[297mm] h-[210mm] border-2 border-neutral-900 shadow-2xl overflow-hidden"
          style={{ backgroundColor: paperColor.hex }}
        >
          {/* Permanent Grain Overlay for printing */}
          <div 
            className="riso-grain-overlay" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='printNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23printNoise)'/%3E%3C/svg%3E")` 
            }} 
          />

          {/* 8 Pages Imposition Sheet (4 columns x 2 rows) */}
          {pageCount === 8 && (
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-2">
              {/* Row 1: Pages 8, 1, 2, 7 (Rotated 180deg) */}
              {topRowNums.map((num) => {
                const page = getPageByNum(num);
                return (
                  <div 
                    key={num} 
                    className="relative w-full h-full border-r border-b border-dashed border-neutral-400/50 p-6 flex flex-col justify-between overflow-hidden rotate-180"
                  >
                    <div className="absolute bottom-2 left-2 pointer-events-none font-riso-mono text-[8px] text-neutral-400 uppercase select-none tracking-widest">
                      {getPageLabel(num)} (Girar 180)
                    </div>
                    {renderPageCellContent(page, true, 0.58)}
                  </div>
                );
              })}

              {/* Row 2: Pages 3, 4, 5, 6 (Normal orientation) */}
              {bottomRowNums.map((num) => {
                const page = getPageByNum(num);
                return (
                  <div 
                    key={num} 
                    className="relative w-full h-full border-r border-dashed border-neutral-400/50 p-6 flex flex-col justify-between overflow-hidden"
                  >
                    <div className="absolute bottom-2 left-2 pointer-events-none font-riso-mono text-[8px] text-neutral-400 uppercase select-none tracking-widest">
                      {getPageLabel(num)}
                    </div>
                    {renderPageCellContent(page, false, 0.58)}
                  </div>
                );
              })}
            </div>
          )}

          {/* 4 Pages Imposition Sheet (2 columns x 1 row) */}
          {pageCount === 4 && (
            <div className="absolute inset-0 grid grid-cols-2">
              {bifoldPages.map((num) => {
                const page = getPageByNum(num);
                return (
                  <div 
                    key={num} 
                    className="relative w-full h-full border-r border-dashed border-neutral-400/50 p-12 overflow-hidden"
                  >
                    <div className="absolute bottom-4 left-4 pointer-events-none font-riso-mono text-[9px] text-neutral-400 uppercase select-none tracking-widest">
                      {getPageLabel(num)}
                    </div>
                    {renderPageCellContent(page, false, 0.85)}
                  </div>
                );
              })}
            </div>
          )}

          {/* 1 Page Full Poster Sheet */}
          {pageCount === 1 && (
            <div className="absolute inset-0 p-16 flex items-center justify-center">
              <div className="relative w-full h-full overflow-hidden border border-dashed border-neutral-400/50">
                <div className="absolute bottom-4 left-4 pointer-events-none font-riso-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                  Póster / Afiche Individual - Pág 1
                </div>
                {renderPageCellContent(getPageByNum(1), false, 1.2)}
              </div>
            </div>
          )}

          {/* 8-page specific Folding guidelines */}
          {pageCount === 8 && (
            <div className="absolute inset-0 pointer-events-none z-40">
              {/* Center horizontal crease */}
              <div className="absolute top-1/2 left-0 right-0 h-0 border-t-2 border-dashed border-neutral-400/40" />
              {/* Vertical creases */}
              <div className="absolute top-0 bottom-0 left-1/4 border-l-2 border-dashed border-neutral-400/40" />
              <div className="absolute top-0 bottom-0 left-2/4 border-l-2 border-dashed border-neutral-400/40" />
              <div className="absolute top-0 bottom-0 left-3/4 border-l-2 border-dashed border-neutral-400/40" />

              {/* Cut slit line in center */}
              <div className="absolute top-1/2 left-1/4 right-1/4 h-0 flex items-center justify-center">
                <div className="w-full border-t-4 border-red-500 relative flex justify-around">
                  <span className="absolute -top-3.5 bg-red-500 text-white font-riso-mono text-[8px] font-bold px-2 py-0.5 rounded-none tracking-widest uppercase flex items-center gap-1">
                    <Scissors className="w-3 h-3 inline fill-white" /> CORTAR / CUT SLIT
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 4-page specific Folding line */}
          {pageCount === 4 && (
            <div className="absolute inset-0 pointer-events-none z-40">
              <div className="absolute top-0 bottom-0 left-1/2 border-l-2 border-dashed border-neutral-500/40" />
              <div className="absolute inset-x-0 top-0 h-4 flex items-center justify-center">
                <span className="bg-neutral-800 text-white font-riso-mono text-[8px] px-2 py-0.5 uppercase tracking-wider">
                  Pliegue Central
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DIRECT PRINT RENDER TEMPLATE (Pure CSS target for print calls) */}
      <div className="hidden print:block">
        <div 
          className="print-page relative w-[297mm] h-[210mm] overflow-hidden"
          style={{ backgroundColor: paperColor.hex }}
        >
          <div 
            className="riso-grain-overlay" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='pNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23pNoise)'/%3E%3C/svg%3E")` 
            }} 
          />

          {/* Render 8 pages for print */}
          {pageCount === 8 && (
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-2">
              {topRowNums.map((num) => (
                <div key={num} className="relative w-full h-full border-r border-b border-dashed border-neutral-400/50 p-6 overflow-hidden rotate-180">
                  {renderPageCellContent(getPageByNum(num), true, 0.58)}
                </div>
              ))}
              {bottomRowNums.map((num) => (
                <div key={num} className="relative w-full h-full border-r border-dashed border-neutral-400/50 p-6 overflow-hidden">
                  {renderPageCellContent(getPageByNum(num), false, 0.58)}
                </div>
              ))}
            </div>
          )}

          {/* Render 4 pages for print */}
          {pageCount === 4 && (
            <div className="absolute inset-0 grid grid-cols-2">
              {bifoldPages.map((num) => (
                <div key={num} className="relative w-full h-full border-r border-dashed border-neutral-400/50 p-12 overflow-hidden">
                  {renderPageCellContent(getPageByNum(num), false, 0.85)}
                </div>
              ))}
            </div>
          )}

          {/* Render 1 page for print */}
          {pageCount === 1 && (
            <div className="absolute inset-0 p-16 flex items-center justify-center">
              <div className="relative w-full h-full overflow-hidden border border-dashed border-neutral-400/50">
                {renderPageCellContent(getPageByNum(1), false, 1.2)}
              </div>
            </div>
          )}

          {/* Printing fold guidelines */}
          {pageCount === 8 && (
            <div className="absolute inset-0 pointer-events-none z-40">
              <div className="absolute top-1/2 left-0 right-0 h-0 border-t-2 border-dashed border-neutral-400/40" />
              <div className="absolute top-0 bottom-0 left-1/4 border-l-2 border-dashed border-neutral-400/40" />
              <div className="absolute top-0 bottom-0 left-2/4 border-l-2 border-dashed border-neutral-400/40" />
              <div className="absolute top-0 bottom-0 left-3/4 border-l-2 border-dashed border-neutral-400/40" />
              <div className="absolute top-1/2 left-1/4 right-1/4 h-0 flex items-center justify-center">
                <div className="w-full border-t-4 border-red-500" />
              </div>
            </div>
          )}

          {pageCount === 4 && (
            <div className="absolute inset-0 pointer-events-none z-40">
              <div className="absolute top-0 bottom-0 left-1/2 border-l-2 border-dashed border-neutral-500/40" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
