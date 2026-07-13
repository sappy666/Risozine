import React from 'react';
import { ZinePage, PaperColor } from '../types';
import { StickerSvg } from './StickerSvg';

interface PageStripProps {
  pages: ZinePage[];
  activePageNumber: number;
  onPageSelect: (pageNumber: number) => void;
  paperColor: PaperColor;
  aspectClass?: string;
}

export const PageStrip: React.FC<PageStripProps> = ({
  pages,
  activePageNumber,
  onPageSelect,
  paperColor,
  aspectClass = 'aspect-[1/1.414]',
}) => {
  const getPageName = (num: number): string => {
    if (num === 1) return 'Portada';
    if (num === pages.length && pages.length > 1) return 'Contra';
    return `Int. ${num - 1}`;
  };

  return (
    <div className="w-full bg-white border-2 border-neutral-900 p-4 rounded-none shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] no-print">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-riso-sans font-bold text-xs uppercase text-neutral-900 tracking-wider">
          Fila de Páginas (Páginas del Fanzine)
        </h4>
        <span className="font-riso-mono text-[10px] text-neutral-500 uppercase">
          {pages.length} {pages.length === 1 ? 'Página' : 'Páginas'} • {pages.length === 8 ? '8 págs mini-libro' : pages.length === 4 ? 'Díptico / Folleto' : 'Lienzo póster'}
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-900 scrollbar-track-neutral-100">
        {pages.map((page) => {
          const isActive = page.pageNumber === activePageNumber;
          const pageName = getPageName(page.pageNumber);

          return (
            <button
              key={page.pageNumber}
              onClick={() => onPageSelect(page.pageNumber)}
              className={`flex-1 min-w-[76px] flex flex-col items-center p-2 border-2 cursor-pointer transition-all rounded-none ${
                isActive
                  ? 'border-neutral-950 bg-[#fff9c4] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] -translate-y-0.5'
                  : 'border-neutral-200 hover:border-neutral-400 bg-neutral-50/50'
              }`}
            >
              {/* Thumbnail Miniature of Page Contents */}
              <div
                className={`relative w-12 ${aspectClass} border border-neutral-950 overflow-hidden shadow-xs shrink-0`}
                style={{ backgroundColor: paperColor.hex }}
              >
                {/* Tiny grain overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-10 mix-blend-multiply" 
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='tinyNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23tinyNoise)'/%3E%3C/svg%3E")` 
                  }} 
                />

                {/* Drawings representation in thumbnail */}
                {page.drawings && page.drawings.length > 0 && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
                    {page.drawings.map((stroke) => (
                      <path
                        key={stroke.id}
                        d={stroke.points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
                        stroke={stroke.color}
                        strokeWidth={stroke.brushWidth * 0.75}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}
                  </svg>
                )}

                {/* Render scaled-down elements */}
                {page.elements.map((el) => {
                  const scaleFactor = 0.14 * el.scale; // heavy downscaling for thumbnail
                  
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
                          className={`font-riso-serif text-neutral-950 whitespace-nowrap text-[14px] leading-none ${
                            el.font === 'serif' ? 'font-riso-serif' : 
                            el.font === 'mono' ? 'font-riso-mono' : 
                            'font-riso-sans font-bold'
                          }`}
                          style={{ color: el.color }}
                        >
                          {el.content?.split('\n')[0] || 'Txt'}
                        </div>
                      )}

                      {el.type === 'sticker' && el.stickerId && (
                        <div className="w-16 h-16 flex items-center justify-center">
                          <StickerSvg stickerId={el.stickerId} color={el.color} />
                        </div>
                      )}

                      {el.type === 'image' && el.imageSrc && (
                        <div 
                          className="w-16 h-16 border border-neutral-950 overflow-hidden relative"
                          style={{ backgroundColor: el.color }}
                        >
                          <img
                            src={el.imageSrc}
                            className="w-full h-full object-cover mix-blend-multiply grayscale contrast-200"
                            alt="Mini stencil"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Page Labels */}
              <div className="mt-2 text-center">
                <p className="font-riso-mono text-[9px] font-black text-neutral-900 leading-none">
                  PÁG. {page.pageNumber}
                </p>
                <p className="font-riso-sans text-[8px] text-neutral-500 font-semibold truncate max-w-[64px] mt-0.5 leading-none">
                  {pageName}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
