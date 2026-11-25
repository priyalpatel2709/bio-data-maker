import React, { useState } from "react";
import { useResume } from "../../context/ResumeContext";
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
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  SlidersHorizontal,
  ClipboardPaste,
  Check,
  X,
} from "lucide-react";
import { AIBulletAssistModal } from "./ai/AIBulletAssistModal";
import { AISummaryModal } from "./ai/AISummaryModal";
import { AISettingsModal } from "./ai/AISettingsModal";
import {
  parsePastedList,
  parsePastedBullets,
} from "../../utils/textListParser";
import { ResumeSectionKey, ResumeSectionMeta } from "../../types/resume";

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
    addSkillsToCategory,
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
    moveSection,
    toggleSectionVisibility,
    updateSectionTitle,
  } = useResume();

  // Accordion state
  const [openSection, setOpenSection] = useState<string>("contact");
  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>(
    {},
  );
  const [newCustomTitle, setNewCustomTitle] = useState("");
  const [isReorderOpen, setIsReorderOpen] = useState(false);

  // Bulk Skills Paste Modal state
  const [bulkSkillsModal, setBulkSkillsModal] = useState<{
    isOpen: boolean;
    categoryId: string;
    categoryName: string;
    text: string;
  }>({
    isOpen: false,
    categoryId: "",
    categoryName: "",
    text: "",
  });

  // AI Assistant state
  const [bulletAssist, setBulletAssist] = useState<{
    isOpen: boolean;
    initialBullet: string;
    position?: string;
    company?: string;
    onApply: (val: string) => void;
  }>({
    isOpen: false,
    initialBullet: "",
    onApply: () => {},
  });
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? "" : id));
  };

  // Skill input & paste handlers
  const handleAddSkillFromInput = (catId: string) => {
    const val = newSkillInputs[catId]?.trim();
    if (!val) return;
    const parsed = parsePastedList(val);
    if (parsed.length > 1) {
      addSkillsToCategory(catId, parsed);
    } else if (parsed.length === 1) {
      addSkillToCategory(catId, parsed[0]);
    }
    setNewSkillInputs((prev) => ({ ...prev, [catId]: "" }));
  };

  const handleSkillKeyDown = (
    catId: string,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddSkillFromInput(catId);
    }
  };

  const handleSkillInputPaste = (
    catId: string,
    e: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    const text = e.clipboardData.getData("text");
    if (!text) return;
    if (text.includes("\n") || text.includes(",") || text.includes(";")) {
      const parsed = parsePastedList(text);
      if (parsed.length > 1) {
        e.preventDefault();
        addSkillsToCategory(catId, parsed);
        setNewSkillInputs((prev) => ({ ...prev, [catId]: "" }));
      }
    }
  };

  const handleApplyBulkSkills = () => {
    if (!bulkSkillsModal.categoryId || !bulkSkillsModal.text.trim()) return;
    const parsed = parsePastedList(bulkSkillsModal.text);
    if (parsed.length > 0) {
      addSkillsToCategory(bulkSkillsModal.categoryId, parsed);
    }
    setBulkSkillsModal({
      isOpen: false,
      categoryId: "",
      categoryName: "",
      text: "",
    });
  };

  // Bullets paste handlers (split multiline text into individual bullets)
  const handleExpBulletPaste = (
    expId: string,
    bulletIdx: number,
    e: React.ClipboardEvent<HTMLTextAreaElement>,
  ) => {
    const text = e.clipboardData.getData("text");
    if (!text || !text.includes("\n")) return;
    const parsed = parsePastedBullets(text);
    if (parsed.length > 1) {
      e.preventDefault();
      const exp = document.experience.find((x) => x.id === expId);
      if (exp) {
        const nextBullets = [...exp.bullets];
        nextBullets[bulletIdx] = parsed[0];
        nextBullets.splice(bulletIdx + 1, 0, ...parsed.slice(1));
        updateExperience(expId, { bullets: nextBullets });
      }
    }
  };

  const handleProjBulletPaste = (
    projId: string,
    bulletIdx: number,
    e: React.ClipboardEvent<HTMLTextAreaElement>,
  ) => {
    const text = e.clipboardData.getData("text");
    if (!text || !text.includes("\n")) return;
    const parsed = parsePastedBullets(text);
    if (parsed.length > 1) {
      e.preventDefault();
      const proj = document.projects.find((p) => p.id === projId);
      if (proj) {
        const nextBullets = [...proj.bullets];
        nextBullets[bulletIdx] = parsed[0];
        nextBullets.splice(bulletIdx + 1, 0, ...parsed.slice(1));
        updateProject(projId, { bullets: nextBullets });
      }
    }
  };

  const handleAddBulletToExp = (expId: string) => {
    const exp = document.experience.find((e) => e.id === expId);
    if (exp) {
      updateExperience(expId, {
        bullets: [...exp.bullets, ""],
      });
    }
  };

  const handleUpdateExpBullet = (
    expId: string,
    index: number,
    value: string,
  ) => {
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
        bullets: [...proj.bullets, ""],
      });
    }
  };

  const handleUpdateProjBullet = (
    projId: string,
    index: number,
    value: string,
  ) => {
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

  // Section icon resolver
  const getSectionIcon = (key: ResumeSectionKey) => {
    switch (key) {
      case "summary":
        return <FileText className="w-4 h-4 text-indigo-700" />;
      case "experience":
        return <Briefcase className="w-4 h-4 text-sky-700" />;
      case "education":
        return <GraduationCap className="w-4 h-4 text-emerald-700" />;
      case "skills":
        return <Wrench className="w-4 h-4 text-amber-700" />;
      case "projects":
        return <FolderGit2 className="w-4 h-4 text-purple-700" />;
      case "certifications":
        return <Award className="w-4 h-4 text-rose-700" />;
      case "custom":
        return <Layers className="w-4 h-4 text-amber-700" />;
      default:
        return <FileText className="w-4 h-4 text-slate-700" />;
    }
  };

  const getSectionBadge = (key: ResumeSectionKey, customId?: string) => {
    switch (key) {
      case "summary":
        return document.summary ? "Written" : "Empty";
      case "experience":
        return `${document.experience.length} jobs`;
      case "education":
        return `${document.education.length} degrees`;
      case "skills":
        return `${document.skillCategories.length} categories`;
      case "projects":
        return `${document.projects.length} projects`;
      case "certifications":
        return `${document.certifications.length} items`;
      case "custom": {
        const cs = document.customSections.find((c) => c.id === customId);
        return `${cs?.items.length || 0} items`;
      }
      default:
        return "";
    }
  };

  // Render individual section contents
  const renderSectionBody = (key: ResumeSectionKey, customId?: string) => {
    switch (key) {
      case "summary":
        return (
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
        );

      case "experience":
        return (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-4">
            {document.experience.map((exp) => (
              <div
                key={exp.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">
                    {exp.position || "Untitled Position"}
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
                    <label className="block text-slate-600 font-semibold mb-0.5">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) =>
                        updateExperience(exp.id, { position: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">
                      Company
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(exp.id, { company: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">
                      Location
                    </label>
                    <input
                      type="text"
                      value={exp.location || ""}
                      onChange={(e) =>
                        updateExperience(exp.id, { location: e.target.value })
                      }
                      placeholder="e.g. San Francisco, CA (or Remote)"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-slate-600 font-semibold mb-0.5">
                        Start Date
                      </label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) =>
                          updateExperience(exp.id, {
                            startDate: e.target.value,
                          })
                        }
                        placeholder="2021"
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-slate-600 font-semibold mb-0.5">
                        End Date
                      </label>
                      <input
                        type="text"
                        value={exp.isCurrent ? "Present" : exp.endDate}
                        disabled={exp.isCurrent}
                        onChange={(e) =>
                          updateExperience(exp.id, { endDate: e.target.value })
                        }
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
                    onChange={(e) =>
                      updateExperience(exp.id, { isCurrent: e.target.checked })
                    }
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <label
                    htmlFor={`current-${exp.id}`}
                    className="text-slate-700 font-medium"
                  >
                    I currently work in this role
                  </label>
                </div>

                {/* Bullets */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-slate-700">
                      Key Achievements & Bullet Points
                    </label>
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
                          onChange={(e) =>
                            handleUpdateExpBullet(exp.id, idx, e.target.value)
                          }
                          onPaste={(e) => handleExpBulletPaste(exp.id, idx, e)}
                          placeholder="e.g. Led a team of 5 engineers to deliver... (Paste multiline text to split into multiple bullets)"
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
                              onApply: (improved) =>
                                handleUpdateExpBullet(exp.id, idx, improved),
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
        );

      case "education":
        return (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-4">
            {document.education.map((edu) => (
              <div
                key={edu.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">
                    {edu.degree || "Degree"}
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
                    <label className="block text-slate-600 font-semibold mb-0.5">
                      Degree / Certificate
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(edu.id, { degree: e.target.value })
                      }
                      placeholder="B.S. in Computer Science"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">
                      Institution / University
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) =>
                        updateEducation(edu.id, { institution: e.target.value })
                      }
                      placeholder="University of California"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">
                      Graduation Period
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={(e) =>
                          updateEducation(edu.id, { startDate: e.target.value })
                        }
                        placeholder="2016"
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                      />
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) =>
                          updateEducation(edu.id, { endDate: e.target.value })
                        }
                        placeholder="2020"
                        className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">
                      GPA / Honors / Distinction
                    </label>
                    <input
                      type="text"
                      value={edu.gradeOrGpa || ""}
                      onChange={(e) =>
                        updateEducation(edu.id, { gradeOrGpa: e.target.value })
                      }
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
        );

      case "skills":
        return (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-4">
            {document.skillCategories.map((cat) => (
              <div
                key={cat.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={cat.categoryName}
                    onChange={(e) =>
                      updateSkillCategory(cat.id, {
                        categoryName: e.target.value,
                      })
                    }
                    className="font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-400 focus:outline-none focus:border-teal-600 pb-0.5 text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setBulkSkillsModal({
                          isOpen: true,
                          categoryId: cat.id,
                          categoryName: cat.categoryName,
                          text: "",
                        })
                      }
                      className="text-teal-700 hover:text-teal-800 text-[11px] font-semibold flex items-center gap-1 bg-teal-50 px-2 py-1 rounded border border-teal-200 hover:bg-teal-100 transition"
                      title="Paste multiple multiline or comma-separated skills at once"
                    >
                      <ClipboardPaste className="w-3.5 h-3.5" />
                      Bulk Paste
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSkillCategory(cat.id)}
                      className="text-rose-600 hover:text-rose-700 p-1"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Skill Chips */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  {cat.skills.length === 0 && (
                    <span className="text-slate-400 text-xs italic">
                      No skills added yet. Paste a list or type below.
                    </span>
                  )}
                  {cat.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-300 rounded-md text-xs text-slate-800 shadow-2xs"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkillFromCategory(cat.id, idx)}
                        className="text-slate-400 hover:text-rose-600 text-sm font-bold ml-0.5"
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
                    value={newSkillInputs[cat.id] || ""}
                    onChange={(e) =>
                      setNewSkillInputs((prev) => ({
                        ...prev,
                        [cat.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => handleSkillKeyDown(cat.id, e)}
                    onPaste={(e) => handleSkillInputPaste(cat.id, e)}
                    placeholder="Type skill & press Enter, or paste multiple (e.g. Next.js, Node.js)"
                    className="flex-1 px-2.5 py-1.5 bg-white rounded border border-slate-300 text-xs focus:outline-teal-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkillFromInput(cat.id)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded text-xs transition"
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
              Add Skill Category (e.g. Tools, Soft Skills, Cloud)
            </button>
          </div>
        );

      case "projects":
        return (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-4">
            {document.projects.map((proj) => (
              <div
                key={proj.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">
                    {proj.name || "Project Name"}
                  </span>
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
                    <label className="block text-slate-600 font-semibold mb-0.5">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) =>
                        updateProject(proj.id, { name: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">
                      Role / Subtitle
                    </label>
                    <input
                      type="text"
                      value={proj.roleOrSubtitle || ""}
                      onChange={(e) =>
                        updateProject(proj.id, {
                          roleOrSubtitle: e.target.value,
                        })
                      }
                      placeholder="Lead Developer / Solo Creator"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">
                      Project URL / GitHub
                    </label>
                    <input
                      type="text"
                      value={proj.link || ""}
                      onChange={(e) =>
                        updateProject(proj.id, { link: e.target.value })
                      }
                      placeholder="https://github.com/..."
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-0.5">
                      Tech Stack (comma separated)
                    </label>
                    <input
                      type="text"
                      value={proj.techStack?.join(", ") || ""}
                      onChange={(e) =>
                        updateProject(proj.id, {
                          techStack: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
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
                    <label className="font-semibold text-slate-700">
                      Project Highlights
                    </label>
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
                          onChange={(e) =>
                            handleUpdateProjBullet(proj.id, idx, e.target.value)
                          }
                          onPaste={(e) =>
                            handleProjBulletPaste(proj.id, idx, e)
                          }
                          placeholder="Project achievement (paste multiline text to split)"
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
                              onApply: (improved) =>
                                handleUpdateProjBullet(proj.id, idx, improved),
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
        );

      case "certifications":
        return (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-3">
            {document.certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    {cert.name || "Certification"}
                  </span>
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
                      onChange={(e) =>
                        updateCertification(cert.id, { name: e.target.value })
                      }
                      placeholder="Certificate Name"
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) =>
                        updateCertification(cert.id, { issuer: e.target.value })
                      }
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
        );

      case "custom": {
        const cs = document.customSections.find((c) => c.id === customId);
        if (!cs) return null;
        return (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-3">
            <div className="space-y-2">
              {cs.items.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        updateCustomSectionItem(cs.id, item.id, {
                          title: e.target.value,
                        })
                      }
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
                    value={item.subtitle || ""}
                    onChange={(e) =>
                      updateCustomSectionItem(cs.id, item.id, {
                        subtitle: e.target.value,
                      })
                    }
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
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* 1. Contact Information (Always fixed at top) */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection("contact")}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Personal & Contact Info
              </h3>
              <p className="text-[11px] text-slate-500">
                Name, target title, email, phone, location & links
              </p>
            </div>
          </div>
          {openSection === "contact" ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {openSection === "contact" && (
          <div className="p-4 pt-1 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={document.contact.fullName}
                onChange={(e) => updateContact({ fullName: e.target.value })}
                placeholder="e.g. Priyal Patel"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 font-medium"
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                Target Job Title
              </label>
              <input
                type="text"
                value={document.contact.jobTitle}
                onChange={(e) => updateContact({ jobTitle: e.target.value })}
                placeholder="e.g. Flutter Developer"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={document.contact.email}
                onChange={(e) => updateContact({ email: e.target.value })}
                placeholder="priyalpatel2709@gmail.com"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={document.contact.phone}
                onChange={(e) => updateContact({ phone: e.target.value })}
                placeholder="+91-8141513344"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Location / City
              </label>
              <input
                type="text"
                value={document.contact.location}
                onChange={(e) => updateContact({ location: e.target.value })}
                placeholder="Vadodara, India"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Portfolio / Website
              </label>
              <input
                type="text"
                value={document.contact.website || ""}
                onChange={(e) => updateContact({ website: e.target.value })}
                placeholder="https://yourportfolio.com"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                LinkedIn Profile
              </label>
              <input
                type="text"
                value={document.contact.linkedin || ""}
                onChange={(e) => updateContact({ linkedin: e.target.value })}
                placeholder="linkedin.com/in/priyalpatel2709"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                GitHub / Code Link
              </label>
              <input
                type="text"
                value={document.contact.github || ""}
                onChange={(e) => updateContact({ github: e.target.value })}
                placeholder="github.com/priyalpatel2709"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                Profile Photo URL (Optional)
              </label>
              <input
                type="text"
                value={document.contact.photoUrl || ""}
                onChange={(e) => updateContact({ photoUrl: e.target.value })}
                placeholder="https://... or paste image URL"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-teal-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* DYNAMIC SECTIONS ACCORDION IN USER-ORDERED SEQUENCE */}
      {document.sectionOrder.map((section, idx) => {
        const sectionId = section.customId || section.key;
        const isOpen = openSection === sectionId;
        const isHidden = section.visible === false;

        return (
          <div
            key={sectionId}
            className={`bg-white rounded-xl border shadow-2xs overflow-hidden transition ${
              isHidden
                ? "border-slate-200/50 opacity-75"
                : "border-slate-200/80"
            }`}
          >
            {/* Accordion Header */}
            <div className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition border-b border-transparent">
              <button
                type="button"
                onClick={() => toggleSection(sectionId)}
                className="flex items-center gap-2.5 flex-1 cursor-pointer text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold shrink-0">
                  {getSectionIcon(section.key)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      #{idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {section.title}
                    </h3>
                    {isHidden && (
                      <span className="text-[10px] bg-slate-100 text-slate-500 font-medium px-2 py-0.5 rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {getSectionBadge(section.key, section.customId)}
                  </p>
                </div>
              </button>

              {/* Quick Actions on Header: Up / Down / Rename / Eye / Chevron */}
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSection(idx, "up");
                  }}
                  className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-20 transition"
                  title="Move section up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === document.sectionOrder.length - 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSection(idx, "down");
                  }}
                  className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-20 transition"
                  title="Move section down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSectionVisibility(section.key, section.customId);
                  }}
                  className={`p-1 rounded transition ${
                    !isHidden
                      ? "text-slate-400 hover:text-teal-700 hover:bg-slate-100"
                      : "text-amber-600 bg-amber-50"
                  }`}
                  title={
                    !isHidden
                      ? "Hide section from resume"
                      : "Show section on resume"
                  }
                >
                  {!isHidden ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => toggleSection(sectionId)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Quick Title Editor (inside header if open) */}
            {isOpen && (
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-xs">
                <label className="text-slate-500 font-medium shrink-0">
                  Header text:
                </label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) =>
                    updateSectionTitle(
                      section.key,
                      e.target.value,
                      section.customId,
                    )
                  }
                  placeholder="Custom section header"
                  className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-800 text-xs focus:outline-teal-600"
                />
                {section.key === "custom" && section.customId && (
                  <button
                    type="button"
                    onClick={() => deleteCustomSection(section.customId!)}
                    className="text-rose-600 hover:text-rose-700 p-1"
                    title="Delete entire custom section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Accordion Content */}
            {isOpen && renderSectionBody(section.key, section.customId)}
          </div>
        );
      })}

      {/* Add New Custom Section Card */}
      <div className="p-3.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 flex items-center gap-2">
        <input
          type="text"
          value={newCustomTitle}
          onChange={(e) => setNewCustomTitle(e.target.value)}
          placeholder="New custom section (e.g. Languages, Publications, Awards)"
          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-teal-600"
        />
        <button
          type="button"
          onClick={() => {
            if (newCustomTitle.trim()) {
              addCustomSection(newCustomTitle.trim());
              setNewCustomTitle("");
            }
          }}
          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition"
        >
          Add Section
        </button>
      </div>

      {/* BULK SKILLS PASTE MODAL */}
      {bulkSkillsModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                  <ClipboardPaste className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Bulk Paste Skills
                  </h3>
                  <p className="text-xs text-slate-500">
                    Adding to:{" "}
                    <span className="font-semibold text-slate-700">
                      {bulkSkillsModal.categoryName}
                    </span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setBulkSkillsModal({
                    isOpen: false,
                    categoryId: "",
                    categoryName: "",
                    text: "",
                  })
                }
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Paste your skills list below (multiline, bulleted, or comma
                separated):
              </label>
              <textarea
                rows={7}
                value={bulkSkillsModal.text}
                onChange={(e) =>
                  setBulkSkillsModal((prev) => ({
                    ...prev,
                    text: e.target.value,
                  }))
                }
                placeholder={`Effective Communication\nActive Listening\nCustomer Handling\nNegotiation Skills\nProblem-Solving\nTime Management\nTeamwork & Collaboration`}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono leading-relaxed focus:outline-teal-600"
              />
            </div>

            {/* Live Preview Count & Chips */}
            {bulkSkillsModal.text.trim() && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Detected individual skills:</span>
                  <span className="text-teal-700 font-bold bg-teal-100 px-2 py-0.5 rounded-full">
                    {parsePastedList(bulkSkillsModal.text).length} skills
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {parsePastedList(bulkSkillsModal.text).map((s, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() =>
                  setBulkSkillsModal({
                    isOpen: false,
                    categoryId: "",
                    categoryName: "",
                    text: "",
                  })
                }
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={parsePastedList(bulkSkillsModal.text).length === 0}
                onClick={handleApplyBulkSkills}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-40 transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Add {parsePastedList(bulkSkillsModal.text).length} Skills
              </button>
            </div>
          </div>
        </div>
      )}

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
