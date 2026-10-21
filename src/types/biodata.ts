export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'boolean';

export interface CustomField {
  id: string;
  label: string;
  value: string;
  type: FieldType;
  options?: string[]; // for select dropdowns
  visible: boolean;
  required?: boolean;
  placeholder?: string;
}

export interface BiodataSection {
  id: string;
  key: string;
  title: string;
  isCustom: boolean;
  visible: boolean;
  description?: string;
  fields: CustomField[];
}

export type TemplateId = 
  | 'mandala-radiance'
  | 'marigold-toran'
  | 'vintage-parchment'
  | 'instant-royal-maroon'
  | 'instant-peacock-navy'
  | 'instant-floral-blush'
  | 'classic-traditional'
  | 'simple-box'
  | 'floral-border'
  | 'modern-minimal'
  | 'elegant-premium'
  | 'family-focused'
  | 'professional'
  | 'photo-focused';

export type FontOption = 'Inter' | 'Playfair Display' | 'Merriweather' | 'Montserrat' | 'Cinzel' | 'Cormorant Garamond';
export type SpacingOption = 'compact' | 'normal' | 'relaxed';
export type BorderStyle = 'none' | 'simple' | 'double' | 'ornate' | 'decorative';
export type PhotoShape = 'circle' | 'rounded' | 'square' | 'oval';
export type PhotoPosition = 'top-left' | 'top-center' | 'top-right' | 'sidebar';
export type HeaderSymbol = 'ganesha' | 'om' | 'swastik' | 'ek-onkar' | 'bismillah' | 'cross' | 'lotus' | 'none';

export interface StylingConfig {
  templateId: TemplateId;
  headerSymbol?: HeaderSymbol;
  primaryColor: string;       // Hex color for headings, accents
  accentColor: string;        // Secondary color for badges, borders
  backgroundColor: string;    // Document canvas background (e.g. #FFFFFF or soft ivory)
  textColor: string;          // Primary text color (#1E293B)
  subtextColor: string;       // Muted field label color (#64748B)
  backgroundImageUrl?: string;// Optional user uploaded background
  backgroundPattern: 'none' | 'floral' | 'damask' | 'mandala' | 'subtle-grid' | 'parchment';
  backgroundOpacity: number;  // 0.05 to 1.0
  fontFamilyHeading: FontOption;
  fontFamilyBody: FontOption;
  fontSize: 'compact' | 'normal' | 'relaxed';
  spacing: SpacingOption;
  columns: 1 | 2;
  borderStyle: BorderStyle;
  photoShape: PhotoShape;
  photoPosition: PhotoPosition;
  photoBorder: boolean;
  photoSize: 'small' | 'medium' | 'large';
  showPhoto: boolean;
  showWatermark: boolean;
  paperSize: 'a4' | 'letter';
}

export interface AttachedImage {
  id: string;
  url: string;
  caption: string;
  filename?: string;
  sizeBytes?: number;
}

export interface BiodataDocument {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  photoUrl?: string;
  attachedImages?: AttachedImage[];
  sections: BiodataSection[];
  styling: StylingConfig;
}

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  category: 'traditional' | 'modern' | 'executive' | 'creative';
  description: string;
  bestFor: string;
  previewColor: string;
  defaultStyling: Partial<StylingConfig>;
  thumbnailSvg?: string;
}
