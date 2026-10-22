import React from 'react';
import { ResumeDocument } from '../../types/resume';
import { ModernTechTemplate } from './templates/ModernTechTemplate';
import { ExecutiveCorporateTemplate } from './templates/ExecutiveCorporateTemplate';
import { MinimalistAtsTemplate } from './templates/MinimalistAtsTemplate';
import { CreativeTwoColumnTemplate } from './templates/CreativeTwoColumnTemplate';
import { CompactEngineeringTemplate } from './templates/CompactEngineeringTemplate';
import { ElegantAcademicTemplate } from './templates/ElegantAcademicTemplate';
import { MonochromeClassicTemplate } from './templates/MonochromeClassicTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { StockholmTemplate } from './templates/StockholmTemplate';
import { SydneyTemplate } from './templates/SydneyTemplate';
import { DublinTemplate } from './templates/DublinTemplate';
import { ViennaTemplate } from './templates/ViennaTemplate';

interface ResumeTemplateRendererProps {
  resume: ResumeDocument;
}

export const ResumeTemplateRenderer: React.FC<ResumeTemplateRendererProps> = ({ resume }) => {
  const templateId = resume.styling.templateId || 'modern-tech';

  switch (templateId) {
    case 'modern-tech':
      return <ModernTechTemplate resume={resume} />;
    case 'executive-corporate':
      return <ExecutiveCorporateTemplate resume={resume} />;
    case 'minimalist-ats':
      return <MinimalistAtsTemplate resume={resume} />;
    case 'creative-split':
      return <CreativeTwoColumnTemplate resume={resume} />;
    case 'compact-engineering':
      return <CompactEngineeringTemplate resume={resume} />;
    case 'elegant-academic':
      return <ElegantAcademicTemplate resume={resume} />;
    case 'monochrome-classic':
      return <MonochromeClassicTemplate resume={resume} />;
    case 'classic':
      return <ClassicTemplate resume={resume} />;
    case 'stockholm':
      return <StockholmTemplate resume={resume} />;
    case 'sydney':
      return <SydneyTemplate resume={resume} />;
    case 'dublin':
      return <DublinTemplate resume={resume} />;
    case 'vienna':
      return <ViennaTemplate resume={resume} />;
    default:
      return <ModernTechTemplate resume={resume} />;
  }
};
