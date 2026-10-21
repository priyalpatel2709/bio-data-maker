import React from 'react';
import { TemplateId, BiodataDocument } from '../../types/biodata';
import { defaultBiodata } from '../../data/defaultBiodata';
import { TEMPLATES } from '../../data/templateCatalog';
import { PATTERNS } from '../../assets/patterns';
import { MandalaRadiance } from './templates/MandalaRadiance';
import { MarigoldToran } from './templates/MarigoldToran';
import { VintageParchment } from './templates/VintageParchment';
import { InstantRoyalMaroon } from './templates/InstantRoyalMaroon';
import { InstantPeacockNavy } from './templates/InstantPeacockNavy';
import { InstantFloralBlush } from './templates/InstantFloralBlush';
import { SimpleBox } from './templates/SimpleBox';
import { FloralBorder } from './templates/FloralBorder';
import { ClassicTraditional } from './templates/ClassicTraditional';
import { ModernMinimal } from './templates/ModernMinimal';
import { ElegantPremium } from './templates/ElegantPremium';
import { FamilyFocused } from './templates/FamilyFocused';
import { Professional } from './templates/Professional';
import { PhotoFocused } from './templates/PhotoFocused';

interface TemplateThumbnailProps {
  templateId: TemplateId;
  scale?: number;
  height?: number | string;
  className?: string;
  docOverride?: BiodataDocument;
}

export const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({
  templateId,
  scale = 0.36,
  height = 260,
  className = '',
  docOverride,
}) => {
  const tplDef = TEMPLATES.find((t) => t.id === templateId);

  // Prepare a dedicated biodata document instance with this template's styling
  const doc: BiodataDocument = docOverride || {
    ...defaultBiodata,
    styling: {
      ...defaultBiodata.styling,
      ...(tplDef?.defaultStyling || {}),
      templateId,
    },
  };

  const renderTemplateComponent = () => {
    switch (templateId) {
      case 'mandala-radiance':
        return <MandalaRadiance document={doc} />;
      case 'marigold-toran':
        return <MarigoldToran document={doc} />;
      case 'vintage-parchment':
        return <VintageParchment document={doc} />;
      case 'instant-royal-maroon':
        return <InstantRoyalMaroon document={doc} />;
      case 'instant-peacock-navy':
        return <InstantPeacockNavy document={doc} />;
      case 'instant-floral-blush':
        return <InstantFloralBlush document={doc} />;
      case 'simple-box':
        return <SimpleBox document={doc} />;
      case 'floral-border':
        return <FloralBorder document={doc} />;
      case 'modern-minimal':
        return <ModernMinimal document={doc} />;
      case 'elegant-premium':
        return <ElegantPremium document={doc} />;
      case 'family-focused':
        return <FamilyFocused document={doc} />;
      case 'professional':
        return <Professional document={doc} />;
      case 'photo-focused':
        return <PhotoFocused document={doc} />;
      case 'classic-traditional':
      default:
        return <ClassicTraditional document={doc} />;
    }
  };

  const patternData = PATTERNS[doc.styling.backgroundPattern] || PATTERNS.none;

  return (
    <div
      className={`relative w-full overflow-hidden flex justify-center bg-slate-100/60 select-none pointer-events-none ${className}`}
      style={{ height }}
    >
      <div
        className="shrink-0 origin-top shadow-lg"
        style={{
          width: '794px', // Standard 210mm in pixels
          minHeight: '1123px', // Standard 297mm in pixels
          transform: `scale(${scale})`,
          backgroundColor: doc.styling.backgroundColor || '#FFFFFF',
        }}
      >
        {/* Background Pattern Layer */}
        {doc.styling.backgroundPattern !== 'none' && (
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: patternData.css,
              opacity: doc.styling.backgroundOpacity,
            }}
          />
        )}

        {/* Actual Live Template Rendered */}
        <div className="relative z-10 w-full h-full">
          {renderTemplateComponent()}
        </div>
      </div>
    </div>
  );
};
