import React from 'react';
import { ResumeTemplateDefinition, ResumeTemplateId } from '../../types/resume';
import { ResumeTemplateThumbnail } from './ResumeTemplateThumbnail';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Sparkles, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';

interface ResumeTemplatePreviewModalProps {
  template: ResumeTemplateDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (templateId: ResumeTemplateId) => void;
}

export const ResumeTemplatePreviewModal: React.FC<ResumeTemplatePreviewModalProps> = ({
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
          <ResumeTemplateThumbnail
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
              {template.badge && (
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white inline-block mb-2 shadow-xs"
                  style={{ backgroundColor: template.previewColor }}
                >
                  {template.badge}
                </span>
              )}
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
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% ATS Parser Safe Format</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Vector PDF & Editable Word (.docx)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant Data Synchronization</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full shadow-md shadow-teal-600/20 bg-teal-600 hover:bg-teal-700 text-white"
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
