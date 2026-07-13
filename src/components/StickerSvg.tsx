import React from 'react';
import { STICKERS } from '../data';

interface StickerSvgProps {
  stickerId: string;
  color: string;
  className?: string;
  style?: React.CSSProperties;
}

export const StickerSvg: React.FC<StickerSvgProps> = ({
  stickerId,
  color,
  className = '',
  style = {}
}) => {
  const sticker = STICKERS.find(s => s.id === stickerId);
  if (!sticker) return null;

  return (
    <svg
      viewBox={sticker.viewBox}
      width="100%"
      height="100%"
      className={`w-full h-full select-none ${className}`}
      style={style}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      {sticker.paths.map((path, idx) => (
        <path key={idx} d={path} fill={color} fillRule="evenodd" clipRule="evenodd" />
      ))}
    </svg>
  );
};
