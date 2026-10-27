import React, { useState, useEffect } from "react";
import { BiodataProvider, useBiodata } from "./context/BiodataContext";
import { ResumeProvider, useResume } from "./context/ResumeContext";
import { AppModeProvider, useAppMode } from "./context/AppModeContext";
import { AuthProvider } from "./context/AuthContext";
import { DashboardView } from "./components/dashboard/DashboardView";
import { StudioView } from "./components/editor/StudioView";
import { ResumeDashboardView } from "./components/resume/ResumeDashboardView";
import { ResumeStudioView } from "./components/resume/ResumeStudioView";
import { SharedDocumentView } from "./components/share/SharedDocumentView";
import { LanguageSwitcher } from "./components/common/LanguageSwitcher";
import { UserMenu } from "./components/auth/UserMenu";
import { Sparkles, FileText, Heart, Briefcase, Layers } from "lucide-react";

const AppContent: React.FC = () => {
  const { appMode, setAppMode } = useAppMode();
  const { viewMode: biodataViewMode, setViewMode: setBiodataViewMode } =
    useBiodata();
  const { viewMode: resumeViewMode, setViewMode: setResumeViewMode } =
    useResume();

  const [isShareView, setIsShareView] = useState(() => {
    return (
      window.location.hash.includes("/share") ||
      window.location.search.includes("share=")
    );
  });

  useEffect(() => {
    const handleHashChange = () => {
      setIsShareView(
        window.location.hash.includes("/share") ||
          window.location.search.includes("share="),
      );
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // If viewing a public shared document, render the standalone clean view
  if (isShareView) {
    return <SharedDocumentView />;
  }

  const isCurrentDashboard =
    (appMode === "biodata" && biodataViewMode === "dashboard") ||
    (appMode === "resume" && resumeViewMode === "dashboard");

  return (
    <div className="min-h-screen flex flex-col font-sans w-full max-w-full overflow-x-hidden">
      {/* Top Header when on either Dashboard */}
      {isCurrentDashboard && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-2 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-1 sm:gap-4 w-full max-w-full">
          {/* Logo & Brand */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <div
              className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl text-white flex items-center justify-center font-bold shadow-md transition-all ${
                appMode === "biodata"
                  ? "bg-gradient-to-tr from-rose-600 to-amber-500 shadow-rose-600/20"
                  : "bg-gradient-to-tr from-teal-700 to-sky-500 shadow-teal-700/20"
              }`}
            >
              {appMode === "biodata" ? (
                <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              ) : (
                <Briefcase className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              )}
            </div>
            <div>
              <span className="text-xs sm:text-base font-extrabold tracking-tight text-slate-900">
                {appMode === "biodata" ? (
                  <>
                    Biodata<span className="text-rose-600 hidden xs:inline">Maker</span>
                  </>
                ) : (
                  <>
                    Resume<span className="text-teal-700 hidden xs:inline">Builder</span>
                  </>
                )}
              </span>
              <span
                className={`hidden md:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                  appMode === "biodata"
                    ? "bg-rose-50 text-rose-700 border-rose-200/60"
                    : "bg-teal-50 text-teal-800 border-teal-200/60"
                }`}
              >
                {appMode === "biodata" ? "Pro" : "ATS Ready"}
              </span>
            </div>
          </div>

          {/* Mode Switcher Tabs (Center / Desktop & Mobile) */}
          <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200/80 shadow-2xs shrink-0">
            <button
              onClick={() => setAppMode("biodata")}
              className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                appMode === "biodata"
                  ? "bg-white text-rose-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Biodata<span className="hidden sm:inline"> Maker</span></span>
            </button>
            <button
              onClick={() => setAppMode("resume")}
              className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                appMode === "resume"
                  ? "bg-white text-teal-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <span>Resume<span className="hidden sm:inline"> Builder</span></span>
              <span className="hidden sm:inline-block ml-1 px-1.5 py-0.2 text-[9px] bg-teal-100 text-teal-800 rounded-full font-bold">
                NEW
              </span>
            </button>
          </div>

          {/* Right Navigation */}
          <nav className="flex items-center gap-1 sm:gap-3 text-xs font-semibold text-slate-600 shrink-0">
            <a
              href="#templates"
              className="hover:text-slate-900 transition-colors hidden md:block"
            >
              Templates
            </a>

            {appMode === "biodata" && (
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
            )}

            <UserMenu compact />

            <button
              onClick={() => {
                if (appMode === "biodata") {
                  setBiodataViewMode("studio");
                } else {
                  setResumeViewMode("studio");
                }
              }}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-sm active:scale-95 shrink-0 ${
                appMode === "biodata"
                  ? "bg-slate-900 hover:bg-slate-800"
                  : "bg-teal-700 hover:bg-teal-800"
              }`}
            >
              <span className="hidden sm:inline">Open </span>Studio
            </button>
          </nav>
        </header>
      )}

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-full min-w-0">
        {appMode === "biodata" ? (
          biodataViewMode === "dashboard" ? (
            <DashboardView />
          ) : (
            <StudioView />
          )
        ) : resumeViewMode === "dashboard" ? (
          <ResumeDashboardView />
        ) : (
          <ResumeStudioView />
        )}
      </div>

      {/* Footer on Dashboard */}
      {isCurrentDashboard && (
        <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 text-center text-xs text-slate-500 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2 font-medium text-slate-700">
            <span>
              {appMode === "biodata"
                ? "BiodataMaker Studio"
                : "ResumeBuilder Studio"}
            </span>
            <span>•</span>
            <span>Client-side 100% Privacy</span>
            <span>•</span>
            <span>High-Res PDF & Word (.docx) Exports</span>
            {appMode === "resume" && (
              <>
                <span>•</span>
                <span>ATS Optimized</span>
              </>
            )}
          </div>
          <p className="text-slate-400">
            {appMode === "biodata"
              ? "Crafted for matrimonial, professional, and personal profiles with highest visual standards."
              : "Engineered for software engineers, product managers, designers, executives, and modern job applicants."}
          </p>
        </footer>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppModeProvider>
        <BiodataProvider>
          <ResumeProvider>
            <AppContent />
          </ResumeProvider>
        </BiodataProvider>
      </AppModeProvider>
    </AuthProvider>
  );
};

export default App;
