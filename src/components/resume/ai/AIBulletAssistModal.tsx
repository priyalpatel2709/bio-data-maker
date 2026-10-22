import React, { useState, useEffect } from 'react';
import { improveBulletPoint, isAIConfigured, getAISettings, AI_PROVIDERS } from '../../../services/aiService';
import { X, Sparkles, Check, RefreshCw, Loader2, ArrowRight, Settings } from 'lucide-react';

interface AIBulletAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBullet: string;
  position?: string;
  company?: string;
  onApply: (newBullet: string) => void;
  onOpenSettings: () => void;
}

export const AIBulletAssistModal: React.FC<AIBulletAssistModalProps> = ({
  isOpen,
  onClose,
  initialBullet,
  position,
  company,
  onApply,
  onOpenSettings,
}) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const configured = isAIConfigured();
  const currentProviderName = AI_PROVIDERS[getAISettings().provider]?.name || 'AI Router';

  const fetchSuggestions = async () => {
    if (!configured) return;
    setLoading(true);
    setError(null);
    try {
      const results = await improveBulletPoint(initialBullet, { position, company });
      setSuggestions(results);
    } catch (err: any) {
      setError(err.message || 'Failed to generate AI suggestions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (configured && initialBullet.trim()) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setError(null);
      }
    }
  }, [isOpen, initialBullet]);

  if (!isOpen) return null;

  const styles = [
    { label: 'Action & Execution', badge: 'Action', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Metric & Quantified Impact', badge: 'Metrics', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { label: 'Executive & Strategic', badge: 'Executive', color: 'bg-purple-50 text-purple-700 border-purple-200' },
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
              <h3 className="font-bold text-sm sm:text-base leading-tight">AI Bullet Point Enhancer</h3>
              <p className="text-xs text-teal-200">Powered by {currentProviderName}</p>
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
          {/* Not Configured State */}
          {!configured ? (
            <div className="text-center py-6 px-4 space-y-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                <Settings className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">AI Router API Key Required</h4>
              <p className="text-slate-600 max-w-sm mx-auto leading-relaxed">
                Configure your API key for Nara Router, OpenRouter, or AgentRouter to activate real-time bullet improvements, summary generation, and ATS analysis.
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
              {/* Original Bullet */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Original Bullet
                </span>
                <p className="text-slate-800 font-medium italic">
                  "{initialBullet || 'No text entered yet'}"
                </p>
                {(position || company) && (
                  <div className="text-[10px] text-slate-400 mt-1">
                    Context: {position} {company ? `at ${company}` : ''}
                  </div>
                )}
              </div>

              {/* Loading State */}
              {loading && (
                <div className="py-8 text-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-teal-700 mx-auto" />
                  <p className="text-slate-600 font-medium">
                    Crafting high-impact STAR method variations...
                  </p>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs">
                  <span className="font-bold">Error:</span> {error}
                  <button
                    onClick={fetchSuggestions}
                    className="ml-2 font-bold underline hover:text-red-800"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Suggestions */}
              {!loading && suggestions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">
                      Choose a High-Impact Variation:
                    </span>
                    <button
                      type="button"
                      onClick={fetchSuggestions}
                      className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Regenerate
                    </button>
                  </div>

                  {suggestions.map((suggestion, idx) => {
                    const styleMeta = styles[idx % styles.length];
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-xs transition bg-white flex flex-col justify-between gap-3 group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styleMeta.color}`}
                            >
                              {styleMeta.badge}: {styleMeta.label}
                            </span>
                          </div>
                          <p className="text-slate-800 text-xs leading-relaxed font-medium">
                            {suggestion}
                          </p>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              onApply(suggestion);
                              onClose();
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Use This Bullet
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
