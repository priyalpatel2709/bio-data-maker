import React from 'react';
import { BiodataProvider, useBiodata } from './context/BiodataContext';
import { DashboardView } from './components/dashboard/DashboardView';
import { StudioView } from './components/editor/StudioView';
import { LanguageSwitcher } from './components/common/LanguageSwitcher';
import { Sparkles, FileText, Layout, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { viewMode, setViewMode } = useBiodata();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Navbar when on Dashboard */}
      {viewMode === 'dashboard' && (
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-rose-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                Biodata<span className="text-rose-600">Maker</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 rounded-full border border-rose-200/60">
                Pro
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <a
              href="#templates"
              className="hover:text-slate-900 transition-colors hidden sm:block"
            >
              Templates
            </a>
            <LanguageSwitcher />
            <button
              onClick={() => setViewMode('studio')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95"
            >
              Open Studio
            </button>
          </nav>
        </header>
      )}

      {/* Main View Mode Switch */}
      <div className="flex-1">
        {viewMode === 'dashboard' ? <DashboardView /> : <StudioView />}
      </div>

      {/* Footer on Dashboard */}
      {viewMode === 'dashboard' && (
        <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 text-center text-xs text-slate-500 space-y-2">
          <div className="flex items-center justify-center gap-2 font-medium text-slate-700">
            <span>BiodataMaker Studio</span>
            <span>•</span>
            <span>Client-side 100% Privacy</span>
            <span>•</span>
            <span>PDF & Word (.docx) Exports</span>
          </div>
          <p className="text-slate-400">
            Crafted for matrimonial, professional, and personal profiles with highest visual standards.
          </p>
        </footer>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BiodataProvider>
      <AppContent />
    </BiodataProvider>
  );
};

export default App;
