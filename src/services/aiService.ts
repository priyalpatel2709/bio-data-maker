import { ResumeDocument, SkillCategory } from '../types/resume';
import { CoverLetterDocument, JobTailoredResult } from '../types/coverLetter';
import {
  RESUME_AI_SYSTEM_PROMPT,
  BULLET_IMPROVER_PROMPT,
  SUMMARY_GENERATOR_PROMPT,
  ATS_JOB_MATCHER_PROMPT,
  JOB_TAILOR_AND_COVER_LETTER_PROMPT,
} from './aiPrompts';
import { getSupabaseClient } from './supabaseClient';

export type AIProvider = 'nara' | 'openrouter' | 'agentrouter';

export interface AIProviderMeta {
  id: AIProvider;
  name: string;
  tagline: string;
  defaultBaseUrl: string;
  proxyPath: string;
  keyPlaceholder: string;
  getKeyUrl: string;
  models: Array<{ id: string; name: string }>;
}

export const AI_PROVIDERS: Record<AIProvider, AIProviderMeta> = {
  nara: {
    id: 'nara',
    name: 'Nara Router',
    tagline: 'Multi-model router with generous free access',
    defaultBaseUrl: 'https://router.bynara.id/v1',
    proxyPath: '/api/nara',
    keyPlaceholder: 'nr-sk-... or bynara-...',
    getKeyUrl: 'https://router.bynara.id',
    models: [
      { id: 'agnes-2.5-flash', name: 'agnes-2.5-flash (Fast Vision & Text - Free)' },
      { id: 'laguna-s-2.1', name: 'laguna-s-2.1 (High Speed Text - Free)' },
      { id: 'minimax-m3.1-flash:free', name: 'minimax-m3.1-flash:free (Vision & Text - Free)' },
      { id: 'nemotron-3.5-lightning-free', name: 'nemotron-3.5-lightning-free (NVIDIA Nemotron - Free)' },
    ],
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    tagline: '100% Free text models with zero cost per token',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    proxyPath: '/api/openrouter',
    keyPlaceholder: 'sk-or-v1-...',
    getKeyUrl: 'https://openrouter.ai/keys',
    models: [
      { id: 'openrouter/free', name: 'openrouter/free (Auto Free Router - 100% Free)' },
      { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'meta-llama/llama-3.3-70b-instruct:free (Free)' },
      { id: 'deepseek/deepseek-r1:free', name: 'deepseek/deepseek-r1:free (Reasoning - Free)' },
      { id: 'deepseek/deepseek-chat:free', name: 'deepseek/deepseek-chat:free (V3 - Free)' },
      { id: 'qwen/qwen-2.5-72b-instruct:free', name: 'qwen/qwen-2.5-72b-instruct:free (Free)' },
      { id: 'google/gemma-2-9b-it:free', name: 'google/gemma-2-9b-it:free (Free)' },
      { id: 'mistralai/mistral-7b-instruct:free', name: 'mistralai/mistral-7b-instruct:free (Free)' },
    ],
  },
  agentrouter: {
    id: 'agentrouter',
    name: 'AgentRouter',
    tagline: 'OpenAI-compatible Agent & LLM Router',
    defaultBaseUrl: 'https://agentrouter.ai/v1',
    proxyPath: '/api/agentrouter',
    keyPlaceholder: 'sk-...',
    getKeyUrl: 'https://agentrouter.ai',
    models: [
      { id: 'auto', name: 'Auto Router' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
      { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
      { id: 'deepseek-chat', name: 'DeepSeek Chat' },
      { id: 'llama-3.3-70b', name: 'Llama 3.3 70B' },
    ],
  },
};

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface AtsMatchResult {
  matchScore: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}

const STORAGE_KEY = 'resume_ai_router_settings';

export const DEFAULT_AI_SETTINGS: AISettings = {
  provider: 'nara',
  apiKey: '',
  baseUrl: AI_PROVIDERS.nara.defaultBaseUrl,
  model: 'agnes-2.5-flash',
};

// Backwards-compatible export for any components importing AVAILABLE_MODELS
export const AVAILABLE_MODELS = AI_PROVIDERS.nara.models;

export function getAISettings(): AISettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('nara_router_ai_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      const provider: AIProvider =
        parsed.provider === 'openrouter' || parsed.provider === 'agentrouter'
          ? parsed.provider
          : 'nara';
      const providerMeta = AI_PROVIDERS[provider];
      const isValidModel = providerMeta.models.some((m) => m.id === parsed.model);

      return {
        provider,
        apiKey: parsed.apiKey || '',
        baseUrl: parsed.baseUrl || providerMeta.defaultBaseUrl,
        model: isValidModel ? parsed.model : providerMeta.models[0].id,
      };
    }
  } catch (err) {
    console.warn('Failed to parse AI settings from storage:', err);
  }
  return { ...DEFAULT_AI_SETTINGS };
}

