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

  const shapeStyles = {
    circle: 'rounded-full aspect-square',
    rounded: 'rounded-2xl aspect-[3/4]',
    square: 'rounded-none aspect-[3/4]',
    oval: 'rounded-[50%] aspect-[3/4]',
  };

  const sizeStyles = {
    small: 'w-24 h-32',
    medium: 'w-32 h-40',
    large: 'w-36 h-48',
  };

  return (
    <div
      className={`overflow-hidden shrink-0 flex items-center justify-center relative bg-slate-100 ${shapeStyles[styling.photoShape]} ${sizeStyles[styling.photoSize]} ${className}`}
      style={{
        border: styling.photoBorder ? `3px solid ${styling.accentColor}` : '1px solid #e2e8f0',
        boxShadow: styling.photoBorder ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt="Profile"
          crossOrigin="anonymous"
          className="w-full h-full object-cover object-center"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-400 p-2 text-center">
          <User className="w-8 h-8 opacity-40 mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Photo</span>
        </div>
      )}
    </div>
  );
};
