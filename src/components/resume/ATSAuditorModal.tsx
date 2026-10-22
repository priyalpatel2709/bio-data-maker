import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ResumeDocument } from '../../types/resume';
import { auditResume, POWER_VERBS } from '../../utils/atsAuditor';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Zap,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Info,
} from 'lucide-react';

interface ATSAuditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeDocument;
}

export const ATSAuditorModal: React.FC<ATSAuditorModalProps> = ({
  isOpen,
  onClose,
  resume,
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'verb_bank'>('audit');
  const [selectedVerbCategory, setSelectedVerbCategory] = useState<string>('technical');
  const [copiedVerb, setCopiedVerb] = useState<string | null>(null);

  const report = useMemo(() => auditResume(resume), [resume]);

  if (!isOpen) return null;

  const handleCopyVerb = (verb: string) => {
    navigator.clipboard.writeText(verb);
    setCopiedVerb(verb);
    setTimeout(() => setCopiedVerb(null), 1800);
  };

  const scoreColor =
    report.overallScore >= 85
      ? 'text-emerald-600 border-emerald-500 bg-emerald-50'
      : report.overallScore >= 70
      ? 'text-teal-600 border-teal-500 bg-teal-50'
      : report.overallScore >= 50
      ? 'text-amber-600 border-amber-500 bg-amber-50'
      : 'text-rose-600 border-rose-500 bg-rose-50';

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/70 text-teal-700 flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                ATS Resume Auditor
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  Rule-Based Engine
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                100% deterministic scan against 150+ action verbs, metrics, and recruiter formatting rules.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-white flex items-center gap-2">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Score & Audit Breakdown</span>
          </button>
          <button
            onClick={() => setActiveTab('verb_bank')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'verb_bank'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Action Verbs Bank (150+)</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'audit' ? (
            <>
              {/* Score Top Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/80 items-center">
                <div className="sm:col-span-1 flex flex-col items-center justify-center text-center p-2">
                  <div className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center shadow-xs ${scoreColor}`}>
                    <span className="text-2xl font-black">{report.overallScore}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Score / 100</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 mt-2">
                    Grade: <span className="font-extrabold text-teal-700">{report.grade}</span>
                  </span>
                </div>

                {/* 4 Category Bars */}
                <div className="sm:col-span-3 space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Action Verbs & Tone</span>
                      <span>{report.categoryScores.verbs.score} / 25 pts</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(report.categoryScores.verbs.score / 25) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Quantified Metrics & Results</span>
                      <span>{report.categoryScores.metrics.score} / 25 pts</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(report.categoryScores.metrics.score / 25) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Contact Info & Essential Sections</span>
                      <span>{report.categoryScores.completeness.score} / 25 pts</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(report.categoryScores.completeness.score / 25) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Formatting & Bullet Quality</span>
                      <span>{report.categoryScores.formatting.score} / 25 pts</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(report.categoryScores.formatting.score / 25) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Passive / Weak Openings Alert if any */}
              {report.detectedWeakBullets.length > 0 && (
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/70 space-y-3">
                  <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{report.detectedWeakBullets.length} Passive / Weak Openings Detected:</span>
                  </div>
                  <div className="space-y-2">
                    {report.detectedWeakBullets.map((item, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-rose-200/80 text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-500 text-[11px]">
                          <span className="font-semibold text-rose-700">{item.company}</span>
                          <span className="text-slate-400">{item.reason}</span>
                        </div>
                        <p className="text-slate-700 italic">"{item.bullet}"</p>
                        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
                          <span className="text-slate-600 font-semibold">Suggested replacements:</span>
                          {item.replacement.map((word) => (
                            <button
                              key={word}
                              onClick={() => handleCopyVerb(word)}
                              className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200/80 font-bold transition flex items-center gap-1"
                              title="Click to copy"
                            >
                              <span>{word}</span>
                              {copiedVerb === word ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-2.5 h-2.5 opacity-60" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Checklist Breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Detailed ATS Rule Verification
                </h3>
                <div className="space-y-2.5">
                  {report.checks.map((check) => (
                    <div
                      key={check.id}
                      className="p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {check.status === 'passed' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : check.status === 'warning' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                          <span className="text-xs font-bold text-slate-800">{check.title}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-600">
                          {check.score} / {check.maxScore} pts
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 pl-6">{check.details}</p>
                      {check.suggestion && (
                        <div className="ml-6 mt-1 p-2 rounded-lg bg-teal-50/70 border border-teal-200/60 text-[11px] text-teal-900 flex items-start gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                          <span>{check.suggestion}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Action Verbs Explorer */
            <div className="space-y-5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                Recruiters scan resumes in 6 seconds. Opening bullets with decisive action verbs immediately communicates impact and leadership. Click any verb to copy it.
              </div>

              {/* Categories */}
              <div className="flex items-center gap-2 flex-wrap">
                {Object.keys(POWER_VERBS).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedVerbCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                      selectedVerbCategory === cat
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.replace('_', ' & ')}
                  </button>
                ))}
              </div>

              {/* Verbs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(POWER_VERBS[selectedVerbCategory] || []).map((verb) => (
                  <button
                    key={verb}
                    onClick={() => handleCopyVerb(verb)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50/50 text-slate-800 text-xs font-semibold text-left transition flex items-center justify-between group shadow-2xs"
                  >
                    <span>{verb}</span>
                    {copiedVerb === verb ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-300 group-hover:text-teal-600 transition" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Score updates live in real-time as you edit your resume.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