export function saveAISettings(settings: Partial<AISettings>): AISettings {
  const current = getAISettings();
  const provider = settings.provider || current.provider || 'nara';
  const providerMeta = AI_PROVIDERS[provider];

  const updated: AISettings = {
    provider,
    apiKey: settings.apiKey !== undefined ? settings.apiKey.trim() : current.apiKey,
    baseUrl: (settings.baseUrl || providerMeta.defaultBaseUrl).trim().replace(/\/+$/, ''),
    model: settings.model || current.model || providerMeta.models[0].id,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // If Supabase user is logged in, sync AI settings to cloud
  try {
    const client = getSupabaseClient();
    if (client) {
      client.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.id) {
          client
            .from('user_settings')
            .upsert(
              {
                user_id: session.user.id,
                ai_settings: updated,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'user_id' }
            )
            .then(() => {});
        }
      }).catch(() => {});
    }
  } catch {
    // silent fallback for offline / guest mode
  }

  return updated;
}

export function isAIConfigured(): boolean {
  const settings = getAISettings();
  return Boolean(settings.apiKey && settings.apiKey.trim().length > 3);
}

// Helper to clean JSON responses from markdown code blocks
function cleanJsonOutput(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/i, '');
  }
  return cleaned.trim();
}

function getCandidateEndpoints(provider: AIProvider, baseUrl: string): string[] {
  const cleanUrl = baseUrl.trim().replace(/\/+$/, '');
  const list: string[] = [];

  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.port === '5173');

  const meta = AI_PROVIDERS[provider] || AI_PROVIDERS.nara;

  // If on localhost (Vite dev server), prefer the local Vite proxy to avoid CORS
  if (isLocal) {
    list.push(`${meta.proxyPath}/chat/completions`);
  }

  // Direct endpoint
  if (cleanUrl.endsWith('/chat/completions')) {
    list.push(cleanUrl);
  } else {
    list.push(`${cleanUrl}/chat/completions`);
  }

  return list;
}

async function fetchWithFallback(
  provider: AIProvider,
  baseUrl: string,
  apiKey: string,
  body: any
): Promise<Response> {
  const endpoints = getCandidateEndpoints(provider, baseUrl);
  let lastError: any = null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey.trim()}`,
  };

  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    headers['X-Title'] = 'Bio Data & Resume Maker';
  }

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      return res;
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error(`Network error: Unable to reach ${AI_PROVIDERS[provider]?.name || 'AI'} endpoint.`);
}

export async function callAIChatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  modelOverride?: string
): Promise<string> {
  const settings = getAISettings();
  if (!settings.apiKey) {
    throw new Error('AI API key is not configured. Please enter your API key in AI Settings.');
  }

  const model = modelOverride || settings.model || 'auto';

  const response = await fetchWithFallback(settings.provider, settings.baseUrl, settings.apiKey, {
    model,
    messages,
    temperature: 0.7,
    max_tokens: 1500,
  });

  if (!response.ok) {
    let errorMsg = `API Error ${response.status}: ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.error?.message) {
        errorMsg = errJson.error.message;
      } else if (errJson.message) {
        errorMsg = errJson.message;
      }
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('No content returned from AI model.');
  }

  return content;
}

// Alias for backwards compatibility
export const callNaraChatCompletion = callAIChatCompletion;

