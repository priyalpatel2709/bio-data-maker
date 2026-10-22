import React, { useState } from 'react';
import { useBiodata } from '../../context/BiodataContext';
import { FormEditor } from './FormEditor';
import { StylingPanel } from './StylingPanel';
import { TemplateSelector } from './TemplateSelector';
import { LivePreview } from '../preview/LivePreview';
import { ExportModal } from '../export/ExportModal';
import { ShareDocumentModal } from '../common/ShareDocumentModal';
import { Button } from '../common/Button';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { UserMenu } from '../auth/UserMenu';
import {
  ArrowLeft,
  FileText,
  Palette,
  Layout,
  Eye,
  Download,
  Share2,
  Sparkles,
  Loader2,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StudioView: React.FC = () => {
  const {
    document,
    activeTab,
    setActiveTab,
    setViewMode,
    setExportModalOpen,
    t,
  } = useBiodata();

  const { user, syncStatus } = useAuth();

  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [isShareOpen, setIsShareOpen] = useState(false);

  const tabs = [
    { id: 'form' as const, label: t('formAndFields'), icon: <FileText className="w-4 h-4" /> },
    { id: 'design' as const, label: t('visualStyler'), icon: <Palette className="w-4 h-4" /> },
    { id: 'templates' as const, label: t('templates'), icon: <Layout className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden">
      {/* Studio Header Bar */}
      <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setViewMode('dashboard')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {document.title || 'Untitled Biodata'}
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="capitalize font-medium text-rose-600">
                {document.styling.templateId.replace('-', ' ')}
              </span>
              <span>•</span>
              {user && syncStatus === 'syncing' ? (
                <span className="text-amber-600 font-semibold flex items-center gap-1 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Saving...
                </span>
              ) : user && syncStatus === 'synced' ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Cloud synced
                </span>
              ) : user && syncStatus === 'error' ? (
                <span className="text-amber-700 font-medium">Saved locally (offline)</span>
              ) : (
                <span className="text-slate-500 font-medium">Auto-saved locally</span>
              )}
            </div>
          </div>
        </div>

        {/* Center Tab Switcher (Desktop) */}
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
          {/* Mobile view switcher */}
          <div className="flex md:hidden bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setMobileTab('editor')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                mobileTab === 'editor' ? 'bg-white text-slate-900 shadow' : 'text-slate-500'
              }`}
            >
              {t('edit')}
            </button>
            <button
              onClick={() => setMobileTab('preview')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                mobileTab === 'preview' ? 'bg-white text-slate-900 shadow' : 'text-slate-500'
              }`}
            >
              {t('preview')}
            </button>
          </div>

          <LanguageSwitcher />

          <UserMenu compact />

          <Button
            size="sm"
            variant="outline"
            icon={<Share2 className="w-4 h-4 text-rose-600" />}
            onClick={() => setIsShareOpen(true)}
            title="Share Read-Only Web Link & QR Code"
          >
            Share
          </Button>

          <Button
            size="sm"
            variant="primary"
            icon={<Download className="w-4 h-4" />}
            onClick={() => setExportModalOpen(true)}
            className="shadow-sm shadow-rose-600/20"
          >
            {t('exportDownload')}
          </Button>
        </div>
      </header>

      {/* Main Studio Body (Split Screen) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Controls Workspace */}
        <div
          className={`w-full md:w-[48%] lg:w-[42%] bg-slate-50/70 border-r border-slate-200/80 flex flex-col overflow-y-auto p-4 sm:p-6 ${
            mobileTab === 'preview' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Mobile tab bar */}
          <div className="flex md:hidden items-center bg-slate-200/70 p-1 rounded-xl mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg text-center ${
                  activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'form' && <FormEditor />}
          {activeTab === 'design' && <StylingPanel />}
          {activeTab === 'templates' && <TemplateSelector />}
        </div>

        {/* Right Live Document Preview */}
        <div
          className={`flex-1 bg-slate-200/60 p-4 sm:p-6 overflow-hidden ${
            mobileTab === 'editor' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="w-full h-full max-w-4xl mx-auto flex flex-col">
            <LivePreview />
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal />

      {/* Share Document Modal */}
      <ShareDocumentModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        type="biodata"
        document={document}
      />
    </div>
  );
};
