import React, { useRef, useState } from 'react';
import { ZineElement, PaperColor, DrawingStroke } from '../types';
import { StickerSvg } from './StickerSvg';
import { Trash2, RotateCw, ZoomIn, ZoomOut, Layers, HelpCircle, PenTool } from 'lucide-react';

interface PageEditorProps {
  pageNumber: number;
  pageName: string;
  elements: ZineElement[];
  paperColor: PaperColor;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<ZineElement>) => void;
  onDeleteElement: (id: string) => void;
  // Drawing integration
  isDrawingMode: boolean;
  drawingColor: string;
  drawingBrushWidth: number;
  drawings: DrawingStroke[];
  onUpdateDrawings: (drawings: DrawingStroke[]) => void;
  // Grid / rulers alignment
  showGrid: boolean;
  // Dynamic paper aspect class
  aspectClass?: string;
  activeTexture?: string;
  onInteractionStart?: () => void;
}

export const PageEditor: React.FC<PageEditorProps> = ({
  pageNumber,
  pageName,
  elements,
  paperColor,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  isDrawingMode,
  drawingColor,
  drawingBrushWidth,
  drawings = [],
  onUpdateDrawings,
  showGrid,
  aspectClass = 'aspect-[1/1.414]',
  activeTexture = 'riso',
  onInteractionStart,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [currentStroke, setCurrentStroke] = useState<DrawingStroke | null>(null);

  // Drag and Drop implementation for moving elements
  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    const target = e.target as HTMLElement;
    if (target.closest('.control-btn') || target.closest('.no-drag') || isDrawingMode) return;
    if (editingTextId === elementId) return;

    e.preventDefault();
    onInteractionStart?.();
    onSelectElement(elementId);

    const startX = e.clientX;
    const startY = e.clientY;
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    const initialX = element.x;
    const initialY = element.y;

    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const rect = canvasElement.getBoundingClientRect();

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      // Convert pixels to percentage based on canvas size
      const pctDeltaX = (deltaX / rect.width) * 100;
      const pctDeltaY = (deltaY / rect.height) * 100;

      let newX = Math.round((initialX + pctDeltaX) * 10) / 10;
      let newY = Math.round((initialY + pctDeltaY) * 10) / 10;

      // Restrict to canvas boundary to prevent elements flying off-screen
      newX = Math.max(0, Math.min(100, newX));
      newY = Math.max(0, Math.min(100, newY));

      onUpdateElement(elementId, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Drag and Drop implementation for touch (mobile/tablets)
  const handleTouchStart = (e: React.TouchEvent, elementId: string) => {
    const target = e.target as HTMLElement;
    if (target.closest('.control-btn') || target.closest('.no-drag') || isDrawingMode) return;
    if (editingTextId === elementId) return;

    onInteractionStart?.();
    onSelectElement(elementId);

    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    const initialX = element.x;
    const initialY = element.y;

    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const rect = canvasElement.getBoundingClientRect();

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const currentTouch = moveEvent.touches[0];
      const deltaX = currentTouch.clientX - startX;
      const deltaY = currentTouch.clientY - startY;

      const pctDeltaX = (deltaX / rect.width) * 100;
      const pctDeltaY = (deltaY / rect.height) * 100;

      let newX = Math.round((initialX + pctDeltaX) * 10) / 10;
      let newY = Math.round((initialY + pctDeltaY) * 10) / 10;

      newX = Math.max(0, Math.min(100, newX));
      newY = Math.max(0, Math.min(100, newY));

      onUpdateElement(elementId, { x: newX, y: newY });
    };

    const handleTouchEnd = () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  };

  // Smooth Rotate via dragging handle
  const handleRotateStart = (e: React.MouseEvent | React.TouchEvent, element: ZineElement) => {
    e.preventDefault();
    e.stopPropagation();

    onInteractionStart?.();

    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const rect = canvasElement.getBoundingClientRect();

    const centerX = rect.left + (element.x / 100) * rect.width;
    const centerY = rect.top + (element.y / 100) * rect.height;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const startAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    const initialRotation = element.rotation;

    const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
      const moveX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const moveY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const currentAngle = Math.atan2(moveY - centerY, moveX - centerX) * (180 / Math.PI);
      let newRotation = Math.round(initialRotation + (currentAngle - startAngle));

      // Normalize to 0-359
      newRotation = (newRotation % 360 + 360) % 360;
      onUpdateElement(element.id, { rotation: newRotation });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
  };

  // Smooth Scale via dragging corner handle
  const handleScaleStart = (e: React.MouseEvent | React.TouchEvent, element: ZineElement) => {
    e.preventDefault();
    e.stopPropagation();

    onInteractionStart?.();

    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const rect = canvasElement.getBoundingClientRect();

    const centerX = rect.left + (element.x / 100) * rect.width;
    const centerY = rect.top + (element.y / 100) * rect.height;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const startDist = Math.hypot(clientX - centerX, clientY - centerY);
    const initialScale = element.scale;

    const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
      const moveX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const moveY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;

      const currentDist = Math.hypot(moveX - centerX, moveY - centerY);
      if (startDist === 0) return;

      let newScale = (currentDist / startDist) * initialScale;
      newScale = Math.max(0.2, Math.min(4.0, parseFloat(newScale.toFixed(2))));
      onUpdateElement(element.id, { scale: newScale });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
  };

  // Mouse wheel scroll to rotate or scale smoothly
  const handleWheel = (e: React.WheelEvent, elementId: string) => {
    if (editingTextId === elementId) return;
    e.preventDefault();
    
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    if (e.shiftKey) {
      // Scale with Shift + Scroll
      const factor = e.deltaY > 0 ? -0.05 : 0.05;
      const newScale = Math.max(0.2, Math.min(4.0, parseFloat((element.scale + factor).toFixed(2))));
      onUpdateElement(elementId, { scale: newScale });
    } else {
      // Rotate with Scroll
      const rotateFactor = e.deltaY > 0 ? 5 : -5;
      const newRotation = (element.rotation + rotateFactor + 360) % 360;
      onUpdateElement(elementId, { rotation: newRotation });
    }
  };

  // Drawing mode pointer handlers
  const handleCanvasStartDrawing = (clientX: number, clientY: number) => {
    onInteractionStart?.();
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const rect = canvasElement.getBoundingClientRect();

    const pctX = ((clientX - rect.left) / rect.width) * 100;
    const pctY = ((clientY - rect.top) / rect.height) * 100;

    const stroke: DrawingStroke = {
      id: `stroke_${Date.now()}`,
      points: [{ x: pctX, y: pctY }],
      color: drawingColor,
      brushWidth: drawingBrushWidth,
    };

    setCurrentStroke(stroke);
  };

  const handleCanvasDragDrawing = (clientX: number, clientY: number) => {
    if (!currentStroke) return;
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const rect = canvasElement.getBoundingClientRect();

    const pctX = ((clientX - rect.left) / rect.width) * 100;
    const pctY = ((clientY - rect.top) / rect.height) * 100;

    // Prevent unnecessary redundant points
    const lastPoint = currentStroke.points[currentStroke.points.length - 1];
    if (lastPoint && Math.hypot(pctX - lastPoint.x, pctY - lastPoint.y) < 0.3) {
      return;
    }

    setCurrentStroke(prev => {
      if (!prev) return null;
      return {
        ...prev,
        points: [...prev.points, { x: pctX, y: pctY }]
      };
    });
  };

  const handleCanvasStopDrawing = () => {
    if (!currentStroke) return;
    if (currentStroke.points.length > 1) {
      onUpdateDrawings([...drawings, currentStroke]);
    }
    setCurrentStroke(null);
  };

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

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto p-4 bg-white/50 backdrop-blur-xs border-2 border-neutral-900 rounded-none shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
      {/* Canvas Header */}
      <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <span className="font-riso-mono text-xs font-bold text-neutral-500 uppercase">
            Lienzo
          </span>
          <span className="font-riso-sans font-black text-sm bg-neutral-900 text-white px-2 py-0.5 tracking-tight uppercase">
            Pág. {pageNumber}: {pageName}
          </span>
        </div>
        <div className="font-riso-mono text-[9px] text-neutral-600 bg-neutral-100 px-2 py-0.5 uppercase border border-neutral-200">
          {isDrawingMode ? 'MODO CRAYÓN' : 'EDICIÓN COLAGE'}
        </div>
      </div>

      {/* Main Canvas Container */}
      <div 
        id="active-page-canvas"
        className={`relative w-full ${aspectClass} border-2 border-neutral-950 shadow-lg overflow-hidden select-none transition-all duration-300`}
        ref={canvasRef}
        style={{ backgroundColor: paperColor.hex }}
        onMouseDown={(e) => {
          if (isDrawingMode) {
            handleCanvasStartDrawing(e.clientX, e.clientY);
          } else if (e.target === canvasRef.current) {
            onSelectElement(null);
          }
        }}
        onMouseMove={(e) => {
          if (isDrawingMode) {
            handleCanvasDragDrawing(e.clientX, e.clientY);
          }
        }}
        onMouseUp={isDrawingMode ? handleCanvasStopDrawing : undefined}
        onMouseLeave={isDrawingMode ? handleCanvasStopDrawing : undefined}
        onTouchStart={(e) => {
          if (isDrawingMode) {
            const touch = e.touches[0];
            handleCanvasStartDrawing(touch.clientX, touch.clientY);
          }
        }}
        onTouchMove={(e) => {
          if (isDrawingMode) {
            const touch = e.touches[0];
            handleCanvasDragDrawing(touch.clientX, touch.clientY);
          }
        }}
        onTouchEnd={isDrawingMode ? handleCanvasStopDrawing : undefined}
      >
        {/* Dynamic Texture Overlay */}
        {activeTexture !== 'none' && (
          <div 
            className="riso-grain-overlay pointer-events-none" 
            style={{ 
              backgroundImage: 
                activeTexture === 'halftone'
                  ? `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='rgba(0,0,0,0.5)'/%3E%3C/svg%3E")`
                  : activeTexture === 'fiber'
                    ? `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='fiberFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='4' result='noise'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23fiberFilter)'/%3E%3C/svg%3E")`
                    : `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              opacity: activeTexture === 'halftone' ? 0.22 : 0.35
            }} 
          />
        )}

        {/* Dynamic Green Cutting Mat / Grid Helper */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none z-10 opacity-30 border border-green-800">
            <div 
              className="absolute inset-0" 
              style={{ 
                backgroundImage: `
                  linear-gradient(to right, rgba(16, 120, 80, 0.4) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(16, 120, 80, 0.4) 1px, transparent 1px)
                `,
                backgroundSize: '25px 25px'
              }} 
            />
            <div 
              className="absolute inset-0" 
              style={{ 
                backgroundImage: `
                  linear-gradient(to right, rgba(16, 120, 80, 0.7) 2px, transparent 2px),
                  linear-gradient(to bottom, rgba(16, 120, 80, 0.7) 2px, transparent 2px)
                `,
                backgroundSize: '100px 100px'
              }} 
            />
            {/* Horizontal & Vertical Grid Line Indicators */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-green-900/10 border-b border-green-800 flex justify-between px-2 text-[7px] font-mono text-green-900">
              <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
            </div>
            <div className="absolute top-0 left-0 bottom-0 w-4 bg-green-900/10 border-r border-green-800 flex flex-col justify-between py-2 text-[7px] font-mono text-green-900">
              <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
            </div>
          </div>
        )}

        {/* Folding Line Guide Helper for reference (soft, hidden during print) */}
        {!showGrid && (
          <div className="absolute inset-0 pointer-events-none border border-neutral-400/20 z-0">
            <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-neutral-400/10" />
            <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-neutral-400/10" />
          </div>
        )}

        {/* Empty Canvas Placeholder */}
        {elements.length === 0 && drawings.length === 0 && !currentStroke && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center pointer-events-none z-10 opacity-30">
            <PenTool className="w-10 h-10 text-neutral-400 mb-2 stroke-1" />
            <p className="font-riso-serif text-sm italic text-neutral-600">
              Lienzo en blanco
            </p>
            <p className="font-riso-mono text-[9px] text-neutral-500 mt-1 uppercase max-w-xs">
              Escribe textos, estampa stickers recortados o activa el crayón para pintar libremente.
            </p>
          </div>
        )}

        {/* VECTOR DRAWINGS CRAYON LAYER */}
        <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none z-20 w-full h-full">
          <defs>
            {/* Displacement filter creates natural hand-drawn crayony wobble */}
            <filter id="crayon-rough-filter" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="4" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          {/* Completed strokes */}
          {drawings.map((stroke) => (
            <path
              key={stroke.id}
              d={stroke.points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
              stroke={stroke.color}
              strokeWidth={stroke.brushWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#crayon-rough-filter)"
              className="opacity-85"
            />
          ))}
          {/* Active drawing stroke */}
          {currentStroke && (
            <path
              d={currentStroke.points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
              stroke={currentStroke.color}
              strokeWidth={currentStroke.brushWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#crayon-rough-filter)"
              className="opacity-85"
            />
          )}
        </svg>

        {/* Render Canvas Elements */}
        {elements
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((element) => {
            const isSelected = selectedElementId === element.id;
            
            return (
              <div
                key={element.id}
                id={`element-${element.id}`}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                  isDrawingMode ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'
                } ${isSelected ? 'z-50' : 'hover:ring-1 hover:ring-dashed hover:ring-neutral-400 hover:ring-offset-2'}`}
                style={{
                  left: `${element.x}%`,
                  top: `${element.y}%`,
                  zIndex: element.zIndex,
                  transform: `translate(-50%, -50%) rotate(${element.rotation}deg) scale(${element.flipX ? -element.scale : element.scale}, ${element.flipY ? -element.scale : element.scale})`,
                }}
                onMouseDown={(e) => handleMouseDown(e, element.id)}
                onTouchStart={(e) => handleTouchStart(e, element.id)}
                onWheel={(e) => handleWheel(e, element.id)}
              >
                {/* Element Content */}
                <div className="relative group/el">
                  
                  {/* Visual Selection Boundary & Smooth Handles */}
                  {isSelected && !isDrawingMode && (
                    <>
                      {/* Dashed outer boundary */}
                      <div 
                        className="absolute -inset-2 border-2 border-dashed pointer-events-none z-10"
                        style={{ borderColor: element.color }}
                      />
                      
                      {/* Top Circular ROTATE Handle */}
                      <div
                        className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-neutral-900 rounded-full cursor-alias flex items-center justify-center shadow-md no-drag control-btn z-40"
                        onMouseDown={(e) => handleRotateStart(e, element)}
                        onTouchStart={(e) => handleRotateStart(e, element)}
                        title="Arrastra para rotar libremente"
                      >
                        <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                      </div>

                      {/* Bottom Right SQUARE SCALE Handle */}
                      <div
                        className="absolute -bottom-3 -right-3 w-4 h-4 bg-white border-2 border-neutral-900 rounded-none cursor-se-resize flex items-center justify-center shadow-md no-drag control-btn z-40"
                        onMouseDown={(e) => handleScaleStart(e, element)}
                        onTouchStart={(e) => handleScaleStart(e, element)}
                        title="Arrastra para escalar"
                      >
                        <div className="w-1.5 h-1.5 bg-neutral-900" />
                      </div>
                    </>
                  )}

                  {/* 1. Text Element */}
                  {element.type === 'text' && (
                    <div
                      className={`${
                        editingTextId === element.id ? 'no-drag border-b-2 border-dashed border-neutral-800 bg-white/20' : ''
                      } px-2.5 py-1 leading-none select-text outline-none whitespace-pre-wrap transition-all min-w-[50px] text-center ${getFontFamilyClass(element.font)}`}
                      style={{ 
                        color: element.color,
                        fontSize: '24px',
                        lineHeight: '1.1'
                      }}
                      contentEditable={editingTextId === element.id}
                      suppressContentEditableWarning
                      onDoubleClick={() => {
                        if (!isDrawingMode) {
                          setEditingTextId(element.id);
                        }
                      }}
                      onBlur={(e) => {
                        onUpdateElement(element.id, { content: e.currentTarget.innerText });
                        setEditingTextId(null);
                      }}
                      data-placeholder="Escribe..."
                    >
                      {element.content}
                    </div>
                  )}

                  {/* 2. Sticker Element */}
                  {element.type === 'sticker' && element.stickerId && (
                    <div className="w-24 h-24 flex items-center justify-center p-1">
                      <StickerSvg stickerId={element.stickerId} color={element.color} />
                    </div>
                  )}

                  {/* 3. Image Element (Halftone Riso Effect) */}
                  {element.type === 'image' && element.imageSrc && (
                    <div 
                      className="w-28 h-28 border border-neutral-950 overflow-hidden relative shadow-sm"
                      style={{ backgroundColor: element.color }}
                    >
                      <img
                        src={element.imageSrc}
                        className="w-full h-full object-cover mix-blend-multiply filter grayscale contrast-200 brightness-110"
                        alt="Riso Ink Plate"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Floating Action Overlay (Only when selected, NOT editing text and NOT drawing) */}
                  {isSelected && editingTextId !== element.id && !isDrawingMode && (
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex items-center bg-neutral-950 text-white border-2 border-neutral-950 shadow-lg p-1 gap-1 z-50 no-drag">
                      <button
                        onClick={() => {
                          const newRotation = (element.rotation + 15) % 360;
                          onUpdateElement(element.id, { rotation: newRotation });
                        }}
                        className="control-btn p-1.5 hover:bg-neutral-800 cursor-pointer text-white"
                        title="Rotar 15º"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          const newScale = Math.max(0.2, Math.min(4.0, parseFloat((element.scale + 0.15).toFixed(2))));
                          onUpdateElement(element.id, { scale: newScale });
                        }}
                        className="control-btn p-1.5 hover:bg-neutral-800 cursor-pointer text-white"
                        title="Agrandar"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          const newScale = Math.max(0.2, Math.min(4.0, parseFloat((element.scale - 0.15).toFixed(2))));
                          onUpdateElement(element.id, { scale: newScale });
                        }}
                        className="control-btn p-1.5 hover:bg-neutral-800 cursor-pointer text-white"
                        title="Achicar"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          const newZIndex = element.zIndex >= 50 ? 1 : element.zIndex + 5;
                          onUpdateElement(element.id, { zIndex: newZIndex });
                        }}
                        className="control-btn p-1.5 hover:bg-neutral-800 cursor-pointer text-white"
                        title="Mover de capa"
                      >
                        <Layers className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteElement(element.id)}
                        className="control-btn p-1.5 bg-red-600 hover:bg-red-700 cursor-pointer text-white border-l border-neutral-800"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
      </div>

      {/* Helper Legend */}
      <div className="mt-3 text-center">
        <p className="font-riso-mono text-[9px] text-neutral-500 uppercase tracking-wide">
          {isDrawingMode 
            ? 'Arrastra en el lienzo para pintar con crayón • Desactiva pintar para mover colages' 
            : 'Arrastra para mover • Arrastra nodos o usa scroll para girar/escalar • Doble clic en texto'}
        </p>
      </div>
    </div>
  );
};
