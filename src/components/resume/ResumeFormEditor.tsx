import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  Sparkles,
  Link,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { AIBulletAssistModal } from './ai/AIBulletAssistModal';
import { AISummaryModal } from './ai/AISummaryModal';
import { AISettingsModal } from './ai/AISettingsModal';

export const ResumeFormEditor: React.FC = () => {
  const {
    document,
    updateContact,
    updateSummary,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkillCategory,
    updateSkillCategory,
    deleteSkillCategory,
    addSkillToCategory,
    removeSkillFromCategory,
    addProject,
    updateProject,
    deleteProject,
    addCertification,
    updateCertification,
    deleteCertification,
    addCustomSection,
    deleteCustomSection,
    addCustomSectionItem,
    updateCustomSectionItem,
    deleteCustomSectionItem,
  } = useResume();

  // Accordion state
  const [openSection, setOpenSection] = useState<string>('contact');
  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>({});
  const [newCustomTitle, setNewCustomTitle] = useState('');

  // AI Assistant state
  const [bulletAssist, setBulletAssist] = useState<{
    isOpen: boolean;
    initialBullet: string;
    position?: string;
    company?: string;
    onApply: (val: string) => void;
  }>({
    isOpen: false,
    initialBullet: '',
    onApply: () => {},
  });
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? '' : id));
  };

  const handleSkillKeyDown = (catId: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = newSkillInputs[catId]?.trim();
      if (val) {
        addSkillToCategory(catId, val);
        setNewSkillInputs((prev) => ({ ...prev, [catId]: '' }));
      }
    }
  };

  const handleAddBulletToExp = (expId: string) => {
    const exp = document.experience.find((e) => e.id === expId);
    if (exp) {
      updateExperience(expId, {
        bullets: [...exp.bullets, ''],
      });
    }
  };

  const handleUpdateExpBullet = (expId: string, index: number, value: string) => {
    const exp = document.experience.find((e) => e.id === expId);
    if (exp) {
      const nextBullets = [...exp.bullets];
      nextBullets[index] = value;
      updateExperience(expId, { bullets: nextBullets });
    }
  };

  const handleDeleteExpBullet = (expId: string, index: number) => {
    const exp = document.experience.find((e) => e.id === expId);
    if (exp) {
      updateExperience(expId, {
        bullets: exp.bullets.filter((_, idx) => idx !== index),
      });
    }
  };

  const handleAddBulletToProj = (projId: string) => {
    const proj = document.projects.find((p) => p.id === projId);
    if (proj) {
      updateProject(projId, {
        bullets: [...proj.bullets, ''],
      });
    }
  };

  const handleUpdateProjBullet = (projId: string, index: number, value: string) => {
    const proj = document.projects.find((p) => p.id === projId);
    if (proj) {
      const nextBullets = [...proj.bullets];
      nextBullets[index] = value;
      updateProject(projId, { bullets: nextBullets });
    }
  };

  const handleDeleteProjBullet = (projId: string, index: number) => {
    const proj = document.projects.find((p) => p.id === projId);
    if (proj) {
      updateProject(projId, {
        bullets: proj.bullets.filter((_, idx) => idx !== index),
      });
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Contact Information */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('contact')}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Personal & Contact Info</h3>
              <p className="text-[11px] text-slate-500">Name, target title, email, phone, location & links</p>
            </div>
          </div>
          {openSection === 'contact' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'contact' && (
          <div className="p-4 pt-1 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={document.contact.fullName}
                onChange={(e) => updateContact({ fullName: e.target.value })}
                placeholder="e.g. Priyal Patel"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 font-medium"
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Target Job Title</label>
              <input
                type="text"
                value={document.contact.jobTitle}
                onChange={(e) => updateContact({ jobTitle: e.target.value })}
                placeholder="e.g. Flutter Developer"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={document.contact.email}
                onChange={(e) => updateContact({ email: e.target.value })}
                placeholder="priyalpatel2709@gmail.com"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                value={document.contact.phone}
                onChange={(e) => updateContact({ phone: e.target.value })}
                placeholder="+91-8141513344"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Location / City</label>
              <input
                type="text"
                value={document.contact.location}
                onChange={(e) => updateContact({ location: e.target.value })}
                placeholder="Vadodara, India"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Portfolio / Website</label>
              <input
                type="text"
                value={document.contact.website || ''}
                onChange={(e) => updateContact({ website: e.target.value })}
                placeholder="https://yourportfolio.com"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">LinkedIn Profile</label>
              <input
                type="text"
                value={document.contact.linkedin || ''}
                onChange={(e) => updateContact({ linkedin: e.target.value })}
                placeholder="linkedin.com/in/priyalpatel2709"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">GitHub / Code Link</label>
              <input
                type="text"
                value={document.contact.github || ''}
                onChange={(e) => updateContact({ github: e.target.value })}
                placeholder="github.com/priyalpatel2709"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Profile Photo URL (Optional)</label>
              <input
                type="text"
                value={document.contact.photoUrl || ''}
                onChange={(e) => updateContact({ photoUrl: e.target.value })}
                placeholder="https://... or paste image URL"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Professional Summary */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('summary')}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Professional Summary</h3>
              <p className="text-[11px] text-slate-500">2-4 sentence executive pitch or objective</p>
            </div>
          </div>
          {openSection === 'summary' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'summary' && (
          <div className="p-4 pt-1 border-t border-slate-100 text-xs space-y-2">
            <textarea
              rows={4}
              value={document.summary}
              onChange={(e) => updateSummary(e.target.value)}
              placeholder="Passionate and results-oriented professional with 5+ years of experience in..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 leading-relaxed font-sans"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>{document.summary.length} characters</span>
              <button
                type="button"
                onClick={() => setIsSummaryModalOpen(true)}
                className="text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 transition"
                title="Generate tailored professional summaries from your experiences"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Write / Improve with AI</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Work Experience */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('experience')}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Work Experience ({document.experience.length})</h3>
              <p className="text-[11px] text-slate-500">Employment history, key accomplishments, metrics</p>
            </div>
          </div>
          {openSection === 'experience' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'experience' && (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-4">
            {document.experience.map((exp) => (
              <div key={exp.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">
                    {exp.position || 'Untitled Position'}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteExperience(exp.id)}
                    className="text-rose-600 hover:text-rose-700 p-1"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">Job Title</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">Location</label>
                    <input
                      type="text"
                      value={exp.location || ''}
                      onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                      placeholder="e.g. San Francisco, CA (or Remote)"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-slate-600 font-semibold mb-0.5">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        placeholder="2021"
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-slate-600 font-semibold mb-0.5">End Date</label>
                      <input
                        type="text"
                        value={exp.isCurrent ? 'Present' : exp.endDate}
                        disabled={exp.isCurrent}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        placeholder="2023"
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white disabled:bg-slate-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`current-${exp.id}`}
                    checked={exp.isCurrent}
                    onChange={(e) => updateExperience(exp.id, { isCurrent: e.target.checked })}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor={`current-${exp.id}`} className="text-slate-700 font-medium">
                    I currently work in this role
                  </label>
                </div>

                {/* Bullets */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-slate-700">Key Achievements & Bullet Points</label>
                    <button
                      type="button"
                      onClick={() => handleAddBulletToExp(exp.id)}
                      className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Bullet
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {exp.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => handleUpdateExpBullet(exp.id, idx, e.target.value)}
                          placeholder="e.g. Led a team of 5 engineers to deliver..."
                          className="flex-1 px-2.5 py-1 rounded border border-slate-300 bg-white text-xs leading-relaxed"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setBulletAssist({
                              isOpen: true,
                              initialBullet: bullet,
                              position: exp.position,
                              company: exp.company,
                              onApply: (improved) => handleUpdateExpBullet(exp.id, idx, improved),
                            })
                          }
                          title="Enhance with Nara AI (STAR Method)"
                          className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 border border-teal-200 transition shrink-0 bg-white"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExpBullet(exp.id, idx)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addExperience()}
              className="w-full py-2.5 rounded-xl border border-dashed border-teal-500 text-teal-700 hover:bg-teal-50 font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              Add Another Experience
            </button>
          </div>
        )}
      </div>

      {/* 4. Education */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('education')}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Education ({document.education.length})</h3>
              <p className="text-[11px] text-slate-500">Degrees, colleges, graduation year & honors</p>
            </div>
          </div>
          {openSection === 'education' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'education' && (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-4">
            {document.education.map((edu) => (
              <div key={edu.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">
                    {edu.degree || 'Degree'}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteEducation(edu.id)}
                    className="text-rose-600 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">Degree / Certificate</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                      placeholder="B.S. in Computer Science"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">Institution / University</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                      placeholder="University of California"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">Graduation Period</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                        placeholder="2016"
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                      />
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                        placeholder="2020"
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">GPA / Honors / Distinction</label>
                    <input
                      type="text"
                      value={edu.gradeOrGpa || ''}
                      onChange={(e) => updateEducation(edu.id, { gradeOrGpa: e.target.value })}
                      placeholder="GPA: 3.8 / 4.0 (Cum Laude)"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addEducation()}
              className="w-full py-2.5 rounded-xl border border-dashed border-emerald-500 text-emerald-700 hover:bg-emerald-50 font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              Add Another Degree / School
            </button>
          </div>
        )}
      </div>

      {/* 5. Skills & Proficiencies */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('skills')}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Skills & Tech Stack ({document.skillCategories.length} categories)</h3>
              <p className="text-[11px] text-slate-500">Categorized competencies, tools, programming languages</p>
            </div>
          </div>
          {openSection === 'skills' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'skills' && (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-4">
            {document.skillCategories.map((cat) => (
              <div key={cat.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={cat.categoryName}
                    onChange={(e) => updateSkillCategory(cat.id, { categoryName: e.target.value })}
                    className="font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-400 focus:outline-none focus:border-teal-600 pb-0.5"
                  />
                  <button
                    type="button"
                    onClick={() => deleteSkillCategory(cat.id)}
                    className="text-rose-600 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Skill Chips */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  {cat.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-300 rounded-md text-xs text-slate-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkillFromCategory(cat.id, idx)}
                        className="text-slate-400 hover:text-rose-600 text-sm font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Skill Input */}
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={newSkillInputs[cat.id] || ''}
                    onChange={(e) => setNewSkillInputs((prev) => ({ ...prev, [cat.id]: e.target.value }))}
                    onKeyDown={(e) => handleSkillKeyDown(cat.id, e)}
                    placeholder="Type skill & press Enter (e.g. Next.js)"
                    className="flex-1 px-2.5 py-1.5 bg-white rounded border border-slate-300 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = newSkillInputs[cat.id]?.trim();
                      if (val) {
                        addSkillToCategory(cat.id, val);
                        setNewSkillInputs((prev) => ({ ...prev, [cat.id]: '' }));
                      }
                    }}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addSkillCategory()}
              className="w-full py-2 rounded-xl border border-dashed border-amber-500 text-amber-700 hover:bg-amber-50 font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              Add Skill Category (e.g. Databases, Cloud)
            </button>
          </div>
        )}
      </div>

      {/* 6. Projects */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('projects')}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Featured Projects ({document.projects.length})</h3>
              <p className="text-[11px] text-slate-500">Open source apps, personal builds, client systems</p>
            </div>
          </div>
          {openSection === 'projects' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'projects' && (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-4">
            {document.projects.map((proj) => (
              <div key={proj.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">{proj.name || 'Project Name'}</span>
                  <button
                    type="button"
                    onClick={() => deleteProject(proj.id)}
                    className="text-rose-600 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">Project Name</label>
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">Role / Subtitle</label>
                    <input
                      type="text"
                      value={proj.roleOrSubtitle || ''}
                      onChange={(e) => updateProject(proj.id, { roleOrSubtitle: e.target.value })}
                      placeholder="Lead Developer / Solo Creator"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">Project URL / GitHub</label>
                    <input
                      type="text"
                      value={proj.link || ''}
                      onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">Tech Stack (comma separated)</label>
                    <input
                      type="text"
                      value={proj.techStack?.join(', ') || ''}
                      onChange={(e) =>
                        updateProject(proj.id, {
                          techStack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="React, TypeScript, AWS"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                {/* Project Bullets */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-slate-700">Project Highlights</label>
                    <button
                      type="button"
                      onClick={() => handleAddBulletToProj(proj.id)}
                      className="text-purple-700 hover:text-purple-800 font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Highlight
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {proj.bullets.map((b, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <textarea
                          rows={2}
                          value={b}
                          onChange={(e) => handleUpdateProjBullet(proj.id, idx, e.target.value)}
                          className="flex-1 px-2.5 py-1 rounded border border-slate-300 bg-white text-xs"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setBulletAssist({
                              isOpen: true,
                              initialBullet: b,
                              position: proj.roleOrSubtitle,
                              company: proj.name,
                              onApply: (improved) => handleUpdateProjBullet(proj.id, idx, improved),
                            })
                          }
                          title="Enhance with Nara AI"
                          className="p-1.5 rounded-lg text-purple-700 hover:bg-purple-50 border border-purple-200 transition shrink-0 bg-white"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProjBullet(proj.id, idx)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addProject()}
              className="w-full py-2.5 rounded-xl border border-dashed border-purple-500 text-purple-700 hover:bg-purple-50 font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              Add Another Project
            </button>
          </div>
        )}
      </div>

      {/* 7. Certifications */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('certifications')}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Certifications & Licenses ({document.certifications.length})</h3>
              <p className="text-[11px] text-slate-500">Cloud credentials, professional memberships, certifications</p>
            </div>
          </div>
          {openSection === 'certifications' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'certifications' && (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-3">
            {document.certifications.map((cert) => (
              <div key={cert.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{cert.name || 'Certification'}</span>
                  <button
                    type="button"
                    onClick={() => deleteCertification(cert.id)}
                    className="text-rose-600 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                      placeholder="Certificate Name"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                      placeholder="Issuer (e.g. AWS, Google)"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addCertification()}
              className="w-full py-2 rounded-xl border border-dashed border-rose-500 text-rose-700 hover:bg-rose-50 font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              Add Certification
            </button>
          </div>
        )}
      </div>

      {/* 8. Custom Sections (Languages, Volunteer, Awards) */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('custom')}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Custom Sections ({document.customSections.length})</h3>
              <p className="text-[11px] text-slate-500">Languages, Publications, Volunteer Experience, Awards</p>
            </div>
          </div>
          {openSection === 'custom' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'custom' && (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-4">
            {document.customSections.map((cs) => (
              <div key={cs.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{cs.title}</span>
                  <button
                    type="button"
                    onClick={() => deleteCustomSection(cs.id)}
                    className="text-rose-600 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {cs.items.map((item) => (
                    <div key={item.id} className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateCustomSectionItem(cs.id, item.id, { title: e.target.value })}
                          placeholder="Item Title (e.g. Spanish, Best Hackathon Project)"
                          className="font-semibold text-slate-800 text-xs w-full mr-2"
                        />
                        <button
                          type="button"
                          onClick={() => deleteCustomSectionItem(cs.id, item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.subtitle || ''}
                        onChange={(e) => updateCustomSectionItem(cs.id, item.id, { subtitle: e.target.value })}
                        placeholder="Subtitle / Level (e.g. Native, First Place)"
                        className="w-full px-2 py-1 rounded border border-slate-200 text-xs text-slate-600"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addCustomSectionItem(cs.id)}
                    className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add item to {cs.title}
                  </button>
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <input
                type="text"
                value={newCustomTitle}
                onChange={(e) => setNewCustomTitle(e.target.value)}
                placeholder="New section title (e.g. Languages, Awards)"
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (newCustomTitle.trim()) {
                    addCustomSection(newCustomTitle.trim());
                    setNewCustomTitle('');
                  }
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs"
              >
                Add Section
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Bullet Assist Modal */}
      <AIBulletAssistModal
        isOpen={bulletAssist.isOpen}
        onClose={() => setBulletAssist((prev) => ({ ...prev, isOpen: false }))}
        initialBullet={bulletAssist.initialBullet}
        position={bulletAssist.position}
        company={bulletAssist.company}
        onApply={bulletAssist.onApply}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* AI Summary Modal */}
      <AISummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* AI Settings Modal */}
      <AISettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
};
