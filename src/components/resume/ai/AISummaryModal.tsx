import React, { useState, useEffect } from 'react';
import { useResume } from '../../../context/ResumeContext';
import { generateSummary, isAIConfigured } from '../../../services/aiService';
import { X, Sparkles, Check, RefreshCw, Loader2, Settings } from 'lucide-react';

interface AISummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const AISummaryModal: React.FC<AISummaryModalProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
}) => {
  const { document, updateSummary } = useResume();
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const configured = isAIConfigured();

  const fetchSummaries = async () => {
    if (!configured) return;
    setLoading(true);
    setError(null);
    try {
      const skills = document.skillCategories.flatMap((sc) => sc.skills);
      const topExperiences = document.experience.map(
        (e) => `${e.position} at ${e.company}`
      );

      const results = await generateSummary({
        fullName: document.contact.fullName,
        jobTitle: document.contact.jobTitle,
        skills,
        topExperiences,
      });
      setSummaries(results);
    } catch (err: any) {
      setError(err.message || 'Failed to generate summary options.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (configured) {
        fetchSummaries();
      } else {
        setSummaries([]);
        setError(null);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toneBadges = [
    { title: 'Impact & Quantified Track Record', badge: 'High Impact', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    { title: 'Technical Mastery & Domain Depth', badge: 'Technical Depth', color: 'bg-blue-50 text-blue-800 border-blue-300' },
    { title: 'Leadership & Scaled Execution', badge: 'Leadership', color: 'bg-purple-50 text-purple-800 border-purple-300' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                AI Professional Summary Generator
              </h3>
              <p className="text-xs text-teal-200">Crafted from your experience & skills</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs overflow-y-auto">
          {!configured ? (
            <div className="text-center py-6 px-4 space-y-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                <Settings className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">AI Router API Key Required</h4>
              <p className="text-slate-600 max-w-sm mx-auto leading-relaxed">
                Connect your API key for Nara Router, OpenRouter, or AgentRouter once to generate professional summaries instantly.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition shadow-sm"
              >
                <Settings className="w-4 h-4" />
                Configure AI Settings
              </button>
            </div>
          ) : (
            <>
              {loading && (
                <div className="py-10 text-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-teal-700 mx-auto" />
                  <p className="text-slate-600 font-medium">
                    Synthesizing your experience into executive summary drafts...
                  </p>
                </div>
              )}

              {error && !loading && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900">
                  <span className="font-bold">Error:</span> {error}
                  <button
                    onClick={fetchSummaries}
                    className="ml-2 font-bold underline hover:text-red-800"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!loading && summaries.length > 0 && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">
                      Select Your Preferred Summary:
                    </span>
                    <button
                      type="button"
                      onClick={fetchSummaries}
                      className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Regenerate
                    </button>
                  </div>

                  {summaries.map((summaryText, idx) => {
                    const badgeMeta = toneBadges[idx % toneBadges.length];
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-xs transition bg-white flex flex-col justify-between gap-3 group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeMeta.color}`}
                            >
                              {badgeMeta.badge}: {badgeMeta.title}
                            </span>
                          </div>
                          <p className="text-slate-800 text-xs leading-relaxed font-normal">
                            {summaryText}
                          </p>
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              updateSummary(summaryText);
                              onClose();
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Apply to Resume
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
