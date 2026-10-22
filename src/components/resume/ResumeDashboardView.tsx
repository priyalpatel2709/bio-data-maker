import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { useAppMode } from '../../context/AppModeContext';
import { RESUME_TEMPLATES } from '../../data/defaultResume';
import { ResumeDocument, ResumeTemplateId, ResumeTemplateDefinition } from '../../types/resume';
import { ResumeTemplateThumbnail } from './ResumeTemplateThumbnail';
import { ResumeTemplatePreviewModal } from './ResumeTemplatePreviewModal';
import {
  Plus,
  Edit3,
  Copy,
  Trash2,
  FileText,
  Sparkles,
  ShieldCheck,
  Check,
  Calendar,
  Layers,
  ArrowRight,
  Briefcase,
  ExternalLink,
  Heart,
  Eye,
} from 'lucide-react';

export const ResumeDashboardView: React.FC = () => {
  const { setAppMode } = useAppMode();
  const {
    savedResumes,
    createNewResume,
    loadResume,
    duplicateResume,
    removeResume,
    setTemplate,
    setViewMode,
  } = useResume();

  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplateDefinition | null>(null);

  const handleStartWithTemplate = (templateId: ResumeTemplateId) => {
    createNewResume('software');
    setTemplate(templateId);
    setViewMode('studio');
  };

  const handleEditResume = (doc: ResumeDocument) => {
    loadResume(doc);
    setViewMode('studio');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-white via-white to-slate-50 border-b border-slate-200/80 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                ATS-Optimized Resume Engine
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Craft Modern, Job-Winning <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-sky-600 to-indigo-700">
                  Professional Resumes
                </span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                Build ATS-friendly, recruiter-approved resumes in minutes. Export to high-definition PDF, editable Microsoft Word (.docx), or copy formatted plain text directly for application forms.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={() => createNewResume('software')}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-lg shadow-teal-600/20 transition active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Create New Resume
              </button>
              <button
                onClick={() => setViewMode('studio')}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm transition"
              >
                <Edit3 className="w-5 h-5" />
                Open Studio
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Switch to Biodata Maker Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-amber-950 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-300 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded-full">
                  Matrimonial & Personal
                </span>
                <h3 className="text-base font-bold text-white">Looking for Marriage & Matrimonial Biodata?</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Design traditional Indian, floral, mandala, and executive matrimonial biodatas with multi-language support.
              </p>
            </div>
          </div>
          <button
            onClick={() => setAppMode('biodata')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center justify-center gap-2 transition shrink-0 shadow-lg shadow-rose-500/20 active:scale-95"
          >
            <span>Open Biodata Maker</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* Saved Resumes Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Resumes ({savedResumes.length})</h2>
              <p className="text-xs text-slate-500">Auto-saved locally on your device with complete privacy</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => createNewResume('blank')}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Blank Resume
              </button>
            </div>
          </div>

          {savedResumes.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300">
              <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No saved resumes yet</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">Start by creating a new resume with one click.</p>
              <button
                onClick={() => createNewResume('software')}
                className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg"
              >
                Create Software Resume
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedResumes.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: doc.styling.primaryColor }}
                        />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          {doc.styling.templateId.replace('-', ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition">
                      {doc.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-600 mt-0.5">
                      {doc.contact.fullName || 'Untitled'} {doc.contact.jobTitle ? `• ${doc.contact.jobTitle}` : ''}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {doc.experience.length} Positions
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {doc.education.length} Degrees
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {doc.skillCategories.reduce((acc, c) => acc + c.skills.length, 0)} Skills
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleEditResume(doc)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit in Studio
                    </button>
                    <button
                      onClick={() => duplicateResume(doc)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                      title="Duplicate Resume"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeResume(doc.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Templates Showcase */}
        <section id="templates">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Explore Resume Templates</h2>
            <p className="text-xs text-slate-500">Engineered to pass Applicant Tracking Systems (ATS) with flying colors</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESUME_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col group"
              >
                {/* Card Visual Preview Header: Real Actual Resume Template */}
                <div
                  className="relative h-64 overflow-hidden border-b border-slate-200 bg-slate-100 cursor-pointer group/thumb"
                  onClick={() => setPreviewTemplate(tpl)}
                >
                  <ResumeTemplateThumbnail
                    templateId={tpl.id}
                    scale={0.34}
                    height={260}
                    className="group-hover/thumb:scale-105 transition-transform duration-300"
                  />

                  {/* Hover Overlay with Inspect / Preview Button */}
                  <div className="absolute inset-0 bg-slate-900/35 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
                    <span className="px-3.5 py-1.5 rounded-full bg-white text-slate-900 font-bold text-xs shadow-lg flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-teal-600" />
                      Inspect Template
                    </span>
                  </div>

                  {tpl.badge && (
                    <span
                      className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-sm z-10"
                      style={{ backgroundColor: tpl.previewColor }}
                    >
                      {tpl.badge}
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: tpl.previewColor }}
                      />
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-700 transition">
                        {tpl.name}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {tpl.description}
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Best for: </span>
                      <span className="text-slate-600">{tpl.bestFor}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(tpl)}
                      className="py-2 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartWithTemplate(tpl.id)}
                      className="flex-1 py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-95"
                    >
                      <span>Use This Template</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Template Full Inspection Modal */}
      <ResumeTemplatePreviewModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onSelect={(templateId) => {
          handleStartWithTemplate(templateId);
          setPreviewTemplate(null);
        }}
      />
    </div>
  );
};
