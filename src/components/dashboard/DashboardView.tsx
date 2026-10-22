import React, { useState } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { useAppMode } from '../../context/AppModeContext';
import { TEMPLATES } from '../../data/templateCatalog';
import { TemplateId, TemplateDefinition } from '../../types/biodata';
import { Button } from '../common/Button';
import { TemplateThumbnail } from '../preview/TemplateThumbnail';
import { TemplatePreviewModal } from '../preview/TemplatePreviewModal';
import {
  Plus,
  FileText,
  Copy,
  Trash2,
  Edit3,
  Calendar,
  Sparkles,
  Layout,
  Crown,
  Heart,
  Briefcase,
  Layers,
  ArrowRight,
  Eye,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    savedDocs,
    createNewDocument,
    loadDocument,
    duplicateDocument,
    removeDocument,
    setTemplate,
    setViewMode,
  } = useBiodata();
  const { setAppMode } = useAppMode();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<TemplateDefinition | null>(null);

  const categories = [
    { id: 'all', label: 'All Templates', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'traditional', label: 'Traditional & Matrimonial', icon: <Crown className="w-3.5 h-3.5" /> },
    { id: 'modern', label: 'Modern & Minimal', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'executive', label: 'Professional & Career', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'creative', label: 'Photo Centric', icon: <Heart className="w-3.5 h-3.5" /> },
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleStartWithTemplate = (templateId: TemplateId) => {
    createNewDocument();
    setTemplate(templateId);
    setViewMode('studio');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-white via-white to-slate-50 border-b border-slate-200/80 pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/60 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Next-Gen Biodata Builder
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Craft Elegant, Dignified <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-700 via-amber-600 to-rose-600">
                  Biodata Documents
                </span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                Design stunning personal and matrimonial biodatas in minutes. Choose from handcrafted templates, customize layouts with drag-and-drop, and export high-resolution PDFs or editable Word files.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button
                size="lg"
                variant="primary"
                icon={<Plus className="w-5 h-5" />}
                onClick={createNewDocument}
                className="shadow-lg shadow-rose-600/20"
              >
                Create New Biodata
              </Button>
              <Button
                size="lg"
                variant="outline"
                icon={<Edit3 className="w-5 h-5" />}
                onClick={() => setViewMode('studio')}
              >
                Open Studio
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Builder Spotlight Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/30 text-teal-300 flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/60 border border-teal-500/30 px-2 py-0.5 rounded-full">
                  New Feature
                </span>
                <h3 className="text-base font-bold text-white">Need an ATS-Ready Career Resume?</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Build professional tech, executive & corporate resumes with instant PDF, Word (.docx) & plain-text exports.
              </p>
            </div>
          </div>
          <button
            onClick={() => setAppMode('resume')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shrink-0 shadow-lg shadow-teal-400/20 active:scale-95"
          >
            <span>Open Resume Builder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-14">
        {/* Saved Drafts Section */}
        {savedDocs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-rose-600" />
                  Your Saved Documents
                </h2>
                <p className="text-xs text-slate-500">Drafts stored securely in your browser</p>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-200/70 px-2.5 py-1 rounded-full">
                {savedDocs.length} {savedDocs.length === 1 ? 'Document' : 'Documents'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedDocs.map((doc) => {
                const updatedDate = new Date(doc.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <div
                    key={doc.id}
                    className="group relative bg-white border border-slate-200/90 hover:border-rose-400 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => duplicateDocument(doc)}
                            title="Duplicate"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          {savedDocs.length > 1 && (
                            <button
                              onClick={() => removeDocument(doc.id)}
                              title="Delete"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                        {doc.title || 'Untitled Biodata'}
                      </h3>
                      
                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {updatedDate}
                        </span>
                        <span>•</span>
                        <span className="capitalize font-medium text-slate-600">
                          {doc.styling.templateId.replace('-', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => loadDocument(doc)}
                        className="w-full"
                        icon={<ArrowRight className="w-4 h-4" />}
                      >
                        Edit in Studio
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Template Showcase Section */}
        <section id="templates">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
                <Layout className="w-3.5 h-3.5" />
                Designer Library
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Choose a Professionally Designed Template
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Every template is genuinely distinct, fully responsive, and adapts seamlessly to your data.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              return (
                <div
                  key={template.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col group"
                >
                  {/* Card Visual Preview Header: Real Actual Template */}
                  <div 
                    className="relative h-64 overflow-hidden border-b border-slate-200 bg-slate-100 cursor-pointer group/thumb"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    <TemplateThumbnail
                      templateId={template.id}
                      scale={0.34}
                      height={260}
                      className="group-hover/thumb:scale-105 transition-transform duration-300"
                    />

                    {/* Hover Overlay with Preview Button */}
                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
                      <span className="px-3.5 py-1.5 rounded-full bg-white text-slate-900 font-bold text-xs shadow-lg flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-rose-600" />
                        Inspect Template
                      </span>
                    </div>

                    <span 
                      className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-sm z-10"
                      style={{ backgroundColor: template.previewColor }}
                    >
                      {template.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                          {template.name}
                        </h3>
                      </div>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                        {template.description}
                      </p>
                      
                      <div className="mt-3 bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-[11px] text-slate-600">
                        <strong className="text-slate-800">Ideal for:</strong> {template.bestFor}
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewTemplate(template)}
                        icon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleStartWithTemplate(template.id)}
                        className="flex-1"
                        icon={<Sparkles className="w-3.5 h-3.5" />}
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* High-Resolution Template Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onSelect={handleStartWithTemplate}
      />
    </div>
  );
};
