import React, { useState } from 'react';
import { useResume } from '../../../context/ResumeContext';
import { analyzeJobMatch, isAIConfigured, AtsMatchResult } from '../../../services/aiService';
import {
  X,
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Plus,
  Loader2,
  Settings,
  TrendingUp,
} from 'lucide-react';

interface AIJobMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const AIJobMatcherModal: React.FC<AIJobMatcherModalProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
}) => {
  const { document, addSkillCategory } = useResume();
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AtsMatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addedSkillsSuccess, setAddedSkillsSuccess] = useState(false);

  const configured = isAIConfigured();

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    setLoading(true);
    setError(null);
    setAddedSkillsSuccess(false);
    try {
      const res = await analyzeJobMatch(document, jobDescription);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze job match.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMissingSkills = () => {
    if (!result || result.missingKeywords.length === 0) return;
    addSkillCategory(`Target Job Keywords`, result.missingKeywords);
    setAddedSkillsSuccess(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-700 via-sky-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Target className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                ATS Job Description Matcher
              </h3>
              <p className="text-xs text-teal-200">
                Match your resume against any job description with AI
              </p>
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
        <div className="p-6 space-y-5 text-xs overflow-y-auto">
          {!configured ? (
            <div className="text-center py-6 px-4 space-y-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                <Settings className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">AI Router API Key Required</h4>
              <p className="text-slate-600 max-w-sm mx-auto leading-relaxed">
                Configure your API key for Nara Router, OpenRouter, or AgentRouter once to unlock real-time ATS keyword matching.
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
              {/* Input Area */}
              <div>
                <label className="font-bold text-slate-900 block mb-1 text-xs">
                  Paste Target Job Posting (Job Description):
                </label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job requirements, responsibilities, or entire LinkedIn / Indeed job description here..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600 focus:outline-hidden"
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Comparing candidate: <span className="font-semibold text-slate-700">{document.contact.fullName || 'Current Resume'}</span>
                  </span>
                  <button
                    type="button"
                    disabled={loading || !jobDescription.trim()}
                    onClick={handleAnalyze}
                    className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold transition shadow-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-teal-200" />
                        Analyzing Match...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-teal-300" />
                        Analyze ATS Match
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900">
                  <span className="font-bold">Error:</span> {error}
                </div>
              )}

              {/* Analysis Result */}
              {result && (
                <div className="space-y-4 pt-3 border-t border-slate-200 animate-in fade-in duration-300">
                  {/* Score Card */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${getScoreColor(result.matchScore)}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full border-4 border-current flex items-center justify-center font-black text-lg">
                        {result.matchScore}%
                      </div>
                      <div>
                        <div className="font-bold text-sm">
                          {result.matchScore >= 80
                            ? 'Excellent Match for this Role!'
                            : result.matchScore >= 60
                            ? 'Moderate Match — Optimization Recommended'
                            : 'Low Match — Add Missing Keywords'}
                        </div>
                        <div className="text-[11px] opacity-90 mt-0.5">
                          Calculated based on ATS keyword alignment and core job competencies.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Matching vs Missing Keywords Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Matching */}
                    <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Matching Keywords ({result.matchingKeywords.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {result.matchingKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-white border border-emerald-300 rounded text-emerald-900 font-medium text-[11px]"
                          >
                            ✓ {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Missing */}
                    <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>Missing Keywords ({result.missingKeywords.length})</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {result.missingKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-white border border-amber-300 rounded text-amber-900 font-medium text-[11px]"
                          >
                            + {kw}
                          </span>
                        ))}
                      </div>

                      {result.missingKeywords.length > 0 && (
                        <button
                          type="button"
                          onClick={handleAddMissingSkills}
                          disabled={addedSkillsSuccess}
                          className="w-full py-1.5 px-2.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {addedSkillsSuccess ? 'Added to Resume Skills!' : 'Add Missing Keywords to Skills'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Recommendations */}
                  {result.recommendations.length > 0 && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                        <Lightbulb className="w-4 h-4 text-teal-700" />
                        <span>Actionable ATS Recommendations</span>
                      </div>
                      <ul className="space-y-1.5 list-disc list-outside ml-4 text-slate-700 text-[11px] leading-relaxed">
                        {result.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
