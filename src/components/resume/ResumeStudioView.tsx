import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { ResumeFormEditor } from './ResumeFormEditor';
import { ResumeStylingPanel } from './ResumeStylingPanel';
import { ResumeTemplateSelector } from './ResumeTemplateSelector';
import { ResumeLivePreview } from './ResumeLivePreview';
import { ResumeExportModal } from './ResumeExportModal';
import {
  ArrowLeft,
  FileText,
  Palette,
  Layout,
  Download,
  Eye,
  Sparkles,
  RotateCcw,
  Check,
  Target,
} from 'lucide-react';
import { AISettingsModal } from './ai/AISettingsModal';
import { AIJobMatcherModal } from './ai/AIJobMatcherModal';
import { isAIConfigured } from '../../services/aiService';

export const ResumeStudioView: React.FC = () => {
  const {
    document,
    activeTab,
    setActiveTab,
    setViewMode,
    setExportModalOpen,
    updateTitle,
    resetToSample,
  } = useResume();

  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(document.title);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
  const [isJobMatcherOpen, setIsJobMatcherOpen] = useState(false);
  const [hasAI, setHasAI] = useState(isAIConfigured());

  const tabs = [
    { id: 'content' as const, label: 'Content & History', icon: <FileText className="w-4 h-4" /> },
    { id: 'design' as const, label: 'Styling & ATS', icon: <Palette className="w-4 h-4" /> },
    { id: 'templates' as const, label: 'Templates', icon: <Layout className="w-4 h-4" /> },
  ];

  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      updateTitle(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col h-screen overflow-hidden">
      {/* Studio Header Bar */}
      <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setViewMode('dashboard')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
            title="Back to Resumes Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            {isEditingTitle ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                  autoFocus
                  className="px-2 py-0.5 text-sm font-bold text-slate-900 border border-teal-500 rounded focus:outline-none"
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-1 text-teal-600 hover:bg-teal-50 rounded"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <h1
                onClick={() => {
                  setTempTitle(document.title);
                  setIsEditingTitle(true);
                }}
                className="text-sm sm:text-base font-bold text-slate-900 truncate cursor-pointer hover:text-teal-700 transition"
                title="Click to rename"
              >
                {document.title || 'Untitled Resume'}
              </h1>
            )}
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="capitalize font-medium text-teal-700">
                {document.styling.templateId.replace('-', ' ')}
              </span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">Auto-saved</span>
            </div>
          </div>
        </div>

        {/* Center Tabs (Desktop) */}
        <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile view toggle */}
          <div className="flex md:hidden bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setMobileTab('editor')}
              className={`px-2.5 py-1 text-xs font-semibold rounded ${
                mobileTab === 'editor' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-600'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setMobileTab('preview')}
              className={`px-2.5 py-1 text-xs font-semibold rounded ${
                mobileTab === 'preview' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-600'
              }`}
            >
              Preview
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsJobMatcherOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl transition shadow-2xs"
            title="ATS Job Description Matcher"
          >
            <Target className="w-3.5 h-3.5 text-teal-700" />
            <span>ATS Matcher</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAISettingsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl transition shadow-2xs"
            title="Nara Router AI Assistant & Settings"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">AI Assistant</span>
            <span
              className={`w-2 h-2 rounded-full ${
                hasAI ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
              title={hasAI ? 'Nara AI Connected' : 'Nara AI Unconfigured'}
            />
          </button>

          <button
            type="button"
            onClick={resetToSample}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            title="Load standard sample data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Load Sample</span>
          </button>

          <button
            type="button"
            onClick={() => setExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 transition shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export Resume</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body (Split Screen) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Editor Panel */}
        <aside
          className={`w-full md:w-[480px] lg:w-[540px] xl:w-[580px] bg-slate-50 border-r border-slate-200/80 flex flex-col shrink-0 overflow-hidden ${
            mobileTab === 'preview' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Mobile tab bar */}
          <div className="flex md:hidden border-b border-slate-200 bg-white p-2 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 ${
                  activeTab === tab.id ? 'bg-teal-50 text-teal-700' : 'text-slate-600'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {activeTab === 'content' && <ResumeFormEditor />}
            {activeTab === 'design' && <ResumeStylingPanel />}
            {activeTab === 'templates' && <ResumeTemplateSelector />}
          </div>
        </aside>

        {/* Right Live Preview Panel */}
        <main
          className={`flex-1 flex flex-col overflow-hidden ${
            mobileTab === 'editor' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <ResumeLivePreview />
        </main>
      </div>

      {/* Export Modal */}
      <ResumeExportModal />

      {/* AI Modals */}
      <AISettingsModal
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
        onConfigured={() => setHasAI(isAIConfigured())}
      />

      <AIJobMatcherModal
        isOpen={isJobMatcherOpen}
        onClose={() => setIsJobMatcherOpen(false)}
        onOpenSettings={() => setIsAISettingsOpen(true)}
      />
    </div>
  );
};
