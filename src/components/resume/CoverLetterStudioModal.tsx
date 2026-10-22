import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ResumeDocument } from '../../types/resume';
import { CoverLetterDocument } from '../../types/coverLetter';
import { COVER_LETTER_TEMPLATES, CoverLetterTemplateDef } from '../../data/coverLetterTemplates';
import {
  X,
  Mail,
  Copy,
  Check,
  Printer,
  Download,
  Sparkles,
  Save,
  RotateCcw,
  Building2,
  User,
  Briefcase,
  Calendar,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface CoverLetterStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeDocument;
  onSaveToResume: (coverLetter: CoverLetterDocument) => void;
}

export const CoverLetterStudioModal: React.FC<CoverLetterStudioModalProps> = ({
  isOpen,
  onClose,
  resume,
  onSaveToResume,
}) => {
  const { contact, styling } = resume;

  // Selected template
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('modern-tech');

  // Fill-in-the-blank tokens
  const [targetCompany, setTargetCompany] = useState('Acme Corporation');
  const [targetRole, setTargetRole] = useState(contact.jobTitle || 'Software Engineer');
  const [hiringManager, setHiringManager] = useState('Hiring Manager');
  const [companyLocation, setCompanyLocation] = useState('San Francisco, CA');
  const [dateStr, setDateStr] = useState(() =>
    new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  );

  // Default skills from resume
  const initialSkills = useMemo(() => {
    const list = resume.skillCategories.flatMap((sc) => sc.skills).slice(0, 4);
    return list.length > 0 ? list.join(', ') : 'modern architecture, problem-solving, and cross-functional leadership';
  }, [resume]);

  const [topSkills, setTopSkills] = useState(initialSkills);
  const [keyAchievement, setKeyAchievement] = useState(
    resume.experience[0]?.bullets[0]?.replace(/^\W+/, '') ||
      'architecting an automated CI/CD pipeline that reduced deployment cycles by 40%'
  );
  const [companyMission, setCompanyMission] = useState(
    'delivering high-quality, customer-centric products and pushing technology forward'
  );

  // Copy & save feedback
  const [copiedText, setCopiedText] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Active template definition
  const templateDef = useMemo(
    () => COVER_LETTER_TEMPLATES.find((t) => t.id === selectedTemplateId) || COVER_LETTER_TEMPLATES[0],
    [selectedTemplateId]
  );

  // Perform dynamic token substitution
  const substituteTokens = (rawText: string) => {
    return rawText
      .replace(/\[Target Company\]/g, targetCompany || 'Company')
      .replace(/\[Target Role\]/g, targetRole || 'Position')
      .replace(/\[Top Skills\]/g, topSkills || 'key domain competencies')
      .replace(/\[Key Achievement\]/g, keyAchievement || 'delivering mission-critical solutions')
      .replace(/\[Company Mission\]/g, companyMission || 'innovation and excellence')
      .replace(/\[Industry \/ Market\]/g, 'the industry');
  };

  const openingParagraph = useMemo(
    () => substituteTokens(templateDef.defaultOpening),
    [templateDef, targetCompany, targetRole, topSkills, keyAchievement, companyMission]
  );

  const bodyParagraphs = useMemo(
    () => templateDef.defaultBody.map((p) => substituteTokens(p)),
    [templateDef, targetCompany, targetRole, topSkills, keyAchievement, companyMission]
  );

  const closingParagraph = useMemo(
    () => substituteTokens(templateDef.defaultClosing),
    [templateDef, targetCompany, targetRole, topSkills, keyAchievement, companyMission]
  );

  const fullLetterText = useMemo(() => {
    return [
      contact.fullName,
      contact.jobTitle,
      contact.email,
      contact.phone,
      contact.location,
      '',
      dateStr,
      '',
      hiringManager,
      targetCompany,
      companyLocation,
      '',
      `Dear ${hiringManager},`,
      '',
      openingParagraph,
      '',
      bodyParagraphs.join('\n\n'),
      '',
      closingParagraph,
      '',
      templateDef.defaultSignOff,
      contact.fullName,
    ].join('\n');
  }, [
    contact,
    dateStr,
    hiringManager,
    targetCompany,
    companyLocation,
    openingParagraph,
    bodyParagraphs,
    closingParagraph,
    templateDef,
  ]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullLetterText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([fullLetterText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cover_Letter_${targetCompany.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    const doc: CoverLetterDocument = {
      id: `cl_${Date.now()}`,
      title: `Cover Letter - ${targetCompany}`,
      targetRole,
      targetCompany,
      date: dateStr,
      recipient: {
        name: hiringManager,
        company: targetCompany,
        location: companyLocation,
      },
      sender: {
        fullName: contact.fullName,
        jobTitle: contact.jobTitle,
        email: contact.email,
        phone: contact.phone,
        location: contact.location,
        linkedin: contact.linkedin,
      },
      salutation: `Dear ${hiringManager},`,
      openingParagraph,
      bodyParagraphs,
      closingParagraph,
      signOff: templateDef.defaultSignOff,
      fullContentText: fullLetterText,
    };

    onSaveToResume(doc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const primaryColor = styling.primaryColor || '#0F766E';

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Cover Letter Builder
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  Fill-In-The-Blank (No AI)
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Coordinated with your resume branding, colors, and typography.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition active:scale-95"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? 'Saved to Resume' : 'Save'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Area: Left Form Inputs | Right Styled Live Preview */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Inputs Column (5 cols) */}
          <div className="md:col-span-5 border-r border-slate-200 overflow-y-auto p-5 space-y-5 bg-slate-50/40">
            {/* Template Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Cover Letter Template Style
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {COVER_LETTER_TEMPLATES.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name} ({tpl.category})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">{templateDef.description}</p>
            </div>

            {/* Target Job & Company */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Target Application
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Target Company</label>
                  <input
                    type="text"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Target Role</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Hiring Manager</label>
                  <input
                    type="text"
                    value={hiringManager}
                    onChange={(e) => setHiringManager(e.target.value)}
                    placeholder="e.g. Hiring Team"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Location</label>
                  <input
                    type="text"
                    value={companyLocation}
                    onChange={(e) => setCompanyLocation(e.target.value)}
                    placeholder="e.g. Remote / New York"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Mad-Libs Customization Tokens */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Key Achievements & Skills to Spotlight
              </span>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Key Accomplishment or Project (Fill-in-the-blank)
                </label>
                <textarea
                  rows={2}
                  value={keyAchievement}
                  onChange={(e) => setKeyAchievement(e.target.value)}
                  placeholder="e.g. leading the migration of legacy APIs, improving response time by 45%"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Top Skills / Competencies to Highlight
                </label>
                <input
                  type="text"
                  value={topSkills}
                  onChange={(e) => setTopSkills(e.target.value)}
                  placeholder="e.g. TypeScript, React, PostgreSQL, Cloud Infrastructure"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Why this company? (Company mission / value)
                </label>
                <input
                  type="text"
                  value={companyMission}
                  onChange={(e) => setCompanyMission(e.target.value)}
                  placeholder="e.g. solving scalable developer tooling and engineering culture"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Live Styled Preview Column (7 cols) */}
          <div className="md:col-span-7 flex flex-col bg-slate-200/70 overflow-hidden">
            {/* Preview Toolbar */}
            <div className="h-12 bg-white/95 border-b border-slate-200/80 px-4 py-2 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                Live Letter Preview
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title="Copy full text to clipboard"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownloadTxt}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title="Download as .txt"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.txt</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition active:scale-95"
                  title="Print or Save as Vector PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / PDF</span>
                </button>
              </div>
            </div>

            {/* Styled Document Sheet Viewport */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center items-start">
              <div
                id="printable-cover-letter"
                style={{
                  fontFamily: `${styling.fontFamily || 'Inter'}, sans-serif`,
                }}
                className="bg-white w-full max-w-xl p-8 sm:p-10 shadow-sm border border-slate-200/80 text-slate-800 text-xs leading-relaxed space-y-4 rounded"
              >
                {/* Header (Coordinated with Resume branding) */}
                <header className="border-b-2 pb-4 mb-5" style={{ borderColor: primaryColor }}>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">{contact.fullName}</h1>
                  {contact.jobTitle && (
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">{contact.jobTitle}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2">
                    {contact.email && <span>{contact.email}</span>}
                    {contact.phone && <span>• {contact.phone}</span>}
                    {contact.location && <span>• {contact.location}</span>}
                    {contact.linkedin && <span>• {contact.linkedin.replace(/^https?:\/\//, '')}</span>}
                  </div>
                </header>

                {/* Date & Recipient Block */}
                <div className="space-y-1 text-slate-600 text-[11px]">
                  <p className="font-medium text-slate-700">{dateStr}</p>
                  <div className="pt-2">
                    <p className="font-bold text-slate-900">{hiringManager}</p>
                    <p className="font-semibold text-slate-700">{targetCompany}</p>
                    {companyLocation && <p>{companyLocation}</p>}
                  </div>
                </div>

                {/* Salutation */}
                <p className="font-bold text-slate-800 pt-2">Dear {hiringManager},</p>

                {/* Opening Paragraph */}
                <p className="text-slate-700 text-justify">{openingParagraph}</p>

                {/* Body Paragraphs */}
                {bodyParagraphs.map((para, i) => (
                  <p key={i} className="text-slate-700 text-justify">
                    {para}
                  </p>
                ))}

                {/* Closing Paragraph */}
                <p className="text-slate-700 text-justify">{closingParagraph}</p>

                {/* Sign-off */}
                <div className="pt-4 space-y-1">
                  <p className="text-slate-700">{templateDef.defaultSignOff}</p>
                  <p className="font-bold text-slate-900 text-sm pt-2">{contact.fullName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