export async function testAIConnection(
  provider: AIProvider = 'nara',
  apiKey: string,
  baseUrl?: string,
  model?: string
): Promise<{ success: boolean; message: string; modelUsed?: string }> {
  try {
    const meta = AI_PROVIDERS[provider] || AI_PROVIDERS.nara;
    const effectiveBaseUrl = baseUrl || meta.defaultBaseUrl;
    const effectiveModel = model || meta.models[0].id;

    const res = await fetchWithFallback(provider, effectiveBaseUrl, apiKey, {
      model: effectiveModel,
      messages: [{ role: 'user', content: 'Respond with the word OK if you receive this.' }],
      max_tokens: 10,
    });

    if (!res.ok) {
      let errText = `Status ${res.status}`;
      try {
        const errData = await res.json();
        errText = errData.error?.message || errData.message || errText;
      } catch {
        // ignore
      }
      return { success: false, message: `Connection failed: ${errText}` };
    }

    const data = await res.json();
    return {
      success: true,
      message: `Connection successful! ${meta.name} is ready to assist.`,
      modelUsed: data.model || effectiveModel,
    };
  } catch (err: any) {
    return {
      success: false,
      message:
        err.message ||
        'CORS / Network Error: Could not reach the endpoint. Ensure the dev server proxy is active.',
    };
  }
}

// Alias for backwards compatibility
export async function testNaraConnection(
  apiKey: string,
  baseUrl?: string,
  model?: string
): Promise<{ success: boolean; message: string; modelUsed?: string }> {
  return testAIConnection('nara', apiKey, baseUrl, model);
}

// 1. Polish Bullet Point
export async function improveBulletPoint(
  bullet: string,
  context?: { position?: string; company?: string }
): Promise<string[]> {
  const prompt = BULLET_IMPROVER_PROMPT(bullet, context?.position, context?.company);
  const responseText = await callAIChatCompletion([
    { role: 'system', content: RESUME_AI_SYSTEM_PROMPT },
    { role: 'user', content: prompt },
  ]);

  try {
    const cleaned = cleanJsonOutput(responseText);
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item) => String(item).trim());
    }
  } catch (e) {
    console.warn('Failed to parse bullet suggestions as JSON, falling back to line split:', e);
  }

  // Fallback: split by lines
  return responseText
    .split('\n')
    .map((line) => line.replace(/^[-*•\d.)\s]+/, '').trim())
    .filter((line) => line.length > 10)
    .slice(0, 3);
}

// 2. Generate Professional Summary
export async function generateSummary(candidateContext: {
  fullName?: string;
  jobTitle?: string;
  skills?: string[];
  topExperiences?: string[];
}): Promise<string[]> {
  const prompt = SUMMARY_GENERATOR_PROMPT(candidateContext);
  const responseText = await callAIChatCompletion([
    { role: 'system', content: RESUME_AI_SYSTEM_PROMPT },
    { role: 'user', content: prompt },
  ]);

  try {
    const cleaned = cleanJsonOutput(responseText);
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item) => String(item).trim());
    }
  } catch (e) {
    console.warn('Failed to parse summary suggestions as JSON:', e);
  }

  return responseText
    .split('\n\n')
    .map((p) => p.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter((p) => p.length > 20)
    .slice(0, 3);
}

// 3. ATS Job Match & Keyword Gap Analysis
export async function analyzeJobMatch(
  resume: ResumeDocument,
  jobDescription: string
): Promise<AtsMatchResult> {
  const resumeLines: string[] = [
    `Name: ${resume.contact.fullName}`,
    `Title: ${resume.contact.jobTitle}`,
    `Summary: ${resume.summary}`,
    'Work Experience:',
    ...resume.experience.map(
      (e) => `- ${e.position} at ${e.company} (${e.startDate}-${e.endDate}): ${e.bullets.join(' ')}`
    ),
    'Skills:',
    ...resume.skillCategories.map((s) => `- ${s.categoryName}: ${s.skills.join(', ')}`),
    'Education:',
    ...resume.education.map((ed) => `- ${ed.degree} from ${ed.institution}`),
    'Projects:',
    ...resume.projects.map((p) => `- ${p.name}: ${p.bullets.join(' ')}`),
  ];

  const resumeText = resumeLines.join('\n');
  const prompt = ATS_JOB_MATCHER_PROMPT(resumeText, jobDescription);

  const responseText = await callAIChatCompletion([
    { role: 'system', content: RESUME_AI_SYSTEM_PROMPT },
    { role: 'user', content: prompt },
  ]);

  try {
    const cleaned = cleanJsonOutput(responseText);
    const parsed = JSON.parse(cleaned);
    return {
      matchScore: Math.min(100, Math.max(0, Number(parsed.matchScore) || 70)),
      matchingKeywords: Array.isArray(parsed.matchingKeywords) ? parsed.matchingKeywords : [],
      missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
    };
  } catch (e) {
    console.error('Failed to parse ATS match result JSON:', e, responseText);
    return {
      matchScore: 65,
      matchingKeywords: ['Key skills identified'],
      missingKeywords: ['Target industry requirements'],
      recommendations: ['Add specific keywords from the job description directly into your skills.'],
    };
  }
}

