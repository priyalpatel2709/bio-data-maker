import React from 'react';
import { TemplateDefinition } from '../../types/biodata';
import { defaultBiodata } from '../../data/defaultBiodata';
import { TemplateThumbnail } from './TemplateThumbnail';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Sparkles, ArrowRight } from 'lucide-react';

interface TemplatePreviewModalProps {
  template: TemplateDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (templateId: TemplateDefinition['id']) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  isOpen,
  onClose,
  onSelect,
}) => {
  if (!template) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={template.name}
      description={template.description}
      maxWidth="4xl"
    >
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Full Miniature A4 Preview */}
        <div className="flex-1 bg-slate-100 rounded-2xl p-4 flex items-center justify-center overflow-hidden border border-slate-200">
          <TemplateThumbnail
            templateId={template.id}
            scale={0.58}
            height={640}
            className="rounded-xl shadow-xl"
          />
        </div>

        {/* Template Details & Actions */}
        <div className="w-full lg:w-72 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white inline-block mb-2"
                style={{ backgroundColor: template.previewColor }}
              >
                {template.category}
              </span>
              <h4 className="text-xl font-extrabold text-slate-900">{template.name}</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {template.description}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700">
              <strong className="block text-slate-900 mb-1">Recommended for:</strong>
              {template.bestFor}
            </div>

            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Standard A4 Print Dimensions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Compatible with PDF & Word (.docx)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>100% Data Preservation</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full shadow-md shadow-rose-600/20"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => {
                onSelect(template.id);
                onClose();
              }}
            >
              Use This Template
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
