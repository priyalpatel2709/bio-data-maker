import React from 'react';
import { ResumeTemplateId, ResumeDocument } from '../../types/resume';
import { defaultResume, RESUME_TEMPLATES } from '../../data/defaultResume';
import { ResumeTemplateRenderer } from './ResumeTemplateRenderer';

interface ResumeTemplateThumbnailProps {
  templateId: ResumeTemplateId;
  scale?: number;
  height?: number | string;
  className?: string;
  docOverride?: ResumeDocument;
}

export const ResumeTemplateThumbnail: React.FC<ResumeTemplateThumbnailProps> = ({
  templateId,
  scale = 0.34,
  height = 260,
  className = '',
  docOverride,
}) => {
  const tplDef = RESUME_TEMPLATES.find((t) => t.id === templateId);

  // Prepare a document instance using this template's styling
  const baseDoc = docOverride || defaultResume;
  const doc: ResumeDocument = {
    ...baseDoc,
    styling: {
      ...baseDoc.styling,
      ...(tplDef?.defaultStyling || {}),
      templateId,
      pageSplitAt: 'single-page',
    },
  };

  return (
    <div
      className={`relative w-full overflow-hidden flex justify-center bg-slate-100/70 select-none pointer-events-none ${className}`}
      style={{ height }}
    >
      <div
        className="shrink-0 origin-top shadow-md"
        style={{
          width: '794px', // A4 pixel width
          minHeight: '1123px', // A4 pixel height
          transform: `scale(${scale})`,
          backgroundColor: '#FFFFFF',
        }}
      >
        <ResumeTemplateRenderer resume={doc} />
      </div>
    </div>
  );
};