// 4. Tailor Resume Details & Generate Cover Letter from Job Description
export async function tailorResumeAndCoverLetter(
  resume: ResumeDocument,
  jobDescription: string
): Promise<JobTailoredResult> {
  const resumeSummaryText: string[] = [
    `Name: ${resume.contact.fullName}`,
    `Current Job Title: ${resume.contact.jobTitle}`,
    `Email: ${resume.contact.email} | Phone: ${resume.contact.phone} | Location: ${resume.contact.location}`,
    `LinkedIn: ${resume.contact.linkedin || 'N/A'} | GitHub: ${resume.contact.github || 'N/A'}`,
    `Current Professional Summary: ${resume.summary}`,
    'Work Experience:',
    ...resume.experience.map(
      (e) => `• Position: ${e.position} at ${e.company} (${e.startDate} - ${e.endDate})\n  Bullets:\n  ${e.bullets.map(b => '  - ' + b).join('\n')}`
    ),
    'Skills:',
    ...resume.skillCategories.map((sc) => `• ${sc.categoryName}: ${sc.skills.join(', ')}`),
    'Education:',
    ...resume.education.map((edu) => `• ${edu.degree} from ${edu.institution}`),
    'Projects:',
    ...resume.projects.map((p) => `• ${p.name}: ${p.bullets.join(' ')}`),
  ];

  const resumeText = resumeSummaryText.join('\n');
  const prompt = JOB_TAILOR_AND_COVER_LETTER_PROMPT(resumeText, jobDescription);

  const responseText = await callAIChatCompletion([
    { role: 'system', content: RESUME_AI_SYSTEM_PROMPT },
    { role: 'user', content: prompt },
  ]);

  let parsed: any = null;
  try {
    const cleaned = cleanJsonOutput(responseText);
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.warn('Failed to parse tailored result as JSON, attempting loose regex recovery:', err);
  }

  // Fallbacks if AI output was not 100% strict JSON
  const targetJobTitle = parsed?.targetJobTitle || resume.contact.jobTitle || 'Target Role';
  const targetCompany = parsed?.targetCompany || 'Hiring Organization';
  const atsScore = Math.min(100, Math.max(0, Number(parsed?.atsScore) || 82));
  const matchingKeywords = Array.isArray(parsed?.matchingKeywords) ? parsed.matchingKeywords : [];
  const missingKeywords = Array.isArray(parsed?.missingKeywords) ? parsed.missingKeywords : [];
  const recommendations = Array.isArray(parsed?.recommendations) ? parsed.recommendations : [];

  // 1. Build Tailored Skills
  let tailoredSkills: SkillCategory[] = [];
  if (Array.isArray(parsed?.tailoredSkills) && parsed.tailoredSkills.length > 0) {
    tailoredSkills = parsed.tailoredSkills.map((ts: any, idx: number) => ({
      id: 'sc-tailored-' + (idx + 1) + '-' + Date.now(),
      categoryName: ts.categoryName || `Category ${idx + 1}`,
      skills: Array.isArray(ts.skills) ? ts.skills : [],
    }));
  } else {
    // Preserve existing with missing keywords prepended
    tailoredSkills = resume.skillCategories.map(sc => ({ ...sc }));
    if (missingKeywords.length > 0) {
      tailoredSkills.unshift({
        id: 'sc-tailored-keywords-' + Date.now(),
        categoryName: 'Target Competencies & Keywords',
        skills: missingKeywords.slice(0, 8),
      });
    }
  }

  // 2. Build Tailored Experience Bullets
  const experienceImprovements: Array<{ company: string; bullets: string[] }> =
    Array.isArray(parsed?.experienceBulletImprovements)
      ? parsed.experienceBulletImprovements
      : [];

  const tailoredExperience = resume.experience.map((exp) => {
    const matchedImprovement = experienceImprovements.find(
      (imp) =>
        imp.company &&
        exp.company &&
        (imp.company.toLowerCase().includes(exp.company.toLowerCase()) ||
          exp.company.toLowerCase().includes(imp.company.toLowerCase()))
    );

    if (matchedImprovement && Array.isArray(matchedImprovement.bullets) && matchedImprovement.bullets.length > 0) {
      return {
        ...exp,
        bullets: matchedImprovement.bullets,
      };
    }
    return { ...exp };
  });

  const nowIso = new Date().toISOString();
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // 3. Build Tailored Cover Letter
  const rawCl = parsed?.coverLetter || {};
  const recipient = {
    name: rawCl.recipientName || 'Hiring Team',
    title: rawCl.recipientTitle || 'Talent Acquisition Team',
    company: rawCl.recipientCompany || targetCompany,
    location: rawCl.recipientLocation || 'Company Headquarters / Remote',
  };

  const sender = {
    fullName: resume.contact.fullName || 'Candidate',
    jobTitle: parsed?.tailoredJobTitle || targetJobTitle,
    email: resume.contact.email,
    phone: resume.contact.phone,
    location: resume.contact.location,
    linkedin: resume.contact.linkedin,
    website: resume.contact.website,
  };

  const salutation = rawCl.salutation || `Dear Hiring Team at ${targetCompany},`;
  const openingParagraph =
    rawCl.openingParagraph ||
    `I am writing to express my strong enthusiasm for the ${targetJobTitle} position at ${targetCompany}. With my background in ${resume.contact.jobTitle} and proven experience delivering measurable impact, I am confident in my ability to exceed expectations in this role.`;

  const bodyParagraphs: string[] =
    Array.isArray(rawCl.bodyParagraphs) && rawCl.bodyParagraphs.length > 0
      ? rawCl.bodyParagraphs
      : [
          `Throughout my career, I have specialized in architecting scalable solutions, driving team efficiency, and delivering high-quality results. My hands-on background directly aligns with the technical and operational requirements specified for this position at ${targetCompany}.`,
          `I am particularly energized by ${targetCompany}'s commitment to innovation. I welcome the opportunity to leverage my skill set in ${matchingKeywords.slice(0, 4).join(', ') || 'modern engineering'} to contribute immediately to your team's upcoming milestones.`,
        ];

  const closingParagraph =
    rawCl.closingParagraph ||
    `Thank you for your time and consideration. I welcome the opportunity to discuss how my skill set and achievements align with ${targetCompany}'s strategic objectives during an interview.`;

  const signOff = rawCl.signOff || 'Sincerely,';

  // Plain-text formatted version for quick copying
  const fullContentText = [
    sender.fullName.toUpperCase(),
    [sender.jobTitle, sender.email, sender.phone, sender.location].filter(Boolean).join(' | '),
    '',
    dateFormatted,
    '',
    recipient.name,
    recipient.title ? `${recipient.title}, ${recipient.company}` : recipient.company,
    recipient.location,
    '',
    salutation,
    '',
    openingParagraph,
    '',
    bodyParagraphs.join('\n\n'),
    '',
    closingParagraph,
    '',
    signOff,
    sender.fullName,
  ].join('\n');

  const coverLetter: CoverLetterDocument = {
    id: 'coverletter-' + Date.now(),
    title: `Cover Letter - ${targetJobTitle} at ${targetCompany}`,
    targetRole: targetJobTitle,
    targetCompany: targetCompany,
    date: dateFormatted,
    recipient,
    sender,
    salutation,
    openingParagraph,
    bodyParagraphs,
    closingParagraph,
    signOff,
    fullContentText,
  };

  // 4. Build Complete Tailored Resume Document
  const tailoredResume: ResumeDocument = {
    ...JSON.parse(JSON.stringify(resume)),
    id: 'resume-tailored-' + Date.now(),
    title: `${targetJobTitle} - ${targetCompany}`,
    createdAt: nowIso,
    updatedAt: nowIso,
    contact: {
      ...resume.contact,
      jobTitle: parsed?.tailoredJobTitle || targetJobTitle,
    },
    summary: parsed?.tailoredSummary || resume.summary,
    experience: tailoredExperience,
    skillCategories: tailoredSkills,
    targetJob: {
      title: targetJobTitle,
      company: targetCompany,
      matchScore: atsScore,
    },
    coverLetter,
  };

  return {
    targetJobTitle,
    targetCompany,
    atsScore,
    matchingKeywords,
    missingKeywords,
    recommendations,
    tailoredResume,
    coverLetter,
  };
}

