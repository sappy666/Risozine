import React from 'react';
import { FOLDING_STEPS } from '../data';

interface FoldingGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FoldingGuide: React.FC<FoldingGuideProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity duration-300 no-print"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#fcfaf2] border-l-2 border-neutral-900 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out no-print ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-900 flex justify-between items-center bg-[#ffeef2]">
          <div>
            <h3 className="font-riso-sans font-bold text-lg text-neutral-900 tracking-tight">
              GUÍA DE DOBLADO
            </h3>
            <p className="font-riso-mono text-xs text-neutral-600 uppercase mt-0.5">
              Fanzine de una hoja (8 Pág)
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 border-2 border-neutral-900 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer rounded-none font-riso-mono font-bold"
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="bg-[#fffde0] p-4 border border-dashed border-neutral-800 space-y-2">
            <span className="font-riso-mono text-[10px] bg-neutral-900 text-white px-2 py-0.5 font-bold uppercase tracking-wider">
              FILOSOFÍA FANZINERA
            </span>
            <p className="font-riso-serif text-sm text-neutral-800 leading-relaxed italic">
              "Un fanzine de una sola hoja es magia pura. No requiere corchetes ni pegamento; solo una impresora, unas tijeras y un pliegue inteligente."
            </p>
          </div>

          <div className="space-y-6">
            {FOLDING_STEPS.map((step) => (
              <div 
                key={step.step} 
                className="bg-white border-2 border-neutral-900 p-4 relative flex flex-col md:flex-row gap-4"
              >
                {/* Visual Diagram */}
                <div className="w-16 h-16 shrink-0 bg-[#f0f8ff] border-2 border-neutral-900 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-12 h-12 stroke-neutral-900 fill-none stroke-2">
                    {/* Render specific folding vectors based on step */}
                    {step.step === 1 && (
                      <>
                        <rect x="15" y="15" width="70" height="70" strokeDasharray="4 4" />
                        <line x1="15" y1="50" x2="85" y2="50" strokeDasharray="2 2" />
                        <line x1="50" y1="15" x2="50" y2="85" strokeDasharray="2 2" />
                      </>
                    )}
                    {step.step === 2 && (
                      <>
                        <rect x="15" y="15" width="70" height="70" strokeDasharray="4 4" />
                        <line x1="50" y1="35" x2="50" y2="65" stroke="#ff3388" />
                        {/* Little scissors */}
                        <path d="M43,30 C43,32 46,32 47,35 L50,38 L53,35 C54,32 57,32 57,30 C57,28 54,28 53,30 L50,35 L47,30 C46,28 43,28 43,30 Z" fill="none" stroke="#ff3388" />
                      </>
                    )}
                    {step.step === 3 && (
                      <>
                        <rect x="15" y="15" width="70" height="70" strokeDasharray="4 4" opacity="0.3" />
                        <path d="M 50,20 L 80,50 L 50,80 L 20,50 Z" />
                        <path d="M 12,50 L 22,50 M 88,50 L 78,50" stroke="#0055ff" />
                      </>
                    )}
                    {step.step === 4 && (
                      <>
                        <path d="M 25,25 L 45,15 L 75,25 L 75,75 L 45,85 L 25,75 Z" />
                        <line x1="45" y1="15" x2="45" y2="85" />
                        <path d="M 50,30 L 65,35 M 50,45 L 65,50 M 50,60 L 65,65" stroke="#007a5e" />
                      </>
                    )}
                  </svg>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <h4 className="font-riso-sans font-bold text-neutral-900 text-sm tracking-tight">
                    {step.title}
                  </h4>
                  <p className="font-riso-serif text-xs text-neutral-700 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#f2faf5] p-4 border-2 border-neutral-900 text-center space-y-2">
            <h5 className="font-riso-mono text-xs font-bold text-neutral-900">
              CONSEJO RISO
            </h5>
            <p className="font-riso-serif text-xs text-neutral-700 leading-relaxed">
              Al imprimir tu fanzine, recuerda doblar y marcar los pliegues con la parte posterior de una cuchara o plegadera para obtener bordes limpios y profesionales.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
