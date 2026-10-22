import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useResume } from '../../../context/ResumeContext';
import { useAuth } from '../../../context/AuthContext';
import {
  tailorResumeAndCoverLetter,
  isAIConfigured,
} from '../../../services/aiService';
import { JobTailoredResult, CoverLetterDocument } from '../../../types/coverLetter';
import {
  X,
  Sparkles,
  Target,
  FileText,
  Mail,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Download,
  Upload,
  ArrowRight,
  Loader2,
  ExternalLink,
  Edit3,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface AIJobTailorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

const SAMPLE_TECH_JD = `Role: Senior Full-Stack Software Engineer
Company: CloudScale Technologies
Location: Remote (US / Worldwide)

About the Role:
We are seeking an experienced Senior Full-Stack Engineer to architect and scale our mission-critical distributed cloud applications. You will spearhead end-to-end feature development using TypeScript, React, Node.js, and PostgreSQL, while leading cloud deployment workflows with Docker and AWS.

Responsibilities:
- Architect high-performance, responsive web interfaces using React and modern component libraries.
- Design resilient REST and GraphQL APIs with Node.js and PostgreSQL.
- Optimize database queries, caching strategies, and real-time data pipelines.
- Champion CI/CD automation, unit testing, and cloud infrastructure monitoring.
- Mentor junior engineers and collaborate with product managers on roadmap milestones.

Requirements:
- 4+ years of production experience with TypeScript, React, and Node.js.
- Strong command of SQL (PostgreSQL), schema modeling, and indexing.
- Experience with Docker, cloud infrastructure (AWS/GCP), and CI/CD pipelines.
- Exceptional problem-solving skills, autonomy, and cross-functional communication.`;

export const AIJobTailorModal: React.FC<AIJobTailorModalProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
}) => {
  const { document: activeResume, addSavedResume, loadResume, setViewMode } = useResume();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'input' | 'results'>('input');
  const [resultTab, setResultTab] = useState<'resume' | 'coverletter'>('resume');
  const [jobDescription, setJobDescription] = useState('');
  const [saveAsNew, setSaveAsNew] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JobTailoredResult | null>(null);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);
  const [copiedResumeText, setCopiedResumeText] = useState(false);
  const [editableCoverLetter, setEditableCoverLetter] = useState<CoverLetterDocument | null>(null);

  const configured = isAIConfigured();

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setError(null);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle file drop or selection (.txt, .md, .docx text)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setJobDescription(text);
      }
    };
    reader.readAsText(file);
  };

  const handleTailor = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste or upload a Job Description to proceed.');
      return;
    }

    if (!configured) {
      onOpenSettings();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tailored = await tailorResumeAndCoverLetter(activeResume, jobDescription.trim());
      setResult(tailored);
      setEditableCoverLetter(tailored.coverLetter);

      // Save tailored resume as a new document
      if (saveAsNew) {
        addSavedResume(tailored.tailoredResume);
      }

      setActiveTab('results');
    } catch (err: any) {
      console.error('Job tailoring error:', err);
      setError(err.message || 'Failed to tailor resume and generate cover letter.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToStudio = () => {
    if (!result) return;
    loadResume(result.tailoredResume);
    setViewMode('studio');
    onClose();
  };

  const handleCopyCoverLetter = () => {
    if (!editableCoverLetter) return;
    navigator.clipboard.writeText(editableCoverLetter.fullContentText);
    setCopiedCoverLetter(true);
    setTimeout(() => setCopiedCoverLetter(false), 2000);
  };

  const handleDownloadCoverLetterTxt = () => {
    if (!editableCoverLetter) return;
    const blob = new Blob([editableCoverLetter.fullContentText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cover_Letter_${editableCoverLetter.targetCompany.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative my-auto bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] z-10 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-800 via-sky-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-xs">
              <Sparkles className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  AI Job Description Tailor & Cover Letter
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-teal-400/20 text-teal-200 rounded-full border border-teal-300/30">
                  Dual Output
                </span>
              </div>
              <p className="text-xs text-teal-100/80">
                Tailor your resume details & generate a matched cover letter in one click
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs if result is present */}
        {result && (
          <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-4 shrink-0">
            <button
              onClick={() => setActiveTab('input')}
              className={`pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'input'
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Job Description Input</span>
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'results'
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tailored Resume & Cover Letter</span>
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                {result.atsScore}% Match
              </span>
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {!configured && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">AI Router API Key Required</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Configure your free Nara, OpenRouter, or AgentRouter key to tailor resumes and generate cover letters.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenSettings}
                className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-bold shrink-0 transition"
              >
                Setup AI Key
              </button>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {activeTab === 'input' ? (
            <div className="space-y-4">
              {/* User Context Preview Card */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                    {activeResume.contact.fullName.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Active Profile: {activeResume.contact.fullName || 'Untitled Profile'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {activeResume.contact.jobTitle} • {activeResume.experience.length} experiences • {activeResume.skillCategories.length} skill groups
                    </p>
                  </div>
                </div>
                {user ? (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    Synced Account
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    Guest Mode
                  </span>
                )}
              </div>

              {/* JD Input Area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Target Job Description (JD)</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setJobDescription(SAMPLE_TECH_JD)}
                      className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      <span>Try Sample Tech JD</span>
                    </button>
                    <label className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:underline cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3 text-slate-500" />
                      <span>Upload File (.txt, .md)</span>
                      <input
                        type="file"
                        accept=".txt,.md"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    rows={8}
                    required
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the complete job description here, including responsibilities, requirements, and company mission..."
                    className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 focus:bg-white resize-y"
                  />
                  <div className="text-[10px] text-slate-400 text-right mt-1">
                    {jobDescription.length} characters
                  </div>
                </div>
              </div>

              {/* Preferences Checkbox */}
              <div className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveAsNew}
                    onChange={(e) => setSaveAsNew(e.target.checked)}
                    className="rounded text-teal-700 focus:ring-teal-700"
                  />
                  <span>Create as a new tailored resume (keeps your original resume intact)</span>
                </label>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleTailor}
                disabled={loading || !jobDescription.trim()}
                className="w-full py-3 bg-gradient-to-r from-teal-700 to-sky-700 hover:from-teal-800 hover:to-sky-800 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-700/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Analyzing JD, tailoring resume & generating cover letter...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-teal-200" />
                    <span>Tailor Resume & Generate Cover Letter</span>
                    <ArrowRight className="w-4 h-4 text-teal-200" />
                  </>
                )}
              </button>
            </div>
          ) : (
            result && (
              <div className="space-y-5">
                {/* Score & Keyword Summary Bar */}
                <div className="p-4 bg-gradient-to-br from-slate-50 to-teal-50/40 border border-teal-200/70 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex flex-col items-center justify-center font-black shadow-sm">
                      <span className="text-base leading-none">{result.atsScore}%</span>
                      <span className="text-[9px] uppercase font-bold text-teal-200">ATS</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {result.targetJobTitle}
                      </h4>
                      <p className="text-xs font-medium text-teal-800">
                        {result.targetCompany}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleApplyToStudio}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95 flex items-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5 text-teal-300" />
                      <span>Open Tailored Resume in Studio</span>
                    </button>
                  </div>
                </div>

                {/* Sub Tab Switcher: Tailored Resume vs Cover Letter */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setResultTab('resume')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                      resultTab === 'resume'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-700" />
                    <span>Tailored Resume Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setResultTab('coverletter')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                      resultTab === 'coverletter'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-rose-600" />
                    <span>Tailored Cover Letter</span>
                  </button>
                </div>

                {/* Tab: Tailored Resume Details */}
                {resultTab === 'resume' && (
                  <div className="space-y-4">
                    {/* Tailored Professional Summary */}
                    <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          Tailored Professional Summary:
                        </span>
                        <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/50">
                          Optimized for {result.targetCompany}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3 rounded-lg border border-slate-200/60">
                        "{result.tailoredResume.summary}"
                      </p>
                    </div>

                    {/* Keywords Matched vs Missing */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/60 rounded-xl space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Matching JD Keywords:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {result.matchingKeywords.map((kw, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-[11px] font-semibold bg-white text-emerald-800 rounded-md border border-emerald-200 shadow-2xs"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3.5 bg-amber-50/60 border border-amber-200/60 rounded-xl space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                          <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                          <span>Integrated Missing Skills:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {result.missingKeywords.map((kw, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-[11px] font-semibold bg-white text-amber-800 rounded-md border border-amber-200 shadow-2xs"
                            >
                              +{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Cards */}
                    <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-white">
                          Tailored Resume is ready in your saved list!
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Titled: "{result.tailoredResume.title}". All styling, contact info, and PDF export features are ready.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyToStudio}
                        className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs rounded-xl transition active:scale-95 shrink-0 flex items-center gap-1.5"
                      >
                        <span>Open & Edit in Studio</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab: Tailored Cover Letter */}
                {resultTab === 'coverletter' && editableCoverLetter && (
                  <div className="space-y-4">
                    {/* Cover Letter Actions Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <div className="text-xs font-bold text-slate-800">
                        Tailored Cover Letter
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyCoverLetter}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition flex items-center gap-1.5"
                        >
                          {copiedCoverLetter ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Text</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleDownloadCoverLetterTxt}
                          className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download .txt</span>
                        </button>
                      </div>
                    </div>

                    {/* Formatted Letter Preview Card */}
                    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 font-serif text-slate-800 text-xs leading-relaxed">
                      {/* Sender Letterhead */}
                      <div className="border-b border-slate-200 pb-3 font-sans">
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                          {editableCoverLetter.sender.fullName}
                        </h2>
                        <p className="text-[11px] text-slate-600">
                          {[
                            editableCoverLetter.sender.jobTitle,
                            editableCoverLetter.sender.email,
                            editableCoverLetter.sender.phone,
                            editableCoverLetter.sender.location,
                          ]
                            .filter(Boolean)
                            .join(' • ')}
                        </p>
                      </div>

                      {/* Date & Recipient */}
                      <div className="font-sans text-[11px] text-slate-600 space-y-0.5">
                        <p>{editableCoverLetter.date}</p>
                        <p className="font-bold text-slate-900 pt-1">{editableCoverLetter.recipient.name}</p>
                        {editableCoverLetter.recipient.title && <p>{editableCoverLetter.recipient.title}</p>}
                        <p>{editableCoverLetter.recipient.company}</p>
                        <p>{editableCoverLetter.recipient.location}</p>
                      </div>

                      {/* Salutation */}
                      <div className="font-bold text-slate-900 pt-1 font-sans">
                        {editableCoverLetter.salutation}
                      </div>

                      {/* Opening Paragraph */}
                      <p className="leading-relaxed">
                        {editableCoverLetter.openingParagraph}
                      </p>

                      {/* Body Paragraphs */}
                      {editableCoverLetter.bodyParagraphs.map((para, i) => (
                        <p key={i} className="leading-relaxed">
                          {para}
                        </p>
                      ))}

                      {/* Closing Paragraph */}
                      <p className="leading-relaxed">
                        {editableCoverLetter.closingParagraph}
                      </p>

                      {/* Sign-off */}
                      <div className="pt-2 font-sans space-y-1">
                        <p>{editableCoverLetter.signOff}</p>
                        <p className="font-bold text-slate-900 pt-4">
                          {editableCoverLetter.sender.fullName}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};
