import React from 'react';
import { StylingConfig } from '../../types/biodata';
import { User } from 'lucide-react';

interface DocumentPhotoProps {
  photoUrl?: string;
  styling: StylingConfig;
  className?: string;
}

export const DocumentPhoto: React.FC<DocumentPhotoProps> = ({
  photoUrl,
  styling,
  className = '',
}) => {
  if (!styling.showPhoto) return null;

  const defaultSizeMap: Record<'small' | 'medium' | 'large', { width: number; height: number }> = {
    small: { width: 100, height: 130 },
    medium: { width: 130, height: 170 },
    large: { width: 160, height: 210 },
  };

  const base = defaultSizeMap[styling.photoSize || 'medium'] || defaultSizeMap.medium;
  const width = styling.photoWidth && styling.photoWidth > 0 ? styling.photoWidth : base.width;
  const height = styling.photoShape === 'circle'
    ? width
    : (styling.photoHeight && styling.photoHeight > 0 ? styling.photoHeight : base.height);

  const shapeStyles = {
    circle: 'rounded-full',
    rounded: 'rounded-2xl',
    square: 'rounded-none',
    oval: 'rounded-[50%]',
  };

  return (
    <div
      className={`overflow-hidden shrink-0 flex items-center justify-center relative bg-slate-100 ${shapeStyles[styling.photoShape]} ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        minWidth: `${width}px`,
        minHeight: `${height}px`,
        maxWidth: `${width}px`,
        maxHeight: `${height}px`,
        border: styling.photoBorder ? `3px solid ${styling.accentColor}` : '1px solid #e2e8f0',
        boxShadow: styling.photoBorder ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt="Profile"
          crossOrigin="anonymous"
          className="w-full h-full object-cover object-center pointer-events-none select-none"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center select-none">
          <User className="w-8 h-8 opacity-40 mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Photo</span>
        </div>
      )}
    </div>
  );
};
